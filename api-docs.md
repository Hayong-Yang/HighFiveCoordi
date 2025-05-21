
# 📘 HighFiveCoordi API 문서

## 🧭 개요 (Overview)

HighFiveCoordi 프로젝트는 날씨 맞춤형 스타일 코디 추천 서비스를 제공하는 플랫폼입니다.  
본 문서는 해당 프로젝트의 API 명세를 설명하며, 개발자 및 사용자 시스템 연동을 위한 주요 가이드를 제공합니다.


### 문서 요약
- **사용자 인증 및 권한 관리**: 회원가입, 로그인 등의 사용자 관련 기능 제공  
- **상품 조회 및 추천**: 기온과 풍속을 계산하여 체감온도에 따른 스타일 상품 리스트 제공  
- **위시리스트 관리**: 사용자가 관심 상품을 저장, 삭제, 조회하는 기능  
- **추천 로직**: 유사색상, 반대색상, 삼조합등 알고리즘을 통한 스타일 추천  
- **관리자 페이지**: 상품 등록 및 시스템 운영을 위한 관리자용 API  


### 작성 배경
HighFiveCoordi 프로젝트는 기온에 따른 스타일 코디 추천 서비스를 목표로 개발되었습니다. 다양한 온도, 색상, 스타일 로직을 기반으로 상품을 선별·추천하여, 프론트엔드 와 효율적인 데이터 교환을 지원합니다.

## 📚 API 문서 목차

---

### 1. 🧑 사용자 인증 API
| 구성 요소         | 설명                         |
|------------------|------------------------------|
| **UserRoutes**   | 로그인, 회원가입 등의 라우터 |
| **UserController** | 사용자 요청 처리 로직       |
| **Data.Auth**    | 사용자 인증 관련 DB 처리     |

---

### 2. 🛒 추천 상품 API
| 구성 요소              | 설명                           |
|-------------------------|--------------------------------|
| **RecommendRoutes**     | 추천 API 라우터 경로          |
| **RecommendController** | 추천 로직 처리                |
| **Data.Recommend**      | 추천 알고리즘 데이터 접근     |

---

### 3. ❤️ 위시리스트 API
| 구성 요소            | 설명                         |
|-----------------------|------------------------------|
| **WishlistRoutes**     | 위시리스트 관련 라우터       |
| **WishlistController** | 위시리스트 로직 처리         |

---

### 4. 🛠 관리자 전용 API
| 구성 요소       | 설명                         |
|------------------|------------------------------|
| **ManagerRoutes** | 관리자 상품 등록, 수정 등 API |

---

### 5. 🗄 DB 연결 / 쿼리 처리
| 구성 요소       | 설명                    |
|------------------|-------------------------|
| **DataBase**     | DB 연결 및 초기화 모듈 |


---

### 6. 🧬 스키마 구조
| 구성 요소       | 설명                          |
|------------------|-------------------------------|
| **Schema**        | 각 테이블/컬렉션의 데이터 구조 정의 |


---

### 7. ⚠️ 공통 예외 처리 / 보안 미들웨어
| 구성 요소     | 설명                                 |
|----------------|--------------------------------------|
| **isAuth**      | JWT 토큰 기반 인증 미들웨어         |
| **Validator**   | express-validator 기반 입력 검증 미들웨어 |

---

### 8. 📦 설정 및 환경 구성
| 구성 요소       | 설명                                 |
|------------------|--------------------------------------|
| **Config**        | 포트, DB 등 `.env` 기반 환경 설정   |


---

### 9. 🚀 애플리케이션 진입점
| 구성 요소       | 설명                     |
|------------------|--------------------------|
| **app**           | Express 서버 초기화 및 라우터 연결 |

---

## 1. 🧑 사용자 인증 API

### UserController

### 회원가입 API

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Headers**:  

### 요청 바디

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

