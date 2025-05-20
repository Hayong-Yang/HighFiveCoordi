import express from "express";
import {
    getProductById,
    getProductByRandom,
    createProduct
} from "../controller/productController.mjs";
import { isAuth } from "../middleware/auth.mjs"


const router = express.Router();

router.get("/:id", getProductById);
router.get("/random", getProductByRandom);
router.post("/createProduct", isAuth, createProduct)

export default router;
