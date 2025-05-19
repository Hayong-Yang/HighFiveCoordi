let allItems = []; // 전체 상품 데이터
let currentCategory = "all"; // 현재 선택된 카테고리
let currentSort = "recent"; // 정렬 기준: recent | lowPrice | highPrice

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const wishlist = document.getElementById("wishlistSection");
  const emptyMsg = document.getElementById("emptyMessage");
  const sortSelect = document.getElementById("sortOptions");

  if (token) {
    // 로그인 된 상태
    wishlist.style.display = "grid";
    sortSelect.style.display = "inline-block";
    loadWishList(); // 로그인 상태면 위시리스트 로딩
    logOutBtn.style.display = "inline";
  } else {
    // 로그인 안 된 상태
    emptyMsg.style.display = "block";
    sortSelect.style.display = "none";
    logOutBtn.style.display = "none";
  }

  // 카테고리 클릭 이벤트
  document.querySelectorAll(".header__menu a").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      currentCategory = item.className; // all, top, bottom 등
      renderFilteredList(currentCategory);
    });
  });

  // 정렬 옵션 변경 이벤트
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderFilteredList(currentCategory);
  });
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

  if (currentSort === "recent") {
    list.sort((a, b) => b.idx - a.idx); // 최신순
  } else if (currentSort === "lowPrice") {
    list.sort((a, b) => a.price - b.price); // 낮은 가격순
  } else if (currentSort === "highPrice") {
    list.sort((a, b) => b.price - a.price); // 높은 가격순
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
          <button class="heart active" data-product-id="${item.idx}">❤️</button>
        `;

    wishlistSection.appendChild(card);
  });

  wishlistSection.querySelectorAll(".heart").forEach((heart) => {
    heart.addEventListener("click", async () => {
      const productId = heart.dataset.productId;

      if (heart.classList.contains("active")) {
        // UI 업데이트
        heart.classList.remove("active");
        heart.textContent = "♡";

        // 서버에 위시리스트 삭제 요청
        try {
          const res = await fetch(`/wish/wishlist/${productId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (res.ok) {
            // 성공 시 해당 아이템 제거
            allItems = allItems.filter(
              (item) => item.idx !== parseInt(productId)
            );
            renderFilteredList(currentCategory); // 현재 카테고리 다시 그리기
          } else {
            console.error("삭제 실패", await res.json());
          }
        } catch (err) {
          console.error("서버 통신 에러", err);
        }
      }
    });
  });
}

const logOutBtn = document.getElementById("logOut");

logOutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  alert("로그아웃 되었습니다.");
  window.location.href = "/";
});
