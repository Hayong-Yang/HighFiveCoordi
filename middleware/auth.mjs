import jwt from "jsonwebtoken";
import * as authRepository from "../data/auth.mjs";
import { config } from "../config.mjs";

const AUTH_ERROR = { message: "인증에러" };

export const isAuth = async (request, response, next) => {
    const authHeader = request.get("Authorization");
    console.log(authHeader);

    if (!(authHeader && authHeader.startsWith("Bearer "))) {
        console.log("헤더 에러");
        return response.status(401).json(AUTH_ERROR);
    }
    const token = authHeader.split(" ")[1];
    console.log(token);

    jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
        if (error) {
            console.log("토큰 에러");
            return response.status(401).json(AUTH_ERROR);
        }
        console.log(decoded.idx);
        const user = await authRepository.findById(decoded.idx);
        if (!user) {
            console.log("아이디 없음");
            return response.status(401).json(AUTH_ERROR);
        }
        console.log("user.idx: ", user.idx);
        console.log("user.userId: ", user.userId);
        request.userIdx = user.idx;
        next();
    });
};

export const isManager = async (request, response, next) => {
    const authHeader = request.get("Authorization");
    if (!(authHeader && authHeader.startsWith("Bearer "))) {
        return response.status(401).json(AUTH_ERROR);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.jwt.secretKey);
        const user = await authRepository.findById(decoded.idx);

        if (!user || user.userid !== "admin") {
            console.log("관리자 아님");
            return response.status(401).json(AUTH_ERROR);
        }

        request.userIdx = user.idx;
        next();
    } catch (error) {
        console.log("토큰 에러", error);
        return response.status(401).json(AUTH_ERROR);
    }
};

