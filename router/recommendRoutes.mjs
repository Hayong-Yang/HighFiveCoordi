import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";

import {
  recommendClothes,
  reloadClothes,
  recommendAgain,
} from "../controller/recommendController.mjs";

const router = express.Router();

// 날씨 조회하면 옷 추천화면을 띄우는 기능
router.post("/", recommendClothes);

// 다시 추천 누르면 날씨 기반으로 옷을 다시 추천하는 기능
router.post("/again", recommendAgain);

// 사용자가 색상적용하기 누르면 옷 추천화면을 새롭게 띄우는 기능
router.post("/reloadByColor", reloadClothes);

export default router;
