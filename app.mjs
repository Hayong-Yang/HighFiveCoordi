import express from "express";
import dotenv from "dotenv";
import userRoutes from "./router/userRoutes.mjs";
import productRoutes from "./router/productRoutes.mjs";
import wishlistRoutes from "./router/wishlistRoutes.mjs";
import recommendRoutes from "./router/recommendRoutes.mjs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.mjs";

dotenv.config(); // .env 파일 로딩

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 라우터
app.use(express.static(path.resolve(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// 미들웨어
app.use(express.json()); // JSON 요청 처리
app.use(express.urlencoded({ extended: true })); // 폼 데이터 처리

// 라우터 연결
app.use("/auth", userRoutes);
app.use("/product", productRoutes);
app.use("/wish", wishlistRoutes);
app.use("/recommend", recommendRoutes);

// 기본 라우터
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/main.html"));
});

// 서버 시작
app.listen(config.host.port, () => {
  console.log(`S서버가 포트 ${config.host.port}에서 실행 중`);
});
