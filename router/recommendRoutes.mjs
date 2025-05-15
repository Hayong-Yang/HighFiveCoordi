import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";

import { recommendClothes } from "../controller/recommendController.mjs";

const router = express.Router();

router.post("/", recommendClothes);

export default router;
