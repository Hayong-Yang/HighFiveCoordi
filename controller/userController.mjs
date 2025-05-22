import db from "../db/database.mjs";
import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
import { fileURLToPath } from "url";
import path from "path";
import pkg from "coolsms-node-sdk";

const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const jwtExpiresInDays = config.jwt.expiresInSec;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createJwtToken(idx, userid) {
  return jwt.sign({ idx, userid }, secretKey, {
    expiresIn: jwtExpiresInDays,
  });
}

// 회원가입 기능
export async function signUp(request, response, next) {
  const { inputId, inputPw, name, email, phone, hiddenIdCheck, ischecked } =
    request.body;
  // 회원 중복 체크 여부
  if (hiddenIdCheck !== "y") {
    return response
      .status(401)
      .json({ message: "아이디 중복 확인을 해주세요" });
  }
  if (!ischecked) {
    return response
      .status(401)
      .json({ message: "개인정보 수집 및 이용 동의가 필요합니다." });
  }
  const hashedPw = bcrypt.hashSync(inputPw, bcryptSaltRounds);
  const users = await authRepository.createUser(
    inputId,
    hashedPw,
    name,
    email,
    phone
  );
  const token = await createJwtToken(users.idx, inputId);
  console.log(token);
  if (users) {
    response.status(201).json({ token, userid: inputId });
  }
}
// 아이디 중복체크 기능
export async function duplicateIdCheck(request, response, next) {
  const { inputId } = request.body;
  const found = await authRepository.findByUserId(inputId);
  if (!inputId) {
    return response.status(400).json({ message: `아이디를 입력해주세요.` });
  }
  if (found) {
    return response
      .status(409)
      .json({ message: `${inputId}이 이미 있습니다.` });
  }
  response.status(200).json({ message: `${inputId}는 사용가능합니다.` });
}

// 로그인 기능
export async function logIn(request, response, next) {
  const { inputId, inputPw } = request.body;
  const user = await authRepository.findByUserId(inputId);

  if (!user) {
    return response.status(401).json(`${inputId} 아이디를 찾을 수 없음`);
  }
  const isValidPassword = await bcrypt.compare(inputPw, user.userPw);
  if (!isValidPassword) {
    return response.status(401).json({ message: "아이디 또는 비밀번호 확인" });
  }
  const token = await createJwtToken(user.idx, inputId);
  response.status(200).json({ token, userid: inputId });
}

export async function verify(request, response, next) {
  const id = request.id;
  if (id) {
    response.status(200).json(id);
  } else {
    response.status(401).json({ message: "사용자 인증 실패" });
  }
}

export async function me(request, response, next) {
  const user = await authRepository.findById(request.id);
  if (!user) {
    return response.status(404).json({ message: "일치하는 사용자가 없음" });
  }
  response.status(200).json({ token: request.token, userid: user.userId });
}

// 아이디 찾기
export async function findUserId(request, response, next) {
  const { name, email } = request.body;

  try {
    const [rows] = await db.execute(
      "SELECT userid FROM users WHERE name = ? AND email = ?",
      [name, email]
    );

    if (rows.length > 0) {
      response.json({ success: true, user_id: rows[0].userid });
    } else {
      response.json({
        success: false,
        message: "일치하는 정보가 없습니다.",
      });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ success: false, message: "서버 오류" });
  }
}

// 비밀번호 찾기
const Coolsms = pkg.default;

const messageService = new Coolsms(
  process.env.apiKey_pw,
  process.env.apiSecret_pw
);

async function sendSMS(toPhoneNumber) {
  try {
    const result = await messageService.sendOne({
      to: toPhoneNumber, // 예: "01012345678"
      from: process.env.senderNumber, // 예: "01087654321"
      text: "인증번호 1234",
    });
    console.log("✅ 문자 전송 성공:", result);
  } catch (error) {
    console.error("❌ 문자 전송 오류:", error);
  }
}

// 메인 > 로그인으로 이동
export async function toLogin(request, response, next) {
  response.sendFile(path.resolve(__dirname, "../public/login.html"));
}

// 회원가입 창으로 이동
export async function toSignUp(request, response, next) {
  response.sendFile(path.resolve(__dirname, "../public/signup.html"));
}

// 로그아웃 기능 (토큰은 클라이언트가 삭제해야 함)
export async function logOut(request, response, next) {
  // 클라이언트 측에서 토큰 삭제를 맡기고, 메인 페이지로 리디렉션
  response.redirect("/");
}

// 아이디 찾기 페이지 렌더
export async function toFindId(req, res, next) {
  res.sendFile(path.resolve(__dirname, "../public/find-id.html"));
}

// 비밀번호 찾기 페이지 렌더
export async function toFindPw(req, res, next) {
  res.sendFile(path.resolve(__dirname, "../public/find-pw.html"));
}
