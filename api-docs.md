
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
---
---
## 📚 API 문서 목차


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
---

## 1. 🧑 사용자 인증 API

### UserController

#### 회원가입 API

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Headers**:  

##### 요청 바디

```json
{
  "inputId": "testuser",
  "inputPw": "1234",
  "name": "김사과",
  "email": "apple@example.com",
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

##### 요청 성공 (201)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "inputId": "testuser"
}
```

##### 요청 실패 (401)

##### _중복확인 안함_

```json
{
  "message": "아이디 중복 확인을 해주세요"
}
```

#####  _개인정보 동의 안함_

```json
{
  "message": "개인정보 수집 및 이용 동의가 필요합니다."
}
```

---

##### 아이디 중복 확인 API

- **URL**: `/api/auth/check-id`
- **Method**: `POST`
- **Headers**:  
  `Content-Type: application/json`

##### _요청 바디_

```json
{
  "inputId": "testuser"
}
```

##### _사용 가능한 아이디 (200)_

```json
{
  "message": "testuser는 사용가능합니다."
}
```

##### _이미 존재하는 아이디  (409)_

```json
{
  "message": "testuser이 이미 있습니다."
}
```
##### _아이디가 입려되지 않은 경우 (400)_

```json
{
  "message": "아이디를 입력해주세요."
}
```
---
####  로그인 API

사용자가 입력한 아이디(`inputId`)와 비밀번호(`inputPw`)를 확인하여,  
정상 인증되면 **JWT 토큰을 생성해 응답**하는 로그인 기능입니다.

---

#### 요청 개요

- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Content-Type**: `application/json`

---

##### 요청 바디

```json
{
  "inputId": "testuser",
  "inputPw": "12345678"
}
```
##### 요청 예시

##### _요청 성공 (200)_
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userid": "testuser"
}
```
이 토큰을 localStorage, cookie, 또는 Authorization 헤더에 저장하여
이후 인증된 요청에 활용할 수 있습니다.

##### _아이디 존재하지 않음 (401)_
```json
"testuser 아이디를 찾을 수 없음"
```

##### _비밀번호 불일치 (401)_
```json
{
  "message":"아이디 또는 비밀번호 확인"
}
```
####  인증 확인 및 내 정보 조회 API

##### 사용자 인증 확인 (`/auth/verify`)

요청에 포함된 JWT 토큰에서 사용자 ID가 추출되었는지 확인합니다.  
주로 로그인 상태 확인, 인증된 사용자 전용 기능 활성화 등에 사용됩니다.

---

#### 요청 개요

- **Method**: `GET`
- **Endpoint**: `/auth/verify`
- **Headers**:
  ```http
  Authorization: Bearer {JWT_TOKEN}
  ```
####  처리 흐름

1. **JWT 인증 미들웨어 작동**
   - `Authorization: Bearer <token>` 헤더가 요청에 포함됨
   - 토큰을 복호화하여 사용자 정보 추출
   - `request.id` 및 `request.token` 속성에 값 설정

2. **DB에서 사용자 조회**
   - `authRepository.findById(request.id)` 실행
   - 토큰 안의 `id`로 실제 DB에 존재하는 사용자 확인

3. **응답 반환**
   - 사용자 정보가 있으면:
     - 상태코드 `200 OK`
     - 응답 바디에 `token`, `userid` 포함
   - 사용자 정보가 없으면:
     - 상태코드 `404 Not Found`
     - 메시지: `"일치하는 사용자가 없음"`


#### 상태 코드
| 엔드포인트          | 코드    | 의미            |
| -------------- | ----- | ------------- |
| `/auth/verify` | `200` | 인증 성공 (id 반환) |
| `/auth/verify` | `401` | 인증 실패         |
| `/auth/me`     | `200` | 사용자 정보 반환     |
| `/auth/me`     | `404` | 사용자를 찾을 수 없음  |
---
#### 아이디 찾기 API

사용자의 이름(`name`)과 이메일(`email`)을 기준으로  
회원가입된 사용자의 `userid`를 찾아 반환합니다.

---

#### 요청 개요

- **Method**: `POST`
- **Endpoint**: `/auth/find-id`
- **Content-Type**: `application/json`

---

##### 요청 바디

```json
{
  "name": "김사과",
  "email": "apple@example.com"
}
```
##### 응답 예시

##### _일치하는 사용자 (200)_
```json
{
  "success": true,
  "user_id": "testuser"
}
```
##### _일치하는 정보 없음 (200)_
```json
{
  "success": false,
  "message": "일치하는 정보가 없습니다."
}
```
응답은 200이지만 success:false로 실패

##### _서버 오류 (500)_
```json
{
  "success": false,
  "message": "서버 오류"
}
```
#### 처리 흐름
1.클라이언트가 이름과 이메일을 POST 요청으로 보냄

2.서버가 SQL 실행:
```sql
SELECT userid FROM users WHERE name = ? AND email = ?
```
3.결과가 존재하면 → user_id 반환

4.없으면 → "일치하는 정보가 없습니다" 메시지 반환

5.오류 발생 시 → 500 상태로 "서버 오류" 반환

#### SMS 인증번호 전송 기능

CoolSMS API를 사용하여  
사용자의 휴대폰으로 **인증번호를 전송**하는 비동기 함수입니다.

---

#### _기능 설명_

- 외부 SMS 서비스 **CoolSMS SDK**를 통해 문자 메시지를 보냅니다.
- 발신번호(`from`)와 수신번호(`to`)는 전화번호 형식(숫자만)이어야 하며, 인증된 발신번호만 사용 가능합니다.
- 현재 메시지 내용은 하드코딩된 `"인증번호 1234"`입니다.
---

#### _사용된 모듈 및 설정_

```js
import pkg from "coolsms-node-sdk";

