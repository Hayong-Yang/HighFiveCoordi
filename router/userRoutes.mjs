import express from "express";
import { register, login } from "../controller/userController.mjs";

const router = express.Router();
// 회원가입
router.post("/signUp", register);
// 로그인
router.post("/logIn", login);

export default router;
