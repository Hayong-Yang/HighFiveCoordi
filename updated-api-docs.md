
# 📘 API 명세서 (최종 수정본)

---

## ✅ 회원가입 API

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

### Request Body

```json
{
  "inputId": "testuser",
  "inputPw": "1234",
  "name": "홍길동",
  "email": "test@example.com",
  "phone": "01012345678",
  "hiddenIdCheck": "y",
  "ischecked": true
}
```

### Success Response (201)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userid": "testuser"
}
```

### Error Response (401)

```json
{ "message": "아이디 중복 확인을 해주세요" }

{ "message": "개인정보 수집 및 이용 동의가 필요합니다." }
```

---

## 🔍 아이디 중복 확인 API

- **URL**: `/api/auth/check-id`
- **Method**: `POST`

### Request Body

```json
{
  "inputId": "testuser"
}
```

### Success Response (200)

```json
{
  "message": "testuser는 사용가능합니다."
}
```

### Error Responses

- 400: `{ "message": "아이디를 입력해주세요." }`
- 409: `{ "message": "testuser이 이미 있습니다." }`

---

## 🌤 추천 상품 API

- **URL**: `/api/recommend`
- **Method**: `POST`

### Request Body

```json
{
  "nx": "55",
  "ny": "127",
  "baseDate": "20250518",
  "baseTime": "0800"
}
```

### Success Response (200)

```json
{
  "recommendedResult": ["반팔티", "얇은 가디건"],
  "temperature": 22.4,
  "windSpeed": 1.3,
  "rainPercent": 30,
  "feltTemperature": 21.0,
  "level": 2
}
```

### Error Responses

- 404: `{ "error": "예보 데이터를 충분히 찾을 수 없습니다." }`
- 500: `{ "error": "날씨 데이터를 불러오는 중 오류 발생" }`

---

## 💖 위시리스트 API

### 📄 페이지 요청

- **URL**: `/wishlist`
- **Method**: `GET`

### 🔍 사용자 위시리스트 조회

- **URL**: `/wishlist/mine`
- **Method**: `GET`

### ➕ 추가

- **URL**: `/wishlist`
- **Method**: `POST`

### ➖ 삭제

- **URL**: `/wishlist`
- **Method**: `DELETE`

---

## 📦 전체 상품 목록 조회 API

- **URL**: `/api/products`
- **Method**: `GET`

---

## 🔍 특정 상품 조회 API

- **URL**: `/api/products/:id`
- **Method**: `GET`

---

## 🎲 랜덤 상품 조회 API

- **URL**: `/api/products/random`
- **Method**: `GET`

---

## ➕ 상품 등록 API

- **URL**: `/api/products`
- **Method**: `POST`

### Request Body

```json
{
  "name": "예시 상품",
  "category": "상의",
  "price": 12000,
  "description": "간단한 설명",
  "temp_level": 3,
  "image_url": "C:\\fakepath\\example.webp",
  "hue": 180,
  "saturation": 70,
  "lightness": 60,
  "color": "blue",
  "url": "https://example.com/product"
}
```

---

## 🛠 상품 수정 API

- **URL**: `/api/products/:id`
- **Method**: `PUT`

---

## ❌ 상품 삭제 API

- **URL**: `/api/products/:id`
- **Method**: `DELETE`
