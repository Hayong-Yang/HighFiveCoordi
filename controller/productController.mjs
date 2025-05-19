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
export const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await db.execute("SELECT * FROM products WHERE idx = ?", [productId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다" });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "상품 조회 실패", error: err.message });
    }
};

// 랜덤 상품 조회
export const getProductByRandom = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM products ORDER BY RAND() LIMIT 1");
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "랜덤 상품 조회 실패", error: err.message });
    }
};

// 상품 등록
export const createProduct = async (req, res) => {
    const { name, category, price, description, temp_level, hue, saturation, lightness, url, color } = req.body;
    try {
        console.log(req.body);
        // 먼저 기본 정보 INSERT (image_url 없이)
        const [result] = await db.execute(
            `INSERT INTO products (name, category, price, description, temp_level, hue, saturation, lightness, url, color)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, price, description, temp_level ?? 1, hue, saturation, lightness, url, color]
        );

        const insertedId = result.insertId;
        const nameSlug = name.split(" ")[0].replace(/[^\w]/g, '').toLowerCase();
        const image_url = `http://localhost:8080/product_images/${insertedId}_${nameSlug}.webp`;

        // image_url만 UPDATE
        await db.execute(`UPDATE products SET image_url = ? WHERE idx = ?`, [image_url, insertedId]);

        res.status(201).json({
            message: "상품 등록 성공",
            id: insertedId,
            image_url,
        });
    } catch (err) {
        res.status(500).json({ message: "상품 등록 실패", error: err.message });
    }
};

// 상품 수정
export const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, category, price, description, temp_level, hot_pick } = req.body;
    try {
        await db.execute(
            `UPDATE products
             SET name = ?, category = ?, price = ?, description = ?, temp_level = ?, hot_pick = ?
             WHERE idx = ?`,
            [name, category, price, description, temp_level, hot_pick, productId]
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
