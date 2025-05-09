import { db } from "../db/database.mjs";
import { config } from "../config.mjs";
import bcrypt from "bcrypt";
const users = [];
export async function createUser(userId, hashedPw, name, email, phone) {
    return await db.execute(
        "INSERT INTO users (userId, userPw, name, email, phone) VALUES (?, ?, ?, ?, ?)",
        [userId, hashedPw, name, email, phone]
    ).then((result) => result[0].insertId);
}
export async function logIn(inputId, inputPw) {
    const [user] = await db.execute(
        "SELECT * FROM users WHERE userId = ?",
        [inputId]
    );
    if (!user) {
        throw new Error("존재하지 않는 아이디입니다.");
    }
    if (!bcrypt.compareSync(inputPw, user.userPw)) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }
    return user;
}
export async function findByUserId(inputId) {
    return await db
        .execute(
            "select * from users where userId = ?", [inputId])
        .then((result) => result[0][0]);
}
export async function findById(idx) {
    return await db
        .execute(
            "select * from users where idx = ?", [idx]
        )
        .then((result) => result[0][0]);
}