### 요청 성공 (201)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "inputId": "testuser"
}
```

### 요청 실패 (401)

### _중복확인 안함_

```json
{
  "message": "아이디 중복 확인을 해주세요"
}
```

###  _개인정보 동의 안함_

```json
{
  "message": "개인정보 수집 및 이용 동의가 필요합니다."
}
```

---

### 아이디 중복 확인 API

- **URL**: `/api/auth/check-id`
- **Method**: `POST`
- **Headers**:  
  `Content-Type: application/json`

### _요청 바디_

```json
{
  "inputId": "testuser"
}
```

### _사용 가능한 아이디 (200)_

```json
{
  "message": "testuser는 사용가능합니다."
}
```

### _이미 존재하는 아이디  (409)_

```json
{
  "message": "testuser이 이미 있습니다."
}
```
### _아이디가 입려되지 않은 경우 (400)_

```json
{
  "message": "아이디를 입력해주세요."
}
```
##  로그인 API

사용자가 입력한 아이디(`inputId`)와 비밀번호(`inputPw`)를 확인하여,  
정상 인증되면 **JWT 토큰을 생성해 응답**하는 로그인 기능입니다.

---

### 요청 개요

- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Content-Type**: `application/json`

---

### 요청 바디

```json
{
  "inputId": "testuser",
  "inputPw": "12345678"
}
```
### 요청 예시

### _요청 성공 (200)_
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userid": "testuser"
}
```
이 토큰을 localStorage, cookie, 또는 Authorization 헤더에 저장하여
이후 인증된 요청에 활용할 수 있습니다.

### _아이디 존재하지 않음 (401)_
```json
"testuser 아이디를 찾을 수 없음"
```

### _비밀번호 불일치 (401)_
```json
{
  "message":"아이디 또는 비밀번호 확인"
}
```
###  인증 확인 및 내 정보 조회 API

### 사용자 인증 확인 (`/auth/verify`)

요청에 포함된 JWT 토큰에서 사용자 ID가 추출되었는지 확인합니다.  
주로 로그인 상태 확인, 인증된 사용자 전용 기능 활성화 등에 사용됩니다.

---

### 요청 개요

- **Method**: `GET`
- **Endpoint**: `/auth/verify`
- **Headers**:
  ```http
  Authorization: Bearer {JWT_TOKEN}
  ```








### Data.Auth



### UserRoutes

---

## 🌤 추천 상품 API

### RecommendController

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
  "recommendations": ["id", "1 (temp_level)","url", "category"]
}
```
### Data.Recommend

---

### RecommendRoutes

---

## 💖 위시리스트 페이지 요청 API

### WishlistController

- **URL**: `/wishlist`
- **Method**: `GET`
- **Response**: HTML 페이지 (`wishlist.html` 전송)


### WishlistRoutes

---

## 관리자 API

### ManagerRoutes

---
## 🗄️ Database 연결 설정 (`db.mjs`)

이 모듈은 `mysql2` 라이브러리를 사용하여 MySQL 데이터베이스와의 **비동기 커넥션 풀**을 설정하고  
`Promise 기반 쿼리 인터페이스`를 제공하는 공통 데이터베이스 접근 객체입니다.

---

### ✅ 주요 기능

- `.env` → `config.mjs` 값을 사용하여 DB 접속 정보 구성
- `mysql2`의 `createPool()`로 커넥션 풀 생성
- `pool.promise()`를 통해 `async/await` 기반 쿼리 실행 가능
- 외부에서 `import { db }` 또는 `import db from ...` 으로 사용 가능
---
### 환경 설정값 (from.config.mjs)

| 설정 키                 | 설명        | 예시 값           |
| -------------------- | --------- | -------------- |
| `config.db.host`     | DB 호스트 주소 | `localhost`    |
| `config.db.user`     | DB 사용자명   | `highfive_dev` |
| `config.db.password` | DB 비밀번호   | `1111`         |
| `config.db.database` | 데이터베이스 이름 | `highfiveDB`   |
| `config.db.port`     | MySQL 포트  | `3306`         |
### 사용 예시
```js
import { db } from "../db/db.mjs";

const [rows] = await db.query("SELECT * FROM users WHERE userid = ?", [userid]);

