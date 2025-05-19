import express from "express";
import {
    getProductById,
    getProductByRandom,
    createProduct,
    deleteProductById,
} from "../controller/productController.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/:id", getProductById);
router.get("/random", getProductByRandom);
router.post("/", isAuth, createProduct);
router.delete("/:id", isAuth, deleteProductById);

export default router;