const Coolsms = pkg.default;

const messageService = new Coolsms(
  process.env.apiKey_pw,
  process.env.apiSecret_pw
);
```
| 환경변수           | 설명                 |
| -------------- | ------------------ |
| `apiKey_pw`    | CoolSMS API Key    |
| `apiSecret_pw` | CoolSMS Secret Key |
| `senderNumber` | 인증된 발신 전화번호        |

---
#### _호출 _
```js
await sendSMS("01012345678");
```
##### _정상 응답_
```json
{
  "groupId": "G4V20250520113000",
  "statusCode": "2000",
  "statusMessage": "Success",
  "to": "01012345678"
}
```
##### _오류 응답_
```bash
❌ 문자 전송 오류: [Error 객체 또는 응답 JSON]
```
##### _❌ 문자 전송 오류 코드 표_

| 오류 예시 | 오류 코드 | 오류 메시지 | 원인 설명 |
|-----------|-----------|-------------|------------|
| 전화번호 오류 | `4000` | `Invalid recipient number.` | 수신자 번호 형식이 잘못되었거나 존재하지 않음 |
| 발신 번호 인증 안 됨 | `4004` | `Unregistered sender number.` | 발신 번호(`from`)가 CoolSMS에 등록되지 않음 |
| API Key 오류 | 없음 (예외 발생) | `Unauthorized. Invalid API key or secret` | 환경변수의 `apiKey_pw`, `apiSecret_pw`가 잘못됨 |
| 서버 연결 실패 | 없음 (예외 발생) | `connect ETIMEDOUT sms.coolsms.co.kr:443` | CoolSMS 서버와 연결 실패 (네트워크 문제, 방화벽 등) |
---
#### 라우팅 함수

| 함수 이름       | 역할 설명                              | HTTP 메서드 | 엔드포인트            | 반환 위치 (HTML 파일 or 경로)        |
|----------------|------------------------------------------|-------------|------------------------|----------------------------------------|
| `toLogin`      | 로그인 페이지로 이동                     | GET         | `/auth/login`         | `/public/login.html`                   |
| `toSignUp`     | 회원가입 페이지로 이동                   | GET         | `/auth/signup`        | `/public/signup.html`                  |
| `logOut`       | 로그아웃 처리 후 메인 페이지로 리디렉션 | GET         | `/auth/logout`        | `/` (메인 페이지, 클라이언트가 토큰 삭제) |
| `toFindId`     | 아이디 찾기 페이지로 이동                | GET         | `/auth/find-id`       | `/public/find-id.html`                 |
| `toFindPw`     | 비밀번호 찾기 페이지로 이동              | GET         | `/auth/find-pw`       | `/public/find-pw.html`                 |

---
### Data.Auth
#### 회원 생성 함수 (`createUser`)

`createUser`는 사용자가 회원가입할 때, 사용자 정보를 데이터베이스의 `users` 테이블에 저장하고  
생성된 사용자의 고유 식별자(`insertId`)를 반환하는 함수입니다.

---
#### _매개변수_
| 인자 이름      | 타입     | 설명                   |
| ---------- | ------ | -------------------- |
| `userId`   | string | 사용자 아이디 (고유)         |
| `hashedPw` | string | 해시된 비밀번호 (bcrypt 사용) |
| `name`     | string | 사용자 이름               |
| `email`    | string | 사용자 이메일              |
| `phone`    | string | 전화번호 (숫자형 문자열)       |

#### _실행 쿼리_
```sql
| 인자 이름      | 타입     | 설명                   |
| ---------- | ------ | -------------------- |
| `userId`   | string | 사용자 아이디 (고유)         |
| `hashedPw` | string | 해시된 비밀번호 (bcrypt 사용) |
| `name`     | string | 사용자 이름               |
| `email`    | string | 사용자 이메일              |
| `phone`    | string | 전화번호 (숫자형 문자열)       |
```
실제 전달되는 값은 매개변수 배열 [userId, hashedPw, name, email, phone]

#### 처리 흐름
- 1.사용자 입력 정보는 서버에서 bcrypt.hash()로 비밀번호를 암호화

- 2.위 정보를 기반으로 INSERT INTO users SQL 실행

- 3.쿼리 성공 시 insertId (사용자 고유번호) 반환

- 4.이후 이 ID는 JWT 생성, 세션 식별 등 다양한 용도로 사용됨

#### 사용자 로그인 처리 함수 (`logIn`)

입력된 사용자 아이디와 비밀번호를 검증하여,  
일치할 경우 해당 사용자의 정보를 반환하는 로그인 인증 함수입니다.

#### 실행 쿼리
```sql
SELECT * FROM users WHERE userId = ?
```
---
### UserRoutes
#### 회원 기능 라우터 정리

| HTTP 메서드 | 경로                | 연결된 함수         | 설명 |
|--------------|---------------------|----------------------|------|
| `POST`       | `/signUp`           | `signUp`             | 회원가입 처리 (유효성 검증 후 DB 저장 및 토큰 발급) |
| `GET`        | `/signUp`           | `toSignUp`           | 회원가입 페이지 HTML 반환 |
| `POST`       | `/duplicateCheck`   | `duplicateIdCheck`   | 아이디 중복 체크 처리 |
| `POST`       | `/logIn`            | `logIn`              | 로그인 처리 (아이디/비밀번호 검증 후 토큰 발급) |
| `GET`        | `/logIn`            | `toLogin`            | 로그인 페이지 HTML 반환 |
| `GET`        | `/logout`           | `logOut`             | 로그아웃 후 메인 페이지로 리디렉션 (토큰 삭제는 클라이언트가 수행) |
| `POST`       | `/find-id`          | `findUserId`         | 이름+이메일로 아이디 찾기 처리 |
| `GET`        | `/find-id.html`     | `toFindId`           | 아이디 찾기 HTML 페이지 반환 |
| `GET`        | `/find-pw.html`     | `toFindPw`           | 비밀번호 찾기 HTML 페이지 반환 |

#### 인증번호 문자 전송 API

회원의 아이디(`userId`)와 전화번호(`phone`)를 입력받아  
해당 사용자가 존재하면 인증번호를 생성하여 문자로 전송하는 API입니다.  
CoolSMS API를 사용하며, 인증번호는 5분 동안 유효합니다.


####  요청 개요

- **Method**: `POST`
- **Endpoint**: `/sendSms`
- **Content-Type**: `application/json`

---

####  요청 바디 예시

```json
{
  "pwId": "user123",
  "pwPhone": "01012345678"
}
```
| 필드명       | 타입     | 필수 | 설명                |
| --------- | ------ | -- | ----------------- |
| `pwId`    | string | ✅  | 사용자 아이디           |
| `pwPhone` | string | ✅  | 사용자 전화번호 (숫자 문자열) |

#### _응답 성공(200)_
```json
{
  "message": "인증번호 전송 완료"
}
```
#### _응답 실패(400)_
```json
{
  "message": "아이디 또는 전화번호가 누락되었습니다."
}
```
#### _응답 실패(404)_
```json
{
  "message": "사용자를 찾을 수 없습니다."
}
```
#### _응답 실패(402)_
```json
{
  "message": "📛 잔액이 부족하여 문자 발송에 실패했습니다."
}
```
#### 🔐비밀번호 재설정 흐름 API
---
####  인증번호 검증 API

#### 개요

- **Method**: `POST`
- **Endpoint**: `/verifyCode`
- **설명**: 사용자가 입력한 인증번호가 서버에서 발급한 값과 일치하는지 검증합니다.

---

####  요청 바디

```json
{
  "pwPhone": "01012345678",
  "code": "123456"
}
```
#### _인증 성공(200)_
```json
{ "message": "인증 성공" }
```
#### _인증 실패(410)_
```json
{ "message": "인증번호가 만료되었거나 없습니다." }
```
#### _인증 실패(400)_
```json
{ "message": "인증번호가 일치하지 않습니다." }
```
---
#### 비밀번호 재설정 API

#### 개요

- **Method**: `POST`
- **Endpoint**: `/resetPassword`
- **설명**: 사용자가 새 비밀번호를 입력하면, 해당 사용자의 비밀번호를 암호화하여 DB에 갱신합니다.

#### 요청 바디
```json
{
  "userId": "user123",
  "newPassword": "newSecure123!"
}
```
| 필드명           | 타입     | 필수 | 설명                   |
| ------------- | ------ | -- | -------------------- |
| `userId`      | string | ✅  | 비밀번호를 재설정할 사용자 ID    |
| `newPassword` | string | ✅  | 새 비밀번호 (평문, 서버에서 해싱) |

#### _응답 성공(200)_
```json
{
  "message": "비밀번호가 성공적으로 재설정되었습니다."
}
```
#### _응답 실패(400)_
```json
{
  "message": "필수 항목이 누락되었습니다."
}
```
#### _응답 실패(500)_
```json
{
  "message": "서버 오류"
}
```
---
---
## 🌤 추천 상품 API
---

### RecommendController

#### 날씨 기반 옷 추천 API
기상청 단기예보 API를 통해 날씨 데이터를 받아와  
기온/풍속/강수확률을 분석하고, 이를 기반으로 체감온도를 계산하여  
추천 알고리즘에 따라 **옷 조합을 추천**하는 API입니다.

#### 개요
- **URL**: `/recommend`
- **Method**: `POST`
- **Headers**:  
  `Content-Type: application/json`

#### 요청 바디

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

#### 구조
| 필드명                 | 타입     | 설명                    |
| ------------------- | ------ | --------------------- |
| `recommendedResult` | array  | 카테고리별 옷 추천 결과         |
| `temperature`       | number | 실제 기온                 |
| `windSpeed`         | number | 풍속 (m/s)              |
| `rainPercent`       | number | 강수확률 (%)              |
| `feltTemperature`   | number | 체감온도                  |
| `level`             | number | 체감온도에 따른 추천 레벨 (1\~3) |

#### _요청 성공(200)_

```json
{
  "recommendations": ["id", "1 (temp_level)","url", "category"]
}
```
#### _요청 실패_
| 상황                  | 상태코드  | 메시지                        |
| ------------------- | ----- | -------------------------- |
| 날씨 데이터 일부 없음        | `404` | `"예보 데이터를 충분히 찾을 수 없습니다."` |
| API 호출 실패 / 네트워크 오류 | `500` | `"날씨 데이터를 불러오는 중 오류 발생"`   |
---
#### 색상 적용하기 API
사용자가 색상을 직접 선택한 후,
해당 색상에 조화를 이루는 추천 옷들을 받아오는 기능입니다.

- **URL**: `/recommend/reloadByColor`
- **Method**: `POST`
- **Headers**:  
  `Content-Type: application/json`

#### 요청 바디
```json
{
  "topColor": 120,
  "level": 2
}
```
| 필드명        | 타입     | 설명                                   |
| ---------- | ------ | ------------------------------------ |
| `topColor` | number | 사용자가 선택한 색상(Hue, 0\~360)             |
| `level`    | number | 날씨에 따른 추천 등급 (1: 추움, 2: 보통, 3: 더움 등) |

#### _응답 성공(200)_
```json
{
  "recommendedResult": [
    {
      "category": "pants",
      "image_url": "http://localhost:8080/product_images/pants_01.jpg"
    },
    {
      "category": "outer",
      "image_url": "http://localhost:8080/product_images/outer_02.jpg"
    },
    ...
  ]
}
```
#### _응답 실패(500)_
```json
"날씨 데이터를 불러오는 중 오류 발생"
```

---
### Data.Recommend

#### `rgbToHSL(hex)` 함수

#### 개요

HEX 형식의 RGB 문자열 (`"#rrggbb"`)을 입력받아 **HSL 색상 모델**로 변환합니다.  
또한, 특수 입력값 `0`이 들어오면 **무작위 랜덤 HSL 색상**을 반환합니다.  
올바르지 않은 입력값에 대해서는 **예외 처리**를 수행합니다.

---

#### 파라미터

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `hex` | string 또는 number | ✅ | HEX 색상 문자열 (`"#rrggbb"`), 또는 `0`(랜덤 색상 요청 시) |

---

#### 반환값

```js
{ h: number, s: number, l: number }
```
| 키   | 설명              | 범위       |
| --- | --------------- | -------- |
| `h` | Hue (색상각)       | 0 \~ 360 |
| `s` | Saturation (채도) | 0 \~ 100 |
| `l` | Lightness (명도)  | 0 \~ 100 |

- 1.숫자 0일 경우 -> 랜덤

```js
if (hex === 0)
```
- 2.유효하지 않은 hex입력
```js
if (typeof hex !== "string" || !hex.startsWith("#") || hex.length !== 7)
```
```js
console.warn("❌ 유효하지 않은 hex 입력값:", hex);
return { h: NaN, s: 0, l: 0 };
```
#### 반환

| 입력          | 출력 (예시)                             |
| ----------- | ----------------------------------- |
| `"#ffcc00"` | `{ h: 48, s: 100, l: 60 }`          |
| `0`         | `{ h: 271, s: 42, l: 78 }` *(랜덤)*   |
| `"123456"`  | `{ h: NaN, s: 0, l: 0 }` *(잘못된 입력)* |
---
#### 체감온도 계산 및 온도 레벨 분류 함수

---

#### calculateWindChill

주어진 기온(`temp`)과 풍속(`windSpeed`)을 이용하여 **체감온도**를 계산합니다.  
체감온도는 사람이 실제로 느끼는 온도를 나타내며, 날씨 기반 옷 추천 로직에서 핵심 기준값입니다.

---

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `temp` | number / string | 실제 기온 (℃) |
| `windSpeed` | number / string | 풍속 (m/s) |

---

#### getTempLevel
체감온도를 기반으로 추천 레벨을 분류합니다.
이 레벨은 옷 추천 알고리즘에서 계절감 또는 두께에 따른 필터링 기준으로 사용됩니다.

| 파라미터        | 타입     | 설명           |
| ----------- | ------ | ------------ |
| `windChill` | number | 계산된 체감온도 (℃) |
---
| 값   | 의미                    |
| --- | --------------------- |
| `3` | 더운 날씨 (23℃ 이상)        |
| `2` | 보통 날씨 (10℃ 이상 23℃ 미만) |
| `1` | 추운 날씨 (10℃ 미만)        |
---
### Data.ColorHarmony

---

---
### productCotroller (핫픽 상품 TOP 3 조회 API)
사용자들이 선호하는 `hot_pick` 점수를 기준으로 상위 3개의 상품을 조회합니다.  
만약 `hot_pick > 0`인 상품이 없을 경우, 전체 상품 중 무작위 3개를 반환합니다.

---

#### 요청 개요

- **Method**: `GET`
- **Endpoint**: `/products/top-picks` _(http://localhost:8080/product_images/201_pants-long_black.webp)_
- **Query Params**: 없음

---
#### 구조

| 필드명         | 타입     | 설명                  |
| ----------- | ------ | ------------------- |
| `idx`       | int    | 상품 고유 ID            |
| `name`      | string | 상품명                 |
| `category`  | enum   | top, pants, outer 등 |
| `price`     | int    | 가격                  |
| `hot_pick`  | int    | 핫픽 점수               |
| `image_url` | string | 이미지 URL             |
| ...         | ...    | 기타 상품 정보            |


#### 1. _`hot_pick` 기준 상위 3개 응답_

```json
[
  {
    "idx": 7,
    "name": "썸머 시어서커 밴딩 팬츠",
    "category": "pants",
    "hot_pick": 98,
    "price": 32000,
    "image_url": "...",
    ...
  },
  ...
]
```
#### 2. _`hot_pick>0`인 상품이 없을 때 랜덤 3개_
```json
[
  {
    "idx": 12,
    "name": "퓨어코튼 펀칭 카라 니트",
    "category": "top",
    "hot_pick": 0,
    ...
  },
  ...
]
```
#### _응답 오류(500)_
```json
{
  "message": "핫픽 상위 3개 조회 실패",
  "error": "에러 메시지 내용"
}
```
---
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

#### 요청 헤더

| Header         | 필수 | 설명                                      | 예시                                               |
|----------------|------|-------------------------------------------|----------------------------------------------------|
| Authorization  | ✅   | Bearer 토큰 형식의 JWT (`Bearer <token>`) | 

#### 실제 전달하고자 하는 내용

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
