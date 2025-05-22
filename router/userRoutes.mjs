import express from "express";
import { body } from "express-validator";
import db from "../db/database.mjs";
import { validate } from "../middleware/validator.mjs";
import bcrypt from "bcrypt";
import CoolsmsPkg from "coolsms-node-sdk";
import dotenv from "dotenv";
import { config } from "../config.mjs";
import jwt from "jsonwebtoken";

import {
  logIn,
  signUp,
  toSignUp,
  toLogin,
  duplicateIdCheck,
  logOut,
  findUserId,
  toFindId,
  toFindPw,
} from "../controller/userController.mjs";

dotenv.config();

const router = express.Router();
const Coolsms = CoolsmsPkg.default;
const messageService = new Coolsms(
  process.env.apiKey_pw,
  process.env.apiSecret_pw
);
const authCodes = new Map();

// 로그인 유효성 검사
const validateLogin = [
  body("inputId")
    .trim()
    .isLength({ min: 4 })
    .withMessage("아이디는 최소 4자 이상 입력해야 합니다.")
    .matches(/^[a-zA-Z0-9]*$/)
    .withMessage("특수문자는 사용할 수 없습니다."),
  body("inputPw")
    .trim()
    .isLength({ min: 8 })
    .withMessage("비밀번호는 최소 8자 이상 입력해야 합니다."),
  validate,
];

// 회원가입 유효성 검사
const validateSignup = [
  ...validateLogin,
  body("name").trim().notEmpty().withMessage("이름을 입력하세요."),
  body("email").trim().isEmail().withMessage("이메일 형식을 확인하세요."),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("전화번호를 입력하세요.")
    .matches(/^\d{3}-\d{3,4}-\d{4}$/)
    .withMessage("휴대폰번호 형식이 올바르지 않습니다. '-'를 포함하세요."),
  validate,
];

// 기본 회원 기능
router.post("/signUp", validateSignup, signUp);
router.get("/signUp", toSignUp);
router.post("/duplicateCheck", duplicateIdCheck);
router.post("/logIn", logIn);
router.get("/logIn", toLogin);
router.get("/logout", logOut);
router.post("/find-id", findUserId);
router.get("/find-id.html", toFindId);
router.get("/find-pw.html", toFindPw);

// 인증번호 발송
router.post("/sendSms", async (req, res) => {
  const { pwId, pwPhone } = req.body;

  if (!pwId || !pwPhone) {
    return res
      .status(400)
      .json({ message: "아이디 또는 전화번호가 누락되었습니다." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE userId = ? AND phone = ?",
      [pwId, pwPhone]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    authCodes.set(pwPhone, code);
    setTimeout(() => authCodes.delete(pwPhone), 5 * 60 * 1000); // 5분 만료

    const result = await messageService.sendOne({
      to: pwPhone,
      from: process.env.senderNumber,
      text: `[인증번호] ${code} 를 입력해주세요.`,
    });

    console.log("문자 전송 결과:", result);
    res.status(200).json({ message: "인증번호 전송 완료" });
  } catch (error) {
    console.error("문자 전송 실패:", error);
    if (error.message.includes("NotEnoughBalance")) {
      return res.status(402).json({
        message: "📛 잔액이 부족하여 문자 발송에 실패했습니다.",
      });
    }
    res.status(500).json({ message: "서버 오류" });
  }
});

// 인증번호 확인
router.post("/verifyCode", (req, res) => {
  const { pwPhone, code, pwId } = req.body;

  if (!authCodes.has(pwPhone)) {
    return res
      .status(410)
      .json({ message: "인증번호가 만료되었거나 없습니다." });
  }

  const storedCode = authCodes.get(pwPhone);
  if (storedCode !== code) {
    return res.status(400).json({ message: "인증번호가 일치하지 않습니다." });
  }
  const tmpToken = jwt.sign({ userId: pwId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  authCodes.delete(pwPhone);
  res.status(200).json({ message: "인증 성공", tmpToken });
});

// 비밀번호 재설정 (bcrypt 적용)
router.post("/resetPassword", async (req, res) => {
  const { userId, newPassword, tmpToken } = req.body;
  console.log("tmpToken", tmpToken);
  if (!userId || !newPassword) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }
  if (!tmpToken) {
    return res.status(400).json({ message: "임시 토큰이 누락되었습니다." });
  }
  if (!jwt.verify(tmpToken, process.env.JWT_SECRET)) {
    return res.status(400).json({ message: "임시 토큰이 유효하지 않습니다." });
  }

  try {
    const saltRounds = config.bcrypt.saltRounds || 10;
    const hashedPw = await bcrypt.hash(newPassword, saltRounds); // bcrypt로 해싱

    await db.execute("UPDATE users SET userpw = ? WHERE userid = ?", [
      hashedPw,
      userId,
    ]);

    res.status(200).json({
      message: "비밀번호가 성공적으로 재설정되었습니다.",
    });
  } catch (err) {
    console.error("비밀번호 재설정 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;
