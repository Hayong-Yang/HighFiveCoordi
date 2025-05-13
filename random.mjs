import express from 'express';
import mysql from 'mysql2';

const app = express();
const port = 3000;

// DB 연결 설정
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'highfive_dev',
  password: '1111',
  database: 'highfiveDB',
});

// 연결 확인 (에러 로그만 출력)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('DB 연결 중 오류:', err);
  } else {
    console.log('DB 연결 성공');
    connection.release();
  }
});

// 온도 → temp_level 변환 함수
function getTempLevel(temp) {
  if (temp <= 15) return 1;    
  if (temp <= 22) return 2;     
  return 3;                     
}
//  랜덤 API
app.get('/recommend', async (req, res) => {
  const temp = parseFloat(req.query.temp);
  if (isNaN(temp)) {
    return res.status(400).json({ error: 'Invalid temperature' });
  }

  const level = getTempLevel(temp);
  const categories = ['top', 'pants', 'outer', 'shoes', 'etc'];
  const recommendations = {};

  try {
    const promisePool = pool.promise();

    for (const category of categories) {
      const [rows] = await promisePool.query(
        'SELECT name, category, price, description, color FROM products WHERE temp_level = ? AND category = ?',
        [level, category]
      );

      if (rows.length > 0) {
        const randomItem = rows[Math.floor(Math.random() * rows.length)];
        recommendations[category] = randomItem;
      } else {
        recommendations[category] = null;
      }
    }

    res.json({
      temp,
      temp_level: level,
      recommendations
    });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`옷 추천 서버 실행 중: http://localhost:${port}`);
});
