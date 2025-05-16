import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";

import {
  logIn,
  signUp,
  toSignUp,
  toLogin,
  duplicateIdCheck,
  logOut,
} from "../controller/userController.mjs";

const router = express.Router();

// 로그인 validator
const validateLogin = [
  body("inputId")
    .trim()
    .isLength({ min: 4 })
    .withMessage("아이디는 최소 4자이상 입력해야합니다")
    .matches(/^[a-zA-Z0-9]*$/)
    .withMessage("특수문자는 사용할 수 없습니다."),

  body("inputPw")
    .trim()
    .isLength({ min: 8 })
    .withMessage("비밀번호는 최소 8자이상 입력해야합니다."),

  validate,
];

const validateSignup = [
  ...validateLogin,
  body("name").trim().notEmpty().withMessage("이름을 입력하세요."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("맞는 이메일 형식인지 확인하세요."),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("전화번호를 입력하세요.")
    .matches(/^\d{3}-\d{3,4}-\d{4}$/)
    .withMessage(
      "휴대폰번호 형식이 일치하지 않습니다.\n'-'를 번호사이에 붙여주세요."
    ),
  validate,
];

// 회원가입
router.post("/signUp", validateSignup, signUp);

// 회원가입 창으로 이동
router.get("/signUp", toSignUp);

// 회원가입 중복 아이디 체크
router.post("/duplicateCheck", duplicateIdCheck);

// 로그인
router.post("/logIn", logIn);

// 로그인 창으로 이동
router.get("/logIn", toLogin);

// 로그아웃 경로 추가
router.get("/logout", logOut);

// 위시리스트로 이동
// router.get("/wishlist", toWishlist);

export default router;