console.log(rows);
```
---
### pool.promise()

| 이유                  | 설명                          |
| ------------------- | --------------------------- |
| `async/await` 사용 가능 | `.then()` 없이 동기적으로 코드 작성 가능 |
| 커넥션 풀 관리 자동화        | 다중 연결 환경에서 성능 및 안정성 향상      |
| 오류 및 예외 처리 간결화      | `try/catch` 기반 예외 핸들링 가능    |
---
## 🧪 에러 발생 시 예시

```bash
Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'wronguser'@'localhost'
```
#### 원인 및 해결
| 원인                                   | 해결 방법                              |
| ------------------------------------ | ---------------------------------- |
| `.env`에서 DB\_USER 또는 DB\_PASSWORD 오타 | 올바른 사용자 계정 및 비밀번호로 수정              |
| 해당 MySQL 계정이 생성되지 않음                 | `CREATE USER ...`로 계정 생성, 권한 부여    |
| 해당 계정이 `localhost`에서 접속 불가           | `@'localhost'`가 맞는지, `%`로 허용했는지 확인 |
---

## 🗄️ DataBase 설계 명세서 (highfiveDB)

### 이 문서는 서비스에 사용되는 MySQL 기반 데이터베이스 `highfiveDB`의 테이블 구조와 관계를 정리한 문서입니다.  
### 주요 기능은 사용자 인증, 상품 추천, 위시리스트 저장 등이며, 각 테이블은 외래키(FK)로 연결되어 있습니다.
---
### 📦 데이터베이스 정보

| 항목       | 값               |
|------------|------------------|
| DB 이름     | `highfiveDB`     |
| 사용자 계정 | `highfive_dev`   |
| 비밀번호    | `1111`           |
| 호스트      | `localhost`      |
| 포트        | `3306`     |
---
### 🧑Users (회원 테이블)
| 컬럼명     | 타입           | 제약조건                | 설명        |
| ------- | ------------ | ------------------- | --------- |
| idx     | INT          | PK, AUTO\_INCREMENT | 사용자 고유 ID |
| userid  | VARCHAR(50)  | NOT NULL, UNIQUE    | 로그인 ID    |
| userpw  | VARCHAR(255) | NOT NULL            | 암호화된 비밀번호 |
| name    | VARCHAR(30)  | NOT NULL            | 사용자 이름    |
| email   | VARCHAR(100) | NOT NULL, UNIQUE    | 이메일 주소    |
| phone   | VARCHAR(20)  | NOT NULL            | 전화번호      |
| regdate | DATETIME     | DEFAULT now()       | 가입일시      |
---
### 🛒Porducts (상품 테이블)
| 컬럼명         | 타입               | 제약조건          | 설명                                             |
| ----------- | ---------------- | ------------- | ---------------------------------------------- |
| idx         | INT              | PK            | 상품 고유 ID (직접 지정)                               |
| name        | VARCHAR(100)     | NOT NULL      | 상품명                                            |
| category    | ENUM             | NOT NULL      | 카테고리 (`top`, `pants`, `outer`, `shoes`, `etc`) |
| price       | INT UNSIGNED     | NOT NULL      | 가격 (정수)                                        |
| description | TEXT             |               | 상세 설명                                          |
| color       | VARCHAR(50)      | NOT NULL      | 사람이 인식하는 색상 이름 (`navy`, `black` 등)             |
| temp\_level | TINYINT UNSIGNED | DEFAULT 1     | 온도 추천 등급 (1\~5)                                |
| hot\_pick   | INT              | DEFAULT 0     | 추천 여부 또는 순위용                                   |
| regdate     | DATETIME         | DEFAULT now() | 등록 일시                                          |
| hue         | INT              | NOT NULL      | 색상(Hue) - 0\~360                               |
| saturation  | INT              | NOT NULL      | 채도 - 0\~100                                    |
| lightness   | INT              | NOT NULL      | 명도 - 0\~100                                    |
| image\_url  | VARCHAR(255)     |               | 이미지 경로 (URL)                                   |
| url         | VARCHAR(255)     |               | 상세 페이지 또는 외부 URL                               |

---
### ❤️wishlists (위시리스트 테이블)
| 컬럼명          | 타입                        | 제약조건                        | 설명                  |
| ------------ | ------------------------- | --------------------------- | ------------------- |
| idx          | INT                       | PK, AUTO\_INCREMENT         | 위시리스트 고유 ID         |
| user\_idx    | INT                       | NOT NULL, FK → users.idx    | 사용자 ID              |
| product\_idx | INT                       | NOT NULL, FK → products.idx | 상품 ID               |
| created\_at  | DATETIME                  | DEFAULT CURRENT\_TIMESTAMP  | 생성 일시               |
| UNIQUE KEY   | (user\_idx, product\_idx) | 중복 저장 방지                    | 같은 상품을 중복으로 찜할 수 없음 |

### 🛒샘플 데이터 (products 일부)
| idx | name                              | category | price  | color | temp\_level | hue | sat | light | image\_url |
| --- | --------------------------------- | -------- | ------ | ----- | ----------- | --- | --- | ----- | ---------- |
| 101 | HS STRIPE KNIT COLLAR SHIRT\_NAVY | top      | 52200  | navy  | 2           | 218 | 39  | 12    | ...        |
| 201 | 썸머 시어서커 밴딩 팬츠                     | pants    | 24900  | black | 2           | 60  | 10  | 10    | ...        |
| 301 | 바르텔 자켓\_BLACK                     | outer    | 125300 | black | 2           | 270 | 5   | 16    | ...        |
| 401 | 푸마 클럽 2 에라                        | shoes    | 34990  | navy  | 2           | 240 | 6   | 20    | ...        |

---
### 테이블 관계도
users ───< wishlists >─── products
#### 위시리스트는 사용자와 상품 간의 N:M 중간 테이블 역할
---

## 에러처리 API

### 🔐 Middleware: `isAuth` - JWT 인증 미들웨어

JWT(Json Web Token)를 이용한 사용자 인증 미들웨어입니다.  
클라이언트 요청의 `Authorization` 헤더에 포함된 JWT를 검증하고, 유효한 경우 사용자 정보를 요청에 추가한 뒤 다음 단계로 넘깁니다.

---

### ✅ 사용 목적

- `Authorization` 헤더에서 JWT 추출 및 형식 검증
- JWT 토큰의 유효성 검증 (서명 및 만료 여부)
- 토큰에서 사용자 ID(`idx`) 추출
- 사용자 DB 조회 후 존재 여부 검증
- 성공 시 `request.userIdx`에 사용자 인덱스를 추가하고 다음 미들웨어로 진행

---
### 구성요소
| 구성 요소                     | 설명                              |
| ------------------------- | ------------------------------- |
| `jsonwebtoken`            | JWT 토큰 생성 및 검증 라이브러리 (`verify`) |
| `config.jwt.secretKey`    | JWT 비밀 키 (환경 설정에서 불러옴)          |
| `authRepository.findByid` | 토큰에서 추출된 `idx`로 사용자 DB 조회 함수    |

---
### 📥 요청 형식

#### Request Headers

| Header         | 필수 | 설명                                      | 예시                                               |
|----------------|------|-------------------------------------------|----------------------------------------------------|
| Authorization  | ✅   | Bearer 토큰 형식의 JWT (`Bearer <token>`) | 

#### Payload

```json
{
  "idx": 23,
  "userid": "testUser",
  "iat": 1710000000,
  "exp": 1710003600
}
```
---

### 인증 성공 시
- request.userIdx에 사용자 ID가 할당되어 다음 라우터에서 접근 가능

- 응답은 없음 (next() 호출로 다음 미들웨어 또는 컨트롤러로 이동)
---

### ❗️ 에러 코드 정리 - `isAuth` 미들웨어

| 에러 상황               | HTTP 상태 코드 | 응답 메시지                 | 설명                                                      | 로그 출력 예시        |
|--------------------------|----------------|------------------------------|-----------------------------------------------------------|------------------------|
| Authorization 헤더 없음 | 401 Unauthorized | `{ "message": "인증에러" }` | 클라이언트 요청에 `Authorization` 헤더가 없음            | `undefined`, `헤더 에러` |
| Bearer 형식 아님         | 401 Unauthorized | `{ "message": "인증에러" }` | `Bearer <토큰>` 형식이 아님                               | `BearerXYZ`, `헤더 에러` |
| JWT 유효성 검증 실패     | 401 Unauthorized | `{ "message": "인증에러" }` | 토큰 만료, 서명 불일치 등으로 인해 `jwt.verify()` 실패   | `토큰 에러`              |
| 사용자 정보 없음         | 401 Unauthorized | `{ "message": "인증에러" }` | 토큰은 유효하나 해당 사용자(`idx`)가 DB에 존재하지 않음 | `아이디 없음`            |

---

### ✅ 공통 에러 응답 형식

```json
{
  "message": "인증에러"
}
```

---

### ✅ API 입력 유효성 검사 명세 (Validation)

본 문서는 사용자 로그인 및 회원가입 요청에 대한 **입력 필드 유효성 검사 조건**을 정의합니다.  
해당 유효성 검사는 `express-validator`와 커스텀 `validate` 미들웨어를 통해 처리됩니다.

### 🔐 1. 로그인 (`POST /auth/login`)

### 📥 요청 바디 (Request Body)

| 필드명   | 필수 | 타입     | 유효성 조건                                                 | 에러 메시지 예시                          |
|----------|------|----------|--------------------------------------------------------------|--------------------------------------------|
| inputId  | ✅   | string   | - 최소 4자 이상<br>- 영문/숫자만 허용<br>- 특수문자 금지       | `아이디는 최소 4자 이상 입력해야 합니다.`<br>`특수문자는 사용할 수 없습니다.` |
| inputPw  | ✅   | string   | - 최소 8자 이상                                              | `비밀번호는 최소 8자 이상 입력해야 합니다.` |
---
#### ❌ 실패 응답 예시

```json
{
  "message": "아이디는 최소 4자 이상 입력해야 합니다."
}
```
---
### 2. 회원가입 (POST /auth/signup)

| 필드명     | 필수 | 타입     | 유효성 조건                                                             | 에러 메시지 예시                                            |
| ------- | -- | ------ | ------------------------------------------------------------------ | ---------------------------------------------------- |
| inputId | ✅  | string | 로그인과 동일                                                            | `아이디는 최소 4자 이상 입력해야 합니다.`                            |
| inputPw | ✅  | string | 로그인과 동일                                                            | `비밀번호는 최소 8자 이상 입력해야 합니다.`                           |
| name    | ✅  | string | - 비어 있을 수 없음                                                       | `이름을 입력하세요.`                                         |
| email   | ✅  | string | - 유효한 이메일 형식                                                       | `이메일 형식을 확인하세요.`                                     |
| phone   | ✅  | string | - 비어 있을 수 없음<br>- `000-0000-0000` 또는 `000-000-0000` 형식<br>- 하이픈 필수 | `전화번호를 입력하세요.`<br>`휴대폰번호 형식이 올바르지 않습니다. '-'를 포함하세요.` |
---
### 실패 응답 예시
```json
{
  "message": "이름을 입력하세요."
}
```
---
### 유효성 검사 실패 시 응답 형식
| 항목    | 값                         |
| ----- | ------------------------- |
| 상태 코드 | `400 Bad Request`         |
| 응답 바디 | `{ "message": "에러 메시지" }` |

---

## 🚀 앱 진입점 (`app.mjs`)

`app.mjs`는 전체 애플리케이션의 **서버 실행**, **라우터 등록**, **정적 파일 처리**, **미들웨어 연결** 등을 담당하는 진입 파일입니다.
---

### 정적 파일 제공

| 경로                | 설명                     |
| ----------------- | ---------------------- |
| `/public`         | HTML/CSS/JS 등 기본 정적 파일 |
| `/images`         | 이미지 리소스 제공용 정적 경로      |
| `/product_images` | 상품 이미지 접근 경로           |
---

### 미들웨어 설정

| 미들웨어                   | 설명                                 |
| ---------------------- | ---------------------------------- |
| `express.json()`       | JSON 요청 바디 파싱                      |
| `express.urlencoded()` | 폼 데이터 파싱 (`x-www-form-urlencoded`) |
---

### 라우터 연결
| API 경로       | 연결 모듈                 | 설명                  |
| ------------ | --------------------- | ------------------- |
| `/auth`      | `userRoutes.mjs`      | 로그인, 회원가입 등 사용자 인증  |
| `/product`   | `productRoutes.mjs`   | 상품 목록, 상품 상세 등      |
| `/wish`      | `wishlistRoutes.mjs`  | 사용자 위시리스트 관련        |
| `/recommend` | `recommendRoutes.mjs` | 추천 상품 기능            |
| `/manager`   | `managerRoutes.mjs`   | 관리자 전용 기능 (등록/수정 등) |
---

### 🏠 기본 라우터
**루트 URL(/)** 로 접속 시 **public/main.html** 파일을 반환합니다.
---

### 🖥 서버 실행
.env 또는 config.mjs에서 지정한 포트로 서버를 실행합니다.

```js
app.listen(config.host.port, () => {
  console.log(`서버가 포트 ${config.host.port}에서 실행 중`);
});
```
---
### 실행 성공 시
| 상황          | 결과        | 로그 메시지 예시                   | 설명                          |
| ----------- | --------- | --------------------------- | --------------------------- |
| ✅ 성공        | 서버 정상 실행됨 | `✅ 서버가 포트 8080에서 실행 중`      | 요청을 받을 준비가 완료된 상태           |

---

## ⚙️ 환경 설정 (`config.mjs`) 문서

이 파일은 `.env`에 정의된 환경 변수들을 로드하고, 서버/보안/DB/API 설정값으로 변환해 제공합니다.  
`dotenv`와 `required()` 유틸 함수를 통해, **필수 키가 누락되었을 경우 즉시 오류를 발생시켜** 실행을 중단시킵니다.

---

### ✅ 사용 목적

| 목적                 | 설명                                                       |
|----------------------|------------------------------------------------------------|
| `.env` 기반 설정     | 민감한 정보와 실행 환경 설정을 코드에서 분리               |
| 누락된 설정 감지     | `required()` 함수로 필수 환경 변수 누락 시 에러 발생        |
| 환경에 따른 유연성   | 로컬 / 개발 / 운영 환경에 따라 `.env` 내용만 바꿔 적용 가능 |

---
### 🔒 환경 변수 필수 검증 유틸리티: `required()`

#### `required(key, defaultValue)` 함수는 `.env` 파일에서 필수 설정값을 가져오고, 값이 존재하지 않을 경우 **즉시 오류를 발생시켜 서버 실행을 중단**시킵니다.
---
### 파라미터
| 인자명            | 타입                        | 설명                    |
| -------------- | ------------------------- | --------------------- |
| `key`          | string                    | `.env`에서 가져올 환경 변수 이름 |
| `defaultValue` | string\|number (optional) | 환경 변수 누락 시 사용할 기본값    |
---
### 사용 예시
```js
import { config } from './config.mjs';

