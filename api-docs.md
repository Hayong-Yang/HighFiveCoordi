 <!-- API 문서 작성 예시입니다.

# API 문서

## 회원가입 API ...........................API 이름, URL, Method, Headers 등 정보

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

### Request Body ................................ API request 정보

```json
{
  "inputId": "testuser",
  "inputPw": "1234",
  "name": "홍길동",
  "email": "test@example.com",
  "phone": "01012345678"
}
```

### Success Response (201) .................................. API 요청 성공시 response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "inputId": "testuser"
}
```

### Error Response (409) ................................ API 요청 실패시 response

```json
{
  "message": "이미 존재하는 아이디입니다."
}
```
 -->
