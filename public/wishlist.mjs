document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const wishlist = document.getElementById("wishlistSection");
  const emptyMsg = document.getElementById("emptyMessage");

  if (token) {
    // 로그인 된 상태
    wishlist.style.display = "grid";
  } else {
    // 로그인 안 된 상태
    emptyMsg.style.display = "block";
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
      const loadedItems = result.rows || result; // rows 안에 있거나 그냥 배열일 수도 있음
      const wishlistSection = document.getElementById("wishlistSection");

      wishlistSection.innerHTML = ""; // 기존 카드 비우기

      loadedItems.forEach((item) => {
        const card = document.createElement("div");
        card.className = "product-card";

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

      // 하트 버튼 이벤트 재등록
      const hearts = document.querySelectorAll(".heart");
      hearts.forEach((heart) => {
        heart.addEventListener("click", () => {
          heart.classList.toggle("active");
          heart.textContent = heart.classList.contains("active") ? "❤️" : "♡";
        });
      });
    } else {
      console.error(result.message);
    }
  } catch (err) {
    console.error("Wishlist 불러오기 중 에러:", err);
  }
}

window.onload = loadWishList();
