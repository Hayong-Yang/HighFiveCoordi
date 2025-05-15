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
  window.location.href = "/wish";
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

// POST: main.html에서 날씨 API 설정값 보내고, 추천 옷을 결과로 받아오는 기능
document
  .getElementById("doFetchDataButton")
  .addEventListener("click", async function getRecommendedClothes() {
    const baseDate = document
      .getElementById("base_date")
      .value.replace(/-/g, ""); // 'YYYY-MM-DD' 형식을 'YYYYMMDD'로 변환
    const baseTime = document.getElementById("base_time").value; // 기준 시간 (예: '0500', '0800' 등)
    const nx = document.getElementById("nx").value; // 격자 X좌표 (위도 기반)
    const ny = document.getElementById("ny").value; // 격자 Y좌표 (경도 기반)

    const res = await fetch("/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nx: nx,
        ny: ny,
        baseDate: baseDate,
        baseTime: baseTime,
      }),
    });
    const result = await res.json();
    if (res.ok) {
      console.log(result);
    } else {
      console.log(result);
    }
  });

// 옷 색상 적용 기능
document
  .getElementById("apply-btn")
  .addEventListener("click", async function applyColors() {
    // 상의 색상
    const topColor = document.getElementById("topColorPicker").value;
    const topSvg = document.getElementById("top-svg");
    const topRects = topSvg.querySelectorAll("rect");

    topRects.forEach((rect) => {
      // 목 부분은 fill:none이므로 제외
      if (rect.getAttribute("fill") !== "none") {
        rect.setAttribute("fill", topColor);
      }
    });

    // 하의 색상
    const bottomColor = document.getElementById("bottomColorPicker").value;
    const bottomSvg = document.getElementById("bottom-svg");
    const bottomRects = bottomSvg.querySelectorAll("rect");

    bottomRects.forEach((rect) => {
      rect.setAttribute("fill", bottomColor);
    });

    // POST: 적용하기 버튼 누르면 사용자가 선택한 색상 rgb값을 바탕으로 옷 추천화면이 새로고침 되는 기능
    const topColorPicker = document.getElementById("topColorPicker").value;
    const bottomColorPicker =
      document.getElementById("bottomColorPicker").value;
    console.log("상의색상:", topColorPicker, "하의 색상:", bottomColorPicker);

    const res = await fetch("/recommend/reloadByColor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topColor: topColorPicker,
        bottomColor: bottomColorPicker,
      }),
    });
  });
