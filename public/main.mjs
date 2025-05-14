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

const token = localStorage.getItem("token");

// 버튼 요소들 가져오기
const signUpBtn = document.getElementById("signUp");
const logInBtn = document.getElementById("logIn");
const logOutBtn = document.getElementById("logOut");

// 로그인 상태에 따라 버튼 숨기기 / 보이기
if (token) {
  // 로그인 상태: 회원가입/로그인 숨기고 로그아웃만 보이게
  signUpBtn.style.display = "none";
  logInBtn.style.display = "none";
  logOutBtn.style.display = "inline";
} else {
  // 비로그인 상태: 로그아웃 숨기고 회원가입/로그인 보이게
  signUpBtn.style.display = "inline";
  logInBtn.style.display = "inline";
  logOutBtn.style.display = "none";
}
