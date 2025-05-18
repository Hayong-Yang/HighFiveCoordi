
# 📘 API 문서

## ✅ 회원가입 API

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Headers**:  
  `Content-Type: application/json`

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

| 필드명         | 타입      | 필수 | 설명                               |
|----------------|-----------|------|------------------------------------|
| inputId        | string    | ✅   | 사용자 ID                          |
| inputPw        | string    | ✅   | 비밀번호                           |
| name           | string    | ✅   | 이름                                |
| email          | string    | ✅   | 이메일                              |
| phone          | string    | ✅   | 전화번호                            |
| hiddenIdCheck  | string    | ✅   | 아이디 중복 확인 여부 (`y` 필수)  |
| ischecked      | boolean   | ✅   | 개인정보 동의 여부 (`true` 필수)  |

### Success Response (201)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "inputId": "testuser"
}
```

### Error Response (401)

#### - 중복확인 안함

```json
{
  "message": "아이디 중복 확인을 해주세요"
}
```

#### - 개인정보 동의 안함

```json
{
  "message": "개인정보 수집 및 이용 동의가 필요합니다."
}
```

---

## 🔍 아이디 중복 확인 API

- **URL**: `/api/auth/check-id`
- **Method**: `POST`
- **Headers**:  
  `Content-Type: application/json`

### Request Body

```json
{
  "inputId": "testuser"
}
```

### Success Response (200)

```json
{
  "available": true
}
```

### Error Response (409)

```json
{
  "message": "이미 존재하는 아이디입니다."
}
```


---

## 🌤 추천 상품 API

- **URL**: `/api/recommend`
- **Method**: `POST`
- **Headers**:  
  `Content-Type: application/json`

### Request Body

```json
{
  "nx": "55",
  "ny": "127",
  "baseDate": "20250518",
  "baseTime": "0800"
}
```

| 필드명    | 타입    | 필수 | 설명                  |
|-----------|---------|------|-----------------------|
| nx        | string  | ✅   | 기상청 x 좌표         |
| ny        | string  | ✅   | 기상청 y 좌표         |
| baseDate  | string  | ✅   | 기준 날짜 (yyyymmdd)  |
| baseTime  | string  | ✅   | 기준 시간 (hhmm)      |

### Success Response (200)

```json
{
  "recommendations": ["반팔티", "얇은 가디건"]
}
```

---

## 💖 위시리스트 페이지 요청 API

- **URL**: `/wishlist`
- **Method**: `GET`
- **Response**: HTML 페이지 (`wishlist.html` 전송)


---

## 📦 전체 상품 목록 조회 API

- **URL**: `/api/products`
- **Method**: `GET`

### Success Response (200)

```json
[
  {
    "id": 1,
    "name": "상품명",
    "category": "카테고리",
    "price": 10000,
    "description": "상품 설명",
    "level": 1,
    "hotPick": 0
  }
]
```

---

## 🔍 특정 상품 조회 API

- **URL**: `/api/products/:id`
- **Method**: `GET`

### Success Response (200)

```json
{
  "id": 1,
  "name": "상품명",
  "category": "카테고리",
  "price": 10000,
  "description": "상품 설명",
  "level": 1,
  "hotPick": 0
}
```

### Error Response (404)

```json
{
  "message": "상품을 찾을 수 없습니다"
}
```

---

## 🎲 랜덤 상품 조회 API

- **URL**: `/api/products/random`
- **Method**: `GET`

### Success Response (200)

```json
{
  "id": 5,
  "name": "랜덤상품",
  "category": "신발",
  "price": 8900
}
```

---

## ➕ 상품 등록 API

- **URL**: `/api/products`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

### Request Body

```json
{
  "name": "예시 상품",
  "category": "상의",
  "price": 12000,
  "description": "간단한 설명",
  "level": 3,
  "hotPick": true
}
```

### Success Response (201)

```json
{
  "message": "상품 등록 성공",
  "id": 7
}
```
