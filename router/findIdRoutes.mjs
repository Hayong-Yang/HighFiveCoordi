import express from "express";
import { db } from "../db/database.mjs";

const router = express.Router();

// 아이디 찾기 (API용 POST)
router.post("/", (req, res) => {
    console.log("📥 요청 도착:", req.body);
    const { name, email } = req.body;

    const sql = "SELECT userid FROM users WHERE name = ? AND email = ?";
    db.query(sql, [name, email], (err, results) => {
        console.log("📦 DB 응답:", err || results);
        if (err) {
            console.error("❌ DB 오류:", err);
            return res.status(500).json({ error: "DB 오류" });
        }

        if (results.length > 0) {
            res.json({ success: true, userId: results[0].userid });
        } else {
            res.json({ success: false, message: "일치하는 회원이 없습니다." });
        }
    });
});

export default router;
