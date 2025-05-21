import { db } from "../db/database.mjs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// // JSON API로 전체 상품 데이터 제공
// export const getProductsJSON = async (req, res) => {
//   try {
//     const [rows] = await db.execute("SELECT * FROM products");
//     //console.log("보내는 결과: ", rows);
//     res.status(200).json({ rows }); // JSON으로 응답
//   } catch (err) {
//     res.status(400).json({ message: "상품 불러오기 실패" });
//   }
// };

// export const deleteProductsJSON = async (req, res) => {
//   const productIdx = req.params.idx; // URL 파라미터

//   try {
//     const [result] = await db.execute("DELETE FROM products WHERE idx = ?", [
//       productIdx,
//     ]);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
//     }
//     res.status(200).json({ message: "상품 삭제 완료", idx: productIdx });
//   } catch (err) {
//     console.error("상품 삭제 오류:", err);
//     res.status(500).json({ message: "상품 삭제 실패", error: err.message });
//   }
// };

// 메인 > 위시리스트로 이동
export async function toWishlist(request, response, next) {
  response.sendFile(path.resolve(__dirname, "../public/wishlist.html"));
}

// 특정 유저의 찜 목록 조회
export const getWishlistByUser = async (req, res) => {
  const { user_idx } = req.query;
  if (!user_idx) {
    return res.status(400).json({ message: "user_idx가 필요합니다." });
  }
  try {
    const [rows] = await db.execute(
      `SELECT
         w.idx AS wishlist_idx,
         w.product_idx,
         p.name,
         p.price,
         p.category,
         p.image_url
       FROM wishlists w
       JOIN products p ON w.product_idx = p.idx
       WHERE w.user_idx = ?`,
      [user_idx]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("찜 목록 조회 오류:", err);
    res.status(500).json({ message: "찜 목록 조회 실패", error: err.message });
  }
};

// 찜 추가
export const addToWishlist = async (req, res) => {
  const { user_idx, product_idx } = req.body;
  if (!user_idx || !product_idx) {
    return res
      .status(400)
      .json({ message: "user_idx와 product_idx가 필요합니다." });
  }
  const connection = await db.getConnection(); // 트랜잭션 위해 연결 직접 획득
  try {
    await connection.beginTransaction();
    // 진짜 찜 추가
    const [result] = await connection.execute(
      `INSERT INTO wishlists (user_idx, product_idx) VALUES (?, ?)`,
      [user_idx, product_idx]
    );
    // hot_pick 증가
    await connection.execute(
      `UPDATE products SET hot_pick = hot_pick + 1 WHERE idx = ?`,
      [product_idx]
    );
    await connection.commit();
    res
      .status(201)
      .json({ message: "찜 추가 및 hot_pick 증가 완료", idx: result.insertId });
  } catch (err) {
    await connection.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "이미 찜한 상품입니다." });
    } else {
      console.error("찜 추가 오류:", err);
      res.status(500).json({ message: "찜 추가 실패", error: err.message });
    }
  } finally {
    connection.release();
  }
};

// 찜 삭제
export const removeFromWishlist = async (req, res) => {
  const user_idx = req.body.user_idx || req.query.user_idx;
  const product_idx = req.body.product_idx || req.query.product_idx;
  if (!user_idx || !product_idx) {
    return res
      .status(400)
      .json({ message: "user_idx와 product_idx가 필요합니다." });
  }
  try {
    await db.execute(
      `DELETE FROM wishlists WHERE user_idx = ? AND product_idx = ?`,
      [user_idx, product_idx]
    );
    res.json({ message: "찜 삭제 완료" });
  } catch (err) {
    console.error("찜 삭제 오류:", err);
    res.status(500).json({ message: "찜 삭제 실패", error: err.message });
  }
};