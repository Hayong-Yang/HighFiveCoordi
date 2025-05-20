import { db } from "../db/database.mjs";
import fs from "fs";
import path from "path";

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
        const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [
            productId,
        ]);
        if (rows.length === 0) {
            return res
                .status(404)
                .json({ message: "상품을 찾을 수 없습니다" });
        }
        res.json(rows[0]);
    } catch (err) {
        res
            .status(500)
            .json({ message: "상품 조회 실패", error: err.message });
    }
};

// 랜덤 상품 조회
export const getProductByRandom = async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM products ORDER BY RAND() LIMIT 1"
        );
        res.json(rows[0]);
    } catch (err) {
        res
            .status(500)
            .json({ message: "랜덤 상품 조회 실패", error: err.message });
    }
};

// 상품 등록
export const createProduct = async (req, res) => {
    const {
        name, category, price, description,
        temp_level, url, hue, saturation, lightness, color, image_filename
    } = req.body;

    try {
        // 1. DB에 기본 정보 삽입
        const [result] = await db.execute(
            `INSERT INTO products 
            (name, category, price, description, temp_level, url, hue, saturation, lightness, color)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, price, description, temp_level, url, hue, saturation, lightness, color]
        );

        const insertedId = result.insertId;

        // 2. 파일명에서 확장자 포함한 slug 생성
        const filename = image_filename ? image_filename.split('\\').pop() : null;
        const nameSlug = filename.replace(/\s+/g, "").toLowerCase();
        const image_url = `http://localhost:8080/product_images/${nameSlug}`;

        // 3. image_url만 따로 업데이트
        await db.execute(
            `UPDATE products SET image_url = ? WHERE idx = ?`,
            [image_url, insertedId]
        );

        // 4. 최종 응답
        return res.status(201).json({
            message: "상품 등록 성공",
            id: insertedId,
            image_url
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "상품 등록 실패", error: err.message });
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
