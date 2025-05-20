let savedFeltTemperature; // 전역 변수 선언
let weatherLevel;

// Base64URL → Base64 디코딩
function b64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  return atob(str);
}
function isTokenExpired(tok) {
  if (!tok) return true;
  try {
    const { exp } = JSON.parse(b64UrlDecode(tok.split(".")[1]));
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}
function forceLogout(msg = "세션이 만료되었습니다. 다시 로그인해주세요.") {
  alert(msg);
  location.href = "/";
}

const signUpBtn = document.getElementById("signUp");
const logInBtn = document.getElementById("logIn");
const logOutBtn = document.getElementById("logOut");
const wishlistBtn = document.getElementById("Wishlist");
const doFetchBtn = document.getElementById("doFetchDataButton");
const userIdDisplay = document.getElementById("userIdDisplay");

let token = localStorage.getItem("token");

// ★ user_idx = numeric PK, userid = 화면용 아이디
let currentUserIdx = Number(localStorage.getItem("user_idx")) || null; // ★

// 토큰 만료 시 강제 로그아웃
if (token && isTokenExpired(token)) {
  localStorage.clear();
  forceLogout();
}

if (token) {
  signUpBtn.style.display = "none";
  logInBtn.style.display = "none";
  logOutBtn.style.display = "inline";
  try {
    const p = JSON.parse(b64UrlDecode(token.split(".")[1]));
    if (p.idx) {
      currentUserIdx = p.idx;
      localStorage.setItem("user_idx", p.idx);
    }
    if (p.userid) {
      localStorage.setItem("userid", p.userid);
      userIdDisplay.textContent = `${p.userid}님 환영합니다!`;
      userIdDisplay.style.display = "inline";
    }
  } catch {
    userIdDisplay.style.display = "none";
  }
} else {
  signUpBtn.style.display = "inline";
  logInBtn.style.display = "inline";
  logOutBtn.style.display = "none";
  userIdDisplay.style.display = "none";
}

signUpBtn.onclick = () => (location.href = "/auth/signUp");
logInBtn.onclick = () => (location.href = "/auth/logIn");
wishlistBtn.onclick = (e) => {
  e.preventDefault();
  location.href = "/wish";
};
logOutBtn.onclick = (e) => {
  e.preventDefault();
  localStorage.clear();
  alert("로그아웃 되었습니다.");
  location.href = "/";
};

async function protectedFetch(url, opt = {}) {
  const tk = localStorage.getItem("token");
  if (!tk || isTokenExpired(tk)) return forceLogout();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${tk}`, ...opt.headers },
    ...opt,
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
      savedFeltTemperature = result.feltTemperature; // 전역변수에 할당
      weatherLevel = result.level;

      // console.log(savedFeltTemperature);
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

// 추천 옷 요청
doFetchBtn.addEventListener("click", async () => {
  const res = await fetch("/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nx: document.getElementById("nx").value,
      ny: document.getElementById("ny").value,
      baseDate: document.getElementById("base_date").value.replace(/-/g, ""),
      baseTime: document.getElementById("base_time").value,
    }),
  });
  const { recommendedResult } = await res.json();
  if (!res.ok || !recommendedResult)
    return console.log("추천 결과가 없습니다.");

  /* ★ MOD 1: 모든 하트를 "♡"로 초기화 + 데이터 삭제 */
  document.querySelectorAll(".heart").forEach((h) => {
    h.textContent = "♡";
    delete h.dataset.productIdx; // ★
  });

  /* ★ MOD 2: 기존 이미지 제거 */
  document
    .querySelectorAll(".category img.product-image")
    .forEach((img) => img.remove());

  /* 새 이미지 & 하트 세팅 */
  recommendedResult.forEach((r) => {
    document.querySelectorAll(`.category.${r.category}`).forEach((div) => {
      const img = document.createElement("img");
      img.src = r.image_url;
      img.alt = `추천 상품 ${r.idx}`;
      img.className = "product-image";
      div.appendChild(img);

      const heart = div.querySelector(".heart");
      if (heart) {
        heart.dataset.productIdx = r.idx;
        heart.textContent = "♡";
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
        level: weatherLevel,
      }),
    });
    const result = await res.json();
    if (res.ok) {
      const recommendation = result.recommendedResult;
      console.log("색상적용으로 받아온 결과:", recommendation);
      if (recommendation) {
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

  localStorage.setItem(
    "savedRecommendations",
    JSON.stringify(
      recommendedResult.map((r) => ({
        src: r.image_url,
        alt: `추천 상품 ${r.idx}`,
        category: r.category,
        productIdx: r.idx,
      }))
    )
  );

  await markWishlisted();
});

function restoreRecommendationsFromLocalStorage() {
  const saved = localStorage.getItem("savedRecommendations");
  if (!saved) return;
  const items = JSON.parse(saved);
  items.forEach((it) => {
    document.querySelectorAll(`.category.${it.category}`).forEach((div) => {
      const img = document.createElement("img");
      img.src = it.src;
      img.alt = it.alt;
      img.className = "product-image";
      div.appendChild(img);
      const heart = div.querySelector(".heart");
      if (heart) heart.dataset.productIdx = it.productIdx;
    });
  });
}

window.addEventListener("load", function () {
  restoreRecommendationsFromLocalStorage();
});
