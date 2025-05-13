import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
import { fileURLToPath } from "url";
import path from "path";
const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const jwtExpiresInDays = config.jwt.expiresInSec;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createJwtToken(idx) {
    return jwt.sign({ idx }, secretKey, { expiresIn: jwtExpiresInDays });
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
    const token = await createJwtToken(users.idx);
    console.log(token);
    if (users) {
        response.status(201).json({ token, inputId });
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
        response.status(401).json(`${inputId} 아이디를 찾을 수 없음`);
    }
    const isValidPassword = await bcrypt.compare(inputPw, user.userPw);
    if (!isValidPassword) {
        return response
            .status(401)
            .json({ message: "아이디 또는 비밀번호 확인" });
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

// 메인 > 로그인으로 이동
export async function toLogin(request, response, next) {
    response.sendFile(path.resolve(__dirname, "../public/login.html"));
}

// 메인 > 위시리스트로 이동
export async function toWishlist(request, response, next) {
    response.sendFile(path.resolve(__dirname, "../public/wishlist.html"));
}

// 회원가입 창으로 이동
export async function toSignUp(request, response, next) {
    response.sendFile(path.resolve(__dirname, "../public/signup.html"));
}
