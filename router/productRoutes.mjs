import express from "express";
import {
    getProductById,
    getProductByRandom,
    createProduct,
} from "../controller/productController.mjs";

const router = express.Router();

router.get("/:id", getProductById);
router.get("/random", getProductByRandom);
router.post("/createProduct", createProduct);

export default router;
