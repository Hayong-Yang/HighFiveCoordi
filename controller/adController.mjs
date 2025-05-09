import db from '../db/database.mjs';
// 전체 광고 가져오기
export const getAllAds = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ads WHERE is_active = TRUE');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '광고 조회 실패', error: err.message });
  }
};

// 광고 등록
export const createAd = async (req, res) => {
  const { title, image_url, link_url, is_active } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO ads (title, image_url, link_url, is_active)
       VALUES (?, ?, ?, ?)`,
      [title, image_url, link_url, is_active ?? true]
    );
    res.status(201).json({ message: '광고 등록 성공', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: '광고 등록 실패', error: err.message });
  }
};

// 광고 수정
export const updateAd = async (req, res) => {
  const adId = req.params.id;
  const { title, image_url, link_url, is_active } = req.body;
  try {
    await db.execute(
      `UPDATE ads SET title=?, image_url=?, link_url=?, is_active=? WHERE id=?`,
      [title, image_url, link_url, is_active, adId]
    );
    res.json({ message: '광고 수정 성공' });
  } catch (err) {
    res.status(500).json({ message: '광고 수정 실패', error: err.message });
  }
};

// 광고 삭제
export const deleteAd = async (req, res) => {
  const adId = req.params.id;
  try {
    await db.execute('DELETE FROM ads WHERE id = ?', [adId]);
    res.json({ message: '광고 삭제 성공' });
  } catch (err) {
    res.status(500).json({ message: '광고 삭제 실패', error: err.message });
  }
};
