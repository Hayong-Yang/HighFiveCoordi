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

router.get("/", toWishlist); // 브라우저에서 /wishlist로 접근 시 HTML 반환
router.get("/mine", getWishlistByUser); // 토큰 기반 요청 (user_id는 클라이언트에서 추출)
router.post("/", addToWishlist); // POST /wishlist (user_id, product_id)
router.delete("/", removeFromWishlist); // DELETE /wishlist (user_id, product_id)

// router.get("/", getWishlistByUser); // 특정 유저의 위시리스트 목록 조회
// router.delete("/:id", removeFromWishlist); // 위시리스트 삭제
// router.get("/wishlist", getProductsJSON); // JSON API 제공, 특정 유저의 (상품)위시리스트 목록 조회
// router.delete("/wishlist/:idx", deleteProductsJSON); // (상품)위시리스트 삭제

export default router;
