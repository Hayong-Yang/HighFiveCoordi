import express from "express";
import {
    getWishlistByUser,
    addToWishlist,
    removeFromWishlist,
} from "../controller/wishlistController.mjs";

const router = express.Router();

router.get("/", getWishlistByUser);
router.post("/:id", addToWishlist);
router.delete("/:id", removeFromWishlist);

export default router;
