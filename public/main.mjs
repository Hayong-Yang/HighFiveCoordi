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

// POST: main.html에서 날씨 API 설정값 보내고, 추천 옷을 결과로 받아오는 기능
document
  .getElementById("doFetchDataButton")
  .addEventListener("click", async function getRecommendedClothes() {
    const baseDate = document
      .getElementById("base_date")
      .value.replace(/-/g, ""); // 'YYYY-MM-DD' 형식을 'YYYYMMDD'로 변환
    const baseTime = document.getElementById("base_time").value; // 기준 시간 (예: '0500', '0800' 등)
    const nx = document.getElementById("nx").value; // 격자 X좌표 (위도 기반)
    const ny = document.getElementById("ny").value; // 격자 Y좌표 (경도 기반)

    const res = await fetch("/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nx: nx,
        ny: ny,
        baseDate: baseDate,
        baseTime: baseTime,
      }),
    });
    const result = await res.json();
    if (res.ok) {
      const recommendation = result.recommendedResult;
      if (recommendation) {
        // console.log(recommendation.idx);
        // console.log(recommendation.category);
        // console.log(recommendation.image_url);
        // 프론트 각 div에 뿌려주기
        const categories = document.querySelectorAll(".category");
        // 기존 이미지 제거
        categories.forEach((categoryDiv) => {
          categoryDiv.innerHTML = ""; // 내부 모든 요소 제거 (즉, 이전 이미지 초기화)
        });
        // 이미지 추가
        recommendation.forEach((recommendation) => {
          const image = document.createElement("img");
          image.src = recommendation.image_url;
          image.alt = `추천 상품 ${recommendation.idx}`;
          image.classList.add("product-image"); // 스타일을 위해 클래스 추가 가능

          // 해당 category에 맞는 DOM 요소에 추가
          categories.forEach((categoryDiv) => {
            if (categoryDiv.classList.contains(recommendation.category)) {
              categoryDiv.appendChild(image);
              // 카테고리를 저장해두기 위해 data-category 속성 추가
              image.dataset.category = recommendation.category;
            }
          });
        });
        // DOM에 추가한 이미지들 다시 수집해서 저장
        const savedRecommendations = [];
        document.querySelectorAll(".product-image").forEach((img) => {
          savedRecommendations.push({
            src: img.src,
            alt: img.alt,
            category: img.dataset.category,
          });
        });
        // localStorage에 저장
        localStorage.setItem(
          "savedRecommendations",
          JSON.stringify(savedRecommendations)
        );
        console.log(JSON.parse(localStorage.getItem("savedRecommendations")));
      } else {
        console.log("추천 결과가 없습니다.");
      }
    } else {
      console.log(result);
    }
  });

// 옷 색상 적용 기능
document
  .getElementById("apply-btn")
  .addEventListener("click", async function applyColors() {
    // 상의 색상
    const topColor = document.getElementById("topColorPicker").value;
    const topSvg = document.getElementById("top-svg");
    const topRects = topSvg.querySelectorAll("rect");

    topRects.forEach((rect) => {
      // 목 부분은 fill:none이므로 제외
      if (rect.getAttribute("fill") !== "none") {
        rect.setAttribute("fill", topColor);
      }
    });

    // 하의 색상
    const bottomColor = document.getElementById("bottomColorPicker").value;
    const bottomSvg = document.getElementById("bottom-svg");
    const bottomRects = bottomSvg.querySelectorAll("rect");

    bottomRects.forEach((rect) => {
      rect.setAttribute("fill", bottomColor);
    });

    // POST: 적용하기 버튼 누르면 사용자가 선택한 색상 rgb값을 바탕으로 옷 추천화면이 새로고침 되는 기능
    const topColorPicker = document.getElementById("topColorPicker").value;
    const bottomColorPicker =
      document.getElementById("bottomColorPicker").value;
    console.log("상의색상:", topColorPicker, "하의 색상:", bottomColorPicker);

    const res = await fetch("/recommend/reloadByColor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topColor: topColorPicker,
        bottomColor: bottomColorPicker,
      }),
    });
  });

// 로컬스토리지에 저장한 추천옷을 새로고침하면 다시 불러오는 기능.
function restoreRecommendationsFromLocalStorage() {
  const saved = localStorage.getItem("savedRecommendations");
  if (!saved) return;

  const savedRecommendations = JSON.parse(saved);
  const categories = document.querySelectorAll(".category");

  savedRecommendations.forEach((item) => {
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt;
    image.classList.add("product-image");

    categories.forEach((categoryDiv) => {
      if (categoryDiv.classList.contains(item.category)) {
        categoryDiv.appendChild(image);
      }
    });
  });
}

window.addEventListener("load", function () {
  restoreRecommendationsFromLocalStorage(); // 너가 실행하고 싶은 함수
});
