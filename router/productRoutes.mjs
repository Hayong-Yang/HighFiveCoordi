import express from "express";
import {
    getProductById,
    getProductByRandom,
} from "../controller/productController.mjs";

const router = express.Router();

router.get("/:id", getProductById);
router.get("/random", getProductByRandom);
export default router;
