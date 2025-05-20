function b64UrlDecode(s) {
  return atob(
    s.replace(/-/g, "+").replace(/_/g, "/") +
      ["", "===", "==", "="][s.length % 4]
  );
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
const protectedPost = (url, body) =>
  protectedFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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

async function markWishlisted() {
  if (!currentUserIdx) return;
  const res = await protectedFetch(`/wish/mine?user_idx=${currentUserIdx}`);
  if (!res.ok) return;
  const wished = (await res.json()).map((w) => Number(w.product_idx));
  document.querySelectorAll(".heart").forEach((h) => {
    if (wished.includes(Number(h.dataset.productIdx))) h.textContent = "❤️";
  });
}

document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("heart")) return;
  if (!currentUserIdx) return alert("로그인 후 이용 가능합니다!");

  const heart = e.target,
    productIdx = heart.dataset.productIdx;
  if (!productIdx) return alert("추천을 먼저 받아주세요!");

  const like = heart.textContent === "♡";
  heart.textContent = like ? "❤️" : "♡";

  const body = { user_idx: currentUserIdx, product_idx: productIdx };

  let res;
  if (like) {
    res = await protectedPost("/wish", body);
    if (res.status === 400) return; // ★ 이미 담긴 상품
  } else {
    res = await protectedFetch("/wish", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  if (!res.ok) {
    alert("위시리스트 저장 실패");
    heart.textContent = like ? "♡" : "❤️";
  }
});

window.addEventListener("load", () => {
  restoreRecommendationsFromLocalStorage();
  markWishlisted();
});
