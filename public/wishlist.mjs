let allItems = []; // 전체 상품 저장용 (필터링을 위해 필요)

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const wishlist = document.getElementById("wishlistSection");
  const emptyMsg = document.getElementById("emptyMessage");

  if (token) {
    // 로그인 된 상태
    wishlist.style.display = "grid";
    loadWishList(); // 로그인 상태면 위시리스트 로딩
  } else {
    // 로그인 안 된 상태
    emptyMsg.style.display = "block";
  }

  // 카테고리 메뉴 클릭 이벤트 등록
  const menuItems = document.querySelectorAll(".header__menu a");
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedCategory = item.className; // all, top, bottom 등

      renderFilteredList(selectedCategory);
    });
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
  const wishlistSection = document.getElementById("wishlistSection");
  wishlistSection.innerHTML = "";

  const filtered =
    category === "all"
      ? allItems
      : allItems.filter((item) => item.category === category);

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-category", item.category);

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

  const hearts = document.querySelectorAll(".heart");
  hearts.forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("active");
      heart.textContent = heart.classList.contains("active") ? "❤️" : "♡";
    });
  });
}

window.onload = loadWishList();
