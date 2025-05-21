create database highfiveDB;
create user 'highfive_dev'@'localhost' identified by '1111';
grant all on highfiveDB.* to 'highfive_dev'@'localhost';
flush privileges;

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
    idx INT auto_increment PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('top', 'pants', 'outer', 'shoes', 'etc') NOT NULL,
    price INT UNSIGNED NOT NULL,
    description TEXT,
    color VARCHAR(50) NOT NULL,          -- 사람이 인지하는 색상 이름
    temp_level TINYINT UNSIGNED DEFAULT 1,  -- 온도에 따른 추천 등급 (예: 1~5)
    hot_pick INT DEFAULT 0,
    regdate DATETIME DEFAULT CURRENT_TIMESTAMP,
    hue INT NOT NULL,               -- 0~360
    saturation INT NOT NULL,        -- 0~100
    lightness INT NOT NULL,         -- 0~100
    image_url VARCHAR(255),
    url varchar(255)
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

select * from products;

insert into products(idx, name, category, price, description, color, temp_level, hue, saturation, lightness, image_url)
values  (101, "HS STRIPE KNIT COLLAR SHIRT_NAVY", "top", 52200, "부드러운 이미지를 주는 니트 티셔츠로 많은 남성들의 남친룩을 담당합니다.", "navy", 2, 218, 39, 12, 'http://localhost:8080/product_images/101_shirt-short (navy).webp'),
      (102, "ASI 에센셜 코튼 헨리넥 티셔츠_피그먼트 올리브", "top", 33900, "봄, 가을에 부드러운 이미지와 빈티지한 느낌을 동시에 줄 수 있는 다용도 티셔츠입니다.", "olive", 1, 70, 15, 32, 'http://localhost:8080/product_images/102_shirt-long (olive).webp'),
        (103, "오버핏 1:1 스트라이프 반팔티", "top", 19900, "캐주얼한 스트라이프로 더운 날 포인트로 입기 좋은 티셔츠입니다.", "grey", 3, 330, 4, 10, 'http://localhost:8080/product_images/103_shirt-short(grey).webp'),
        (104, "퓨어코튼 펀칭 카라 니트", "top", 45000, "캐주얼한 색상과 단정한 카라 니트의 조합으로 인기가 많은 상품입니다.", "green", 2, 144, 56, 22, 'http://localhost:8080/product_images/104_shirt-short (green).webp'),

      (201, "썸머 시어서커 밴딩 팬츠", "pants", 24900, "편안한 밴딩과 주름이 인상적인 바지입니다.", "black", 2, 60, 10, 10, 'http://localhost:8080/product_images/201_pants-long (black).webp'),
        (202, "BOY DENIM PANELLED", "pants", 189000, "와이드한 밑단과 매력적인 컬러가 돋보이는 데님 바지입니다.", "blue", 1, 183, 15, 31, 'http://localhost:8080/product_images/202_pants-long (blue).webp'),
        (203, "아디다스 x YESEYESEE 트랙 팬츠", "pants", 89990, "좁아지는 밑단과 발목 위로 떨어지는 기장감이 이쁜 트랙 팬츠.", "white", 2, 240, 1, 84, 'http://localhost:8080/product_images/203_pants-long (white).webp'),
        (204, "피그먼트 버뮤다 팬츠", "pants", 56050, "트렌디한 6부 느낌으로 더울 때 입기 좋은 반바지.", "grey", 3, 26, 9, 45, 'http://localhost:8080/product_images/204_pants-short (grey).webp'),
        
        (301, "NJ3BR05A 바르텔 자켓_BLACK", "outer", 125300, "노스페이스와 무신사가 만났다 트렌디한 핏으로 여심 사로잡기 프로젝트.", "black", 2, 270, 5, 16, 'http://localhost:8080/product_images/301_outer (black).webp'),
        (302, "WASHED NYLON WIND BREAKER-GREY", "outer", 90300, "워시드 패턴의 나일론 바람막이 등장 요즘 같은 때에 입기 좋은 가벼운 아우터.", "grey", 1, 60, 1, 50, 'http://localhost:8080/product_images/302_outer (grey).webp'),
      (303, "플레이버 스탠넥 바람막이 웜업 자켓 페일 그린", "outer", 63600, "시원한 색상으로 더운 날 들고다니며 걸치기 좋은 패션 바람막이.", "mint", 3, 213, 12, 83, 'http://localhost:8080/product_images/303_outer (mint).webp'),
        (304, "SST 트랙탑 JX8972", "outer", 105000, "트렌디한 아디다스의 화이트 트랙탑.", "white", 2, 60, 6, 93, 'http://localhost:8080/product_images/304_outer (white).webp'),
        
        (401, "푸마 클럽 2 에라", "shoes", 34990, "질리지 않는 디자인으로 사랑 받는 푸마 클럽 2.", "navy", 2, 240, 6, 20, "http://localhost:8080/product_images/401_shoes (black).webp"),
      (402, "경량 클래식 더비", "shoes", 89000, "추운 겨울 날 그녀를 꼬시기 위한 전략. 클래식한 로퍼.", "black", 1, 120, 4, 9, "http://localhost:8080/product_images/402_shoes (black).webp"),
        (403, "에라 - 트루 화이트", "shoes", 34990, "더운 여름 시원한 색과 디자인으로 이쁨 받는 반스의 스테디셀러.", "white", 3, 252, 10, 90, "http://localhost:8080/product_images/403_shoes (white).webp"),
        (404, "GAZELLE INDOOR JI0324", "shoes", 111300, "따뜻한 색감으로 가을, 겨울 내내 사랑받는 아디다스 스니커즈.", "brown", 1, 355, 22, 29, "http://localhost:8080/product_images/404_shoes (brown).webp"),
        
        (501, "TCM coldice cap", "etc", 34990, "부시시한 요즘 날씨 얹기만 해도 힙해지는 패션 아이템.", "green", 2, 60, 7, 17, "http://localhost:8080/product_images/501_etc (green).webp"),
        (502, "RC OWEN SUNGLASS MATTE BLACK", "etc", 32900, "요즘 같이 햇살이 따가운 날 패션과 건강을 모두 챙기는 픽.", "black", 3, 216, 8, 12, "http://localhost:8080/product_images/502_etc (black).webp"),
        (503, "940UNST BASIC OUTLINE NEYYAN CHO", "etc", 35700, "내 부시시함은 스타일이야, 힙한 야구 모자.", "black", 2, 20, 16, 18, "http://localhost:8080/product_images/503_etc (black).webp"),
        (504, "RC B019 BLACK GLASS", "etc", 22710, "흰눈이 내리는 날 소박한 나의 소원은 이런 지적인 안경을 쓰고 나타나는 왕자님.", "black", 1, 180, 4, 14, "http://localhost:8080/product_images/504_etc (black).webp");

select * from products;
select * from users;
desc products;
drop table users;
drop table wishlists;
drop table products;

            INSERT INTO products 
            (name, category, price, description, temp_level, image_url, hue, saturation, lightness, color, url)
            VALUES ("123","top",123,"123",3,"123",221,31,21,"black","adf");


