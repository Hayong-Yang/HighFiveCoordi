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
