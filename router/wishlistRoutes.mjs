import express from "express";
import {
    getWishlistByUser,
    addToWishlist,
    removeFromWishlist,
    toWishlist,
    // getProductsJSON,
    // deleteProductsJSON,
} from "../controller/wishlistController.mjs";

const router = express.Router();

// router.get("/", toWishlist);
// // router.get("/", getWishlistByUser);
// router.post("/:id", addToWishlist);
// // router.delete("/:id", removeFromWishlist);
// router.get("/wishlist", getProductsJSON); // JSON API 제공
// router.delete("/wishlist/:idx", deleteProductsJSON);

router.get("/", toWishlist); // 브라우저에서 /wishlist로 접근 시 HTML 반환
router.get("/mine", getWishlistByUser); // 토큰 기반 요청 (user_id는 클라이언트에서 추출)
router.post("/", addToWishlist); // POST /wishlist (user_id, product_id)
router.delete("/", removeFromWishlist); // DELETE /wishlist (user_id, product_id)

export default router;
