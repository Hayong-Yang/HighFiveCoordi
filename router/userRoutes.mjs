import express from "express";
import {
    logIn,
    signUp,
    toLogin,
    toWishlist,
} from "../controller/userController.mjs";

const router = express.Router();
// 회원가입
router.post("/signUp", signUp);

// 로그인
router.post("/logIn", logIn);

// 메인 > 로그인으로 이동
router.get("/logIn", toLogin);

// 메인 > 위시리스트로 이동
router.get("/wishlist", toWishlist);

export default router;
