import { db } from "../db/database.mjs";

// 전체 상품 조회
export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      message: "상품 목록 조회 실패",
      error: err.message,
    });
  }
};

// 특정 상품 조회
export const getProductById = async (request, response) => {
  const productId = request.params.id;
  try {
    const [rows] = await db.execute("SELECT * FROM products WHERE idx = ?", [
      productId,
    ]);
    if (rows.length === 0) {
      return response.status(404).json({ message: "상품을 찾을 수 없습니다" });
    }
    response.json(rows[0]);
  } catch (err) {
    response
      .status(500)
      .json({ message: "상품 조회 실패", error: err.message });
  }
};
// 랜덤 상품 조회
export const getProductByRandom = async (request, response) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM products ORDER BY RAND() LIMIT 1"
    );
    response.json(rows[0]);
  } catch (err) {
    response
      .status(500)
      .json({ message: "랜덤 상품 조회 실패", error: err.message });
  }
};

// 상품 등록
export const createProduct = async (req, res) => {
  const {
    name,
    category,
    price,
    description,
    temp_level,
    hue,
    saturation,
    lightness,
    color,
    image_url,
    url,
  } = req.body;

  // fakepath 제거 처리
  const cleanFilename = image_url?.split("\\").pop() || null;

  try {
    console.log(cleanFilename);
    console.log("--------------------------------");
    console.log(req.body);
    const [result] = await db.execute(
      `INSERT INTO products 
            (name, category, price, description, temp_level, image_url, hue, saturation, lightness, color, url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category,
        price,
        description,
        temp_level ?? 1,
        cleanFilename ?? "",
        hue ?? 0,
        saturation ?? 0,
        lightness ?? 0,
        color ?? "Unknown",
        url ?? "",
      ]
    );
    res.status(201).json({
      message: "상품 등록 성공",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: "상품 등록 실패",
      error: err.message,
    });
  }
};

// 상품 수정
export const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, category, price, description, level, hot_pick } = req.body;
  try {
    await db.execute(
      `UPDATE products
       SET name=?, category=?, price=?, description=?, level=?, hot_pick=?
       WHERE id=?`,
      [name, category, price, description, level, hot_pick, productId]
    );
    res.json({ message: "상품 수정 성공" });
  } catch (err) {
    res.status(500).json({ message: "상품 수정 실패", error: err.message });
  }
};

// 상품 삭제
export const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await db.execute("DELETE FROM products WHERE idx = ?", [productId]);
    res.json({ message: "상품 삭제 성공" });
  } catch (err) {
    res.status(500).json({ message: "상품 삭제 실패", error: err.message });
  }
};

// ⭐ 추가: 핫픽 TOP 3 조회
export const getTopHotPicks = async (req, res) => {
  try {
    // 1. hot_pick 내림차순 상위 3개 조회
    const [rows] = await db.execute(
      "SELECT * FROM products WHERE hot_pick > 0 ORDER BY hot_pick DESC LIMIT 3"
    );

    // 2. 만약 hot_pick > 0인 게 하나도 없다면 → 랜덤 3개
    if (rows.length === 0) {
      const [randomRows] = await db.execute(
        "SELECT * FROM products ORDER BY RAND() LIMIT 3"
      );
      return res.json(randomRows); // ⭐ 랜덤으로 응답
    }

    res.json(rows); // ⭐ hot_pick 상위 응답
  } catch (err) {
    res.status(500).json({
      message: "핫픽 상위 3개 조회 실패",
      error: err.message,
    });
  }
};
