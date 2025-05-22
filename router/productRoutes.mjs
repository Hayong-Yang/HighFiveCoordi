import express from "express";
import {
    getProductById,
    getProductByRandom,
    createProduct,
    getTopHotPicks,
} from "../controller/productController.mjs";
import { isAuth, isManager } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/hotpicks", getTopHotPicks); // ⭐ 추가: /products/hotpicks
router.get("/:id", getProductById);
router.get("/random", getProductByRandom);
router.post("/createProduct", isManager, createProduct);

export default router;