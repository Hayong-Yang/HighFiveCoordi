import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.mjs';
import productRoutes from './routes/productRoutes.mjs';
import wishlistRoutes from './routes/wishlistRoutes.mjs';
import adRoutes from './routes/adRoutes.mjs';

dotenv.config(); // .env 파일 로딩

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(express.json()); // JSON 요청 처리
app.use(express.urlencoded({ extended: true })); // 폼 데이터 처리

// 라우터 연결
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/wishlists', wishlistRoutes);
app.use('/ads', adRoutes);

// 기본 라우터
app.get('/', (req, res) => {
    res.send('Node.js 서버가 실행 중입니다!');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`S서버가 포트 ${PORT}에서 실행 중`)})
