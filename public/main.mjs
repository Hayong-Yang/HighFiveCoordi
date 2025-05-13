// 회원가입 창으로 이동
document.getElementById("signUp").addEventListener("click", () => {
  window.location.href = "/auth/signUp";
});

// 메인 > 로그인 이동
document.getElementById("logIn").addEventListener("click", () => {
  window.location.href = "/auth/logIn";
});

// 메인 > 위시리스트 이동
document.getElementById("Wishlist").addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/auth/Wishlist";
});

document.getElementById("logOut").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("token");
  alert("로그아웃 되었습니다.");
  window.location.href = "/"; // 서버에 요청해서 메인 페이지로 리디렉션
});
