use highfiveDB;

CREATE TABLE users (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(50) NOT NULL UNIQUE,
    userpw VARCHAR(255) NOT NULL,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    regdate DATETIME DEFAULT CURRENT_TIMESTAMP
); 
CREATE TABLE products (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price INT UNSIGNED NOT NULL,
    description TEXT,
    level TINYINT UNSIGNED DEFAULT 1,          -- 난이도나 추천 레벨 (예: 1~5)
    hotPick BOOLEAN DEFAULT FALSE,             -- 핫픽 여부 (true/false)
    regdate DATETIME DEFAULT CURRENT_TIMESTAMP -- 등록일 (선택사항)
);

CREATE TABLE wishlists (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    user_idx INT NOT NULL,
    product_idx INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_idx, product_idx),  -- 중복 방지
    FOREIGN KEY (user_idx) REFERENCES users(idx), -- 수정!
    FOREIGN KEY (product_idx) REFERENCES products(idx)
);  

CREATE TABLE ads (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),              -- 광고 제목
    image_url VARCHAR(500),          -- 이미지 주소
    link_url VARCHAR(500),           -- 클릭 시 이동할 URL
    is_active BOOLEAN DEFAULT TRUE  -- 노출 여부
);





