import express from "express";
import { logIn, signUp } from "../controller/userController.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";

const router = express.Router();

const validatelogIn = [
    body("inputId")
        .trim()
        .isLength({ min: 4 })
        .withMessage("최소 4자이상 입력")
        .matches(/^[a-zA-Z0-9]*$/)
        .withMessage("특수문자는 사용불가"),
    body("inputPw")
        .trim()
        .isLength({ min: 8 })
        .withMessage("최소 8자이상 입력"),
    validate,
];

const validatesignUp = [
    ...validatelogIn,
    body("name").trim().notEmpty().withMessage("name을 입력"),
    body("email").trim().isEmail().withMessage("이메일 형식 확인"),
    validate,
];

// 회원가입
router.post("/signUp", validatesignUp, signUp);
// 로그인
router.post("/logIn", validatelogIn, logIn);

export default router;
