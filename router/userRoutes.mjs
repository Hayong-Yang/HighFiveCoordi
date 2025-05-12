import express from "express";
import { logIn, signUp } from "../controller/userController.mjs";

const router = express.Router();
// 회원가입
router.post("/signUp", signUp);
// 로그인
router.post("/logIn", logIn);

export default router;
