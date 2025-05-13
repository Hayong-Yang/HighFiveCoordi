// 회원가입 창으로 이동
document.getElementById("signUp").addEventListener("click", () => {
  window.location.href = "/auth/signUp";
});

// 메인 > 로그인 이동
document.getElementById("login").addEventListener("click", () => {
  window.location.href = "/auth/logIn";
});
