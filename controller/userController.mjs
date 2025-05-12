import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/database.mjs";

// 회원가입
export async function register(req, res) {
  const { userid, userpw, name, gender, email, phone, address } = req.body;
  try {
    const hashedPw = await bcrypt.hash(userpw, 10);

    const [result] = await db.execute(
      `INSERT INTO user (userid, userpw, name, gender, email, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userid, hashedPw, name, gender, email, phone]
    );

    res.status(201).json({ message: "회원가입 성공", userId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res
        .status(400)
        .json({ message: "이미 존재하는 아이디 또는 이메일입니다." });
    } else {
      res.status(500).json({ message: "서버 오류", error: err.message });
    }
  }
}

// 로그인
export async function login(req, res) {
  const { userid, userpw } = req.body;
  try {
    const [rows] = await db.execute(`SELECT * FROM user WHERE userid = ?`, [
      userid,
    ]);
    const user = rows[0];

    if (!user)
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });

    const isMatch = await bcrypt.compare(userpw, user.userpw);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });

    const token = jwt.sign(
      { id: user.idx, userid: user.userid },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "로그인 성공", token });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
}

// 유저 정보 조회
export async function getProfile(req, res) {
  const userId = req.user.id; // 토큰에서 가져온 사용자 ID
  try {
    const [rows] = await db.execute(
      `SELECT idx, userid, name, gender, email, phone, address, regdate FROM user WHERE idx = ?`,
      [userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "사용자 정보가 없습니다." });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
}
