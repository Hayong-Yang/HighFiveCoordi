import express from 'express';
import {
  registerUser,
  loginUser,
  getUserById
} from '../controller/userController.mjs';

const router = express.Router();
// 회원가입
router.post('/register', registerUser);
// 로그인
router.post('/login', loginUser);

router.get('/:id', getUserById);

export default router;
