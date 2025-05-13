document.getElementById("logIn").addEventListener("click", (event) => {
    event.preventDefault(); // 기본 동작 방지
    window.location.href = "/auth/logIn";
});

document.getElementById("Wishlist").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "/auth/Wishlist";
});
