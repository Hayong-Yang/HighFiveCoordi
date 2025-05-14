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

  // 하트 클릭 이벤트
  const hearts = document.querySelectorAll(".heart");
  hearts.forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("active");
      heart.textContent = heart.classList.contains("active") ? "❤️" : "♡";
    });
  });
});
