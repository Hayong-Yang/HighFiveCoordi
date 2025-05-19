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
        const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [
            productId,
        ]);
        if (rows.length === 0) {
            return response
                .status(404)
                .json({ message: "상품을 찾을 수 없습니다" });
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
    } = req.body;

    console.log("✅ [createProduct] 요청 도착");
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);

    if (!req.user) {
        return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    }

    try {
        const [result] = await db.execute(
            `INSERT INTO products (name, category, price, description, temp_level, hue, saturation, lightness, color)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, price, description, temp_level, hue, saturation, lightness, color]
        );

        res.status(201).json({
            message: "상품 등록 성공",
            id: result.insertId,
        });
    } catch (err) {
        console.error("❌ 상품 등록 실패:", err);
        res.status(500).json({ message: "상품 등록 실패", error: err.message });
    }
};

// 상품 수정
export const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, category, price, description, level, hotPick } = req.body;
    try {
        await db.execute(
            `UPDATE products
       SET name=?, category=?, price=?, description=?, level=?, hotPick=?
       WHERE id=?`,
            [name, category, price, description, level, hotPick, productId]
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
        await db.execute("DELETE FROM products WHERE id = ?", [productId]);
        res.json({ message: "상품 삭제 성공" });
    } catch (err) {
        res.status(500).json({ message: "상품 삭제 실패", error: err.message });
    }
};

export const deleteProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        await db.execute("DELETE FROM products WHERE id = ?", [productId]);
        res.json({ message: "상품 삭제 성공" });
    } catch (err) {
        res.status(500).json({ message: "상품 삭제 실패", error: err.message });
    }
};
