// ========================
// 히스토리 상태 변수
// ========================
let currentIndex =
  parseInt(localStorage.getItem("savedRecommendationsIndex")) || 0;

// ========================
// 저장 함수
// ========================
function saveRecommendations(dataArray) {
  let latestIndex =
    parseInt(localStorage.getItem("savedRecommendationsIndex")) || 0;
  latestIndex += 1;

  localStorage.setItem(
    "savedRecommendations" + latestIndex,
    JSON.stringify(dataArray)
  );
  localStorage.setItem("savedRecommendationsIndex", latestIndex);
  currentIndex = latestIndex; // 최신 위치로 이동

  // 5개만 유지
  if (latestIndex > 5) {
    const deleteIndex = latestIndex - 5;
    localStorage.removeItem("savedRecommendations" + deleteIndex);
  }
}

// ========================
// 이미지 렌더링 함수
// ========================
function renderToHTML(dataArray) {
  const categories = document.querySelectorAll(".category");

  categories.forEach((categoryDiv) => {
    categoryDiv.innerHTML = "";
  });

  dataArray.forEach((item) => {
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt;
    image.classList.add("product-image");
    image.dataset.category = item.category;

    categories.forEach((categoryDiv) => {
      if (categoryDiv.classList.contains(item.category)) {
        categoryDiv.appendChild(image);
      }
    });
  });
}

// ========================
// 저장 후 렌더링 함수
// ========================
function renderAndSave(recommendationArray) {
  // 화면에 표시
  renderToHTML(recommendationArray);

  // 저장할 형식으로 변환
  const savedRecommendations = recommendationArray.map((item) => ({
    src: item.image_url,
    alt: `추천 상품 ${item.idx}`,
    category: item.category,
  }));

  // 저장
  saveRecommendations(savedRecommendations);
}

// ========================
// 로딩 함수
// ========================
function loadRecommendations(index) {
  const dataString = localStorage.getItem("savedRecommendations" + index);
  if (dataString) {
    const dataArray = JSON.parse(dataString);
    renderToHTML(dataArray);
    currentIndex = index;
  }
}

// ========================
// 좌우 버튼 이벤트
// ========================
document.querySelector(".left-btn").addEventListener("click", () => {
  if (currentIndex > 1) {
    loadRecommendations(currentIndex - 1);
  }
});

document.querySelector(".right-btn").addEventListener("click", () => {
  const latestIndex =
    parseInt(localStorage.getItem("savedRecommendationsIndex")) || 0;
  if (currentIndex < latestIndex) {
    loadRecommendations(currentIndex + 1);
  }
});

// ========================
// 새로고침 시 복원
// ========================
window.addEventListener("DOMContentLoaded", () => {
  if (currentIndex > 0) {
    loadRecommendations(currentIndex);
  }
});