console.log(config.jwt.secretKey); // JWT 시크릿 키 접근
console.log(config.db.host);       // DB 접속 주소
console.log(config.host.port);     // 서버 포트
```
---
### 키와 기본값 없을 시
```bash
Error: 키 JWT_SECRET는 undefined!!
```

### 🔑 `.env`에서 요구하는 변수 목록

| 키                         | 필수 | 설명                              | 기본값 (옵션) |
|----------------------------|------|-----------------------------------|----------------|
| `JWT_SECRET`               | ✅   | JWT 서명용 시크릿 키              | 없음           |
| `JWT_EXPIRES_SEC`          | ⛔   | JWT 만료 시간 (초 단위)           | 86400 (1일)    |
| `BCRYPT_SALT_ROUNDS`       | ⛔   | bcrypt 해시 salt 라운드           | 10             |
| `HOST_PORT`                | ⛔   | 서버 실행 포트                    | 8080           |
| `DB_HOST`                  | ✅   | 데이터베이스 호스트               | 없음           |
| `DB_USER`                  | ✅   | DB 접속 사용자명                  | 없음           |
| `DB_PASSWORD`              | ✅   | DB 비밀번호                       | 없음           |
| `DB_DATABASE`              | ✅   | 사용할 데이터베이스 이름          | 없음           |
| `DB_PORT`                  | ✅   | 데이터베이스 포트                 | 없음           |
| `WEATHER_API_SERVICE_KEY`  | ✅   | 외부 날씨 API의 서비스 키         | 없음           |

---
