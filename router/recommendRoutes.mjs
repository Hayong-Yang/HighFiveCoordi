import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";

import {
  recommendClothes,
  reloadClothes,
} from "../controller/recommendController.mjs";

const router = express.Router();

// 날씨 조회하면 옷 추천화면을 띄우는 기능
router.post("/", recommendClothes);

// 사용자가 색상적용하기 누르면 옷 추천화면을 새롭게 띄우는 기능
router.post("/reloadByColor", reloadClothes);

export default router;
