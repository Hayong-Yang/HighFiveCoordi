import express from "express";
import {
  getWishlistByUser,
  addToWishlist,
  removeFromWishlist,
  toWishlist,
  getProductsJSON,
  deleteProductsJSON,
} from "../controller/wishlistController.mjs";

const router = express.Router();

router.get("/", toWishlist);
// router.get("/", getWishlistByUser);
router.post("/:id", addToWishlist);
// router.delete("/:id", removeFromWishlist);
router.get("/wishlist", getProductsJSON); // JSON API 제공
router.delete("/wishlist/:idx", deleteProductsJSON);

export default router;
