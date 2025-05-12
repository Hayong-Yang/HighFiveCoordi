import mysql from "mysql2/promise";
import { config } from "../config.mjs";

// MySQL 연결 풀 생성
const db = await mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

// DB 연결 확인용 테스트 쿼리 (선택적)
try {
  const [rows] = await db.query("SELECT 1");
  console.log("MySQL 연결 성공");
} catch (err) {
  console.error("MySQL 연결 실패:", err.message);
}

export default db;
