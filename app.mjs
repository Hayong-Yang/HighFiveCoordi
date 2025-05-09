import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './router/userRoutes.mjs';
import productRoutes from './router/productRoutes.mjs';
import wishlistRoutes from './router/wishlistRoutes.mjs';

dotenv.config(); // .env 파일 로딩

const app = express();
const PORT = process.env.HOST_PORT || 3000;

// 미들웨어
app.use(express.json()); // JSON 요청 처리
app.use(express.urlencoded({ extended: true })); // 폼 데이터 처리

// 라우터 연결
app.use('/auth', userRoutes);
app.use('/product', productRoutes);
app.use('/wish', wishlistRoutes);

// 기본 라우터
app.get('/', (req, res) => {
    res.send('Node.js 서버가 실행 중입니다!');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`S서버가 포트 ${PORT}에서 실행 중`)
})
