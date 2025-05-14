import { db } from "../db/database.mjs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON API로 전체 상품 데이터 제공
export const getProductsJSON = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products limit 6");
    //console.log("보내는 결과: ", rows);
    res.status(200).json({ rows }); // JSON으로 응답
  } catch (err) {
    res.status(400).json({ message: "상품 불러오기 실패" });
  }
};

// 메인 > 위시리스트로 이동
export async function toWishlist(request, response, next) {
  response.sendFile(path.resolve(__dirname, "../public/wishlist.html"));
}

// 특정 유저의 찜 목록 조회
export const getWishlistByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT w.id, w.product_id, p.name, p.price, p.category
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      message: "찜 목록 조회 실패",
      error: err.message,
    });
  }
};

// 찜 추가
export const addToWishlist = async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)`,
      [user_id, product_id]
    );
    res.status(201).json({ message: "찜 추가 완료", id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "이미 찜한 상품입니다." });
    } else {
      res.status(500).json({
        message: "찜 추가 실패",
        error: err.message,
      });
    }
  }
};

// 찜 삭제
export const removeFromWishlist = async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    await db.execute(
      `DELETE FROM wishlists WHERE user_id = ? AND product_id = ?`,
      [user_id, product_id]
    );
    res.json({ message: "찜 삭제 완료" });
  } catch (err) {
    res.status(500).json({ message: "찜 삭제 실패", error: err.message });
  }
};
