import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const jwtExpiresInDays = config.jwt.expiresInSec;

async function createJwtToken(idx) {
  return jwt.sign({ idx }, secretKey, { expiresIn: jwtExpiresInDays });
}

export async function signUp(request, response, next) {
  const { inputId, inputPw, name, email, phone } = request.body;
  // 회원 중복 체크
  const found = await authRepository.findByUserId(inputId);
  if (found) {
    return response.status(409).json({ message: `${inputId}이 이미 있습니다.` });
  }
  const hashedPw = bcrypt.hashSync(inputPw, bcryptSaltRounds);
  const users = await authRepository.createUser(inputId, hashedPw, name, email, phone);
  const token = await createJwtToken(users.idx);
  console.log(token);
  if (users) {
    response.status(201).json({ token, inputId });
  }
}

export async function logIn(request, response, next) {
  const { inputId, inputPw } = request.body;
  const user = await authRepository.findByUserId(inputId);
  if (!user) {
    response.status(401).json(`${inputId} 아이디를 찾을 수 없음`);
  }
  const isValidPassword = await bcrypt.compare(inputPw, user.userPw);
  if (!isValidPassword) {
    return response.status(401).json({ message: "아이디 또는 비밀번호 확인" });
  }
  const token = await createJwtToken(user.idx);
  response.status(200).json({ token, inputId });
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
  response.status(200).json({ token: request.token, userId: user.userId });
}