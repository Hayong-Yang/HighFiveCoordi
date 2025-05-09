import express from 'express';
import {
  registerUser,
  loginUser
} from '../controller/userController.mjs';

const router = express.Router();
// 회원가입
router.post('/signUp', registerUser);
// 로그인
router.post('/logIn', loginUser);


export default router;
