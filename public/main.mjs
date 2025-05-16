// Base64URL → Base64 디코딩
function b64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  return atob(str);
}

// 토큰 만료 여부 확인
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = JSON.parse(b64UrlDecode(token.split(".")[1])); // exp: 초
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

// 만료·인증 실패 시 강제 로그아웃
function forceLogout(msg = "세션이 만료되었습니다. 다시 로그인해주세요.") {
  alert(msg);
  window.location.href = "/";
}

/********************************************************************
 * 1.  초기 로그인 상태 판정 & 버튼 토글
 ********************************************************************/
const signUpBtn = document.getElementById("signUp");
const logInBtn = document.getElementById("logIn");
const logOutBtn = document.getElementById("logOut");
const wishlistBtn = document.getElementById("Wishlist");
const doFetchBtn = document.getElementById("doFetchDataButton");

let token = localStorage.getItem("token");

// 만료된 토큰 발견 시 제거 + 강제 로그아웃
if (token && isTokenExpired(token)) {
  localStorage.removeItem("token");
  forceLogout();
}

// 버튼 표시
if (token) {
  signUpBtn.style.display = "none";
  logInBtn.style.display = "none";
  logOutBtn.style.display = "inline";
} else {
  signUpBtn.style.display = "inline";
  logInBtn.style.display = "inline";
  logOutBtn.style.display = "none";
}

/********************************************************************
 * 2.  네비게이션 이벤트
 ********************************************************************/
signUpBtn.addEventListener(
  "click",
  () => (window.location.href = "/auth/signUp")
);
logInBtn.addEventListener(
  "click",
  () => (window.location.href = "/auth/logIn")
);
wishlistBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/wish";
});

logOutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  alert("로그아웃 되었습니다.");
  window.location.href = "/";
});

/********************************************************************
 * 3.  보호 POST 요청 헬퍼 (토큰 부착 + 401 처리)
 ********************************************************************/
async function protectedPost(url, payload) {
  token = localStorage.getItem("token"); // 최신 토큰
  if (!token || isTokenExpired(token)) return forceLogout();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) return forceLogout();
  return res;
}

/********************************************************************
 * 4.  날씨 기반 추천 옷 요청
 ********************************************************************/
doFetchBtn.addEventListener("click", async () => {
  const baseDate = document.getElementById("base_date").value.replace(/-/g, "");
  const baseTime = document.getElementById("base_time").value;
  const nx = document.getElementById("nx").value;
  const ny = document.getElementById("ny").value;

  try {
    const res = await protectedPost("/recommend", {
      nx,
      ny,
      baseDate,
      baseTime,
    });
    if (!res) return; // forceLogout 발생 시 종료

    const data = await res.json();
    console.log("추천 결과:", data);
    // TODO: 화면에 data 표시 로직을 구현하세요.
  } catch (err) {
    console.error("추천 요청 오류:", err);
    alert("서버와 통신 중 오류가 발생했습니다.");
  }
});
