/* wishlist.js  ─ 수정본 (2025-05-19) */
let allItems = []; // 전체 상품
let currentCategory = "all"; // 필터
let currentSort = "recent"; // 정렬
const token = localStorage.getItem("token");
const userIdx = localStorage.getItem("user_idx"); // ✅ 반드시 저장돼 있어야 함

document.addEventListener("DOMContentLoaded", () => {
  const wishlist = document.getElementById("wishlistSection");
  const emptyMsg = document.getElementById("emptyMessage");
  const sortSelect = document.getElementById("sortOptions");
  const logOutBtn = document.getElementById("logOut");

  if (token && userIdx) {
    // 로그인 상태
    wishlist.style.display = "grid";
    sortSelect.style.display = "inline-block";
    logOutBtn.style.display = "inline-block";
    loadWishList(); // 🔑 userIdx는 전역에서 참조
  } else {
    // 비로그인
    emptyMsg.style.display = "block";
    sortSelect.style.display = "none";
    logOutBtn.style.display = "none";
  }

  /* 카테고리 필터 */
  document.querySelectorAll(".header__menu a").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      currentCategory = a.className; // all, top, bottom …
      renderFilteredList();
    })
  );

  /* 정렬 옵션 */
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value; // recent | lowPrice | highPrice
    renderFilteredList();
  });

  /* 로그아웃 */
  logOutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    alert("로그아웃 되었습니다.");
    location.href = "/";
  });
});

/* -------- 서버에서 내 위시리스트 가져오기 -------- */
async function loadWishList() {
  try {
    // ✅ 템플릿 리터럴(back-tick) + encodeURIComponent
    const res = await fetch(
      `/wish/mine?user_idx=${encodeURIComponent(userIdx)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    /* 컨트롤러가 배열을 바로 주거나 {rows:[…]}로 줄 수 있으므로 둘 다 대비 */
    allItems = Array.isArray(data) ? data : data.rows || [];
    renderFilteredList();
  } catch (err) {
    console.error("위시리스트 불러오기 실패:", err.message);
  }
}

/* -------- 목록 필터+정렬 후 렌더링 -------- */
function renderFilteredList() {
  let list =
    currentCategory === "all"
      ? [...allItems]
      : allItems.filter((i) => i.category === currentCategory);

  list.sort((a, b) => {
    if (currentSort === "recent") return b.wishlist_idx - a.wishlist_idx;
    if (currentSort === "lowPrice") return a.price - b.price;
    if (currentSort === "highPrice") return b.price - a.price;
    return 0;
  });

  renderCustomList(list);
}

/* -------- 카드 UI 그리기 -------- */
function renderCustomList(list) {
  const section = document.getElementById("wishlistSection");
  section.innerHTML = ""; // reset

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.category = item.category;
    card.innerHTML = `
      <img src="${item.image_url}" alt="상품 이미지" />
      <div class="product-info">
        <p class="name">${item.name}</p>
        <p class="price">${item.price.toLocaleString()}원</p>
      </div>
      <!-- ✅ 서버에서 사용하는 필드명과 동일하게 data-product-idx -->
      <button class="heart active" data-product-idx="${
        item.product_idx
      }">❤️</button>
    `;
    section.appendChild(card);
  });

  /* ♥ 클릭 → DELETE /wish */
  section.querySelectorAll(".heart").forEach((heart) =>
    heart.addEventListener("click", async () => {
      const productIdx = heart.dataset.productIdx; // ← camelCase로 읽힘
      try {
        const res = await fetch("/wish", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_idx: userIdx, product_idx: productIdx }),
        });
        if (!res.ok) throw new Error((await res.json()).message);
        // 성공: UI & allItems 동기화
        allItems = allItems.filter((i) => i.product_idx !== Number(productIdx));
        renderFilteredList();
      } catch (err) {
        console.error("찜 삭제 실패:", err.message);
      }
    })
  );
}
