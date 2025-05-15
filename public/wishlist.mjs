let allItems = []; // 전체 상품 데이터
let currentCategory = "all"; // 현재 선택된 카테고리
let isSortedByOldest = false; // 담은순 버튼 눌렸는지 여부

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const wishlist = document.getElementById("wishlistSection");
  const emptyMsg = document.getElementById("emptyMessage");
  const sortBtn = document.getElementById("sortByCreatedAt");

  if (token) {
    // 로그인 된 상태
    wishlist.style.display = "grid";
    if (sortBtn) sortBtn.style.display = "inline-block";
    loadWishList(); // 로그인 상태면 위시리스트 로딩
  } else {
    // 로그인 안 된 상태
    emptyMsg.style.display = "block";
    if (sortBtn) sortBtn.style.display = "none";
  }

  // 카테고리 클릭 이벤트
  document.querySelectorAll(".header__menu a").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      currentCategory = item.className; // all, top, bottom 등
      isSortedByOldest = false; // 카테고리 클릭 시 정렬 초기화
      renderFilteredList(currentCategory);
    });
  });

  // 담은순(오래된 순) 버튼 클릭 이벤트
  if (sortBtn) {
    sortBtn.addEventListener("click", () => {
      isSortedByOldest = true;
      renderFilteredList(currentCategory); // 현재 카테고리 기준 정렬
    });
  }
});

async function loadWishList() {
  try {
    const res = await fetch("/wish/wishlist", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (res.ok) {
      allItems = result.rows || result;
      renderFilteredList("all");
    } else {
      console.error(result.message);
    }
  } catch (err) {
    console.error("Wishlist 불러오기 중 에러:", err);
  }
}

function renderFilteredList(category) {
  let list =
    category === "all"
      ? [...allItems]
      : allItems.filter((item) => item.category === category);

  if (isSortedByOldest) {
    list.sort((a, b) => a.idx - b.idx); // 담은순: 오래된 것 먼저
  } else {
    list.sort((a, b) => b.idx - a.idx); // 최신순: 최근 담은 것 먼저
  }

  renderCustomList(list);
}

function renderCustomList(list) {
  const wishlistSection = document.getElementById("wishlistSection");
  wishlistSection.innerHTML = "";

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
          <button class="heart">♡</button>
        `;

    wishlistSection.appendChild(card);
  });

  wishlistSection.querySelectorAll(".heart").forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("active");
      heart.textContent = heart.classList.contains("active") ? "❤️" : "♡";
    });
  });
}
