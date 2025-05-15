// 기상청 API 키
const serviceKey =
  "NUqg9iZg+R57kpL1qrF1tst+AG3VXF5LAecO+CNKVMPmo34670TTUOan29Sq5DgB6/UXYTHmJOsUHoUp0CuKQw==";

// 위도/경도를 '기상청 좌표계'로 변환하는 함수
function dfs_xy_conv(lat, lon) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;
  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;
  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  const ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  const r = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  const x = Math.floor(r * Math.sin(theta) + XO + 0.5);
  const y = Math.floor(ro - r * Math.cos(theta) + YO + 0.5);
  return { nx: x, ny: y };
}

// 위치 정보 수신 시 좌표 변환 및 화면에 반영
function setLocation(position) {
  const { latitude, longitude } = position.coords; // 위치 객체에서 위도와 경도 추출
  const grid = dfs_xy_conv(latitude, longitude); // 위경도를 기상청 격자 좌표(nx, ny)로 변환하는 함수 호출
  document.getElementById("nx").value = grid.nx; // 변환된 nx 값을 숨겨진 입력 필드에 설정
  document.getElementById("ny").value = grid.ny; // 변환된 ny 값을 숨겨진 입력 필드에 설정
}

// 위치 정보 요청 실패 시 오류 처리
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("위치 정보 사용이 거부되었습니다.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("위치 정보를 사용할 수 없습니다.");
      break;
    case error.TIMEOUT:
      alert("위치 정보를 가져오는 데 시간이 초과되었습니다.");
      break;
    default:
      alert("알 수 없는 오류가 발생했습니다.");
  }
}

// 위치 정보 요청 및 설정 - Geolocation API 사용 | getCurrentPosition : 현재 위치를 1회 가져올 때 사용
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocation, showError); // watchPosition -- setLocation showError 따로 구현해서 처리
  } else {
    alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
  }
}

document.getElementById("doFetchDataButton").addEventListener(
  "click",

  // 날씨 데이터 조회 및 화면 출력 함수
  function fetchData() {
    // 입력 필드에서 사용자가 선택하거나 자동 설정된 값을 가져옴
    const baseDate = document
      .getElementById("base_date")
      .value.replace(/-/g, ""); // 'YYYY-MM-DD' 형식을 'YYYYMMDD'로 변환
    const baseTime = document.getElementById("base_time").value; // 기준 시간 (예: '0500', '0800' 등)
    const nx = document.getElementById("nx").value; // 격자 X좌표 (위도 기반)
    const ny = document.getElementById("ny").value; // 격자 Y좌표 (경도 기반)

    // 입력값 유효성 확인
    if (!baseDate || !nx || !ny) {
      // 인풋 중 값이 한개라도 비면
      alert("모든 값을 입력해주세요.");
      return;
    }

    // 기상청 API로 URL 생성
    const url =
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?` +
      `serviceKey=${encodeURIComponent(serviceKey)}` +
      `&base_date=${baseDate}&base_time=${baseTime}` +
      `&nx=${nx}&ny=${ny}&numOfRows=10&dataType=JSON`;

    // API 요청
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (
          !data.response ||
          !data.response.body ||
          !data.response.body.items
        ) {
          document.getElementById("errorMessage").textContent =
            "데이터가 없습니다.";
          document.getElementById("errorMessage").style.display = "block";
          document.getElementById("responseData").innerHTML = "";
          document.getElementById("result").style.display = "none";
          return;
        }

        const items = data.response.body.items.item;
        const filtered = items.filter((item) => item.fcstDate === baseDate);
        const formatted = formatWeatherData(filtered, baseDate, baseTime);
        document.getElementById("responseData").innerHTML = formatted;
        document.getElementById("result").style.display = "block";
        document.getElementById("errorMessage").textContent = "";
        document.getElementById("errorMessage").style.display = "none";
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
        document.getElementById(
          "errorMessage"
        ).textContent = `오류가 발생했습니다: ${
          error.message || "네트워크 또는 서버 문제"
        }`;
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("responseData").innerHTML = "";
        document.getElementById("result").style.display = "none";
      });
  }
);

const cityToGrid = {
  서울: { nx: 60, ny: 127 },
  부산: { nx: 98, ny: 76 },
  대구: { nx: 89, ny: 90 },
  인천: { nx: 55, ny: 124 },
  광주: { nx: 58, ny: 74 },
  대전: { nx: 67, ny: 100 },
  울산: { nx: 102, ny: 84 },
  // ... 필요시 추가
};

function setCityLocation() {
  const city = document.getElementById("base_city").value;
  const grid = cityToGrid[city];

  if (grid) {
    document.getElementById("nx").value = grid.nx;
    document.getElementById("ny").value = grid.ny;
  } else {
    document.getElementById("nx").value = "";
    document.getElementById("ny").value = "";
  }
}

function formatWeatherData(data) {
  const map = { PTY: "강수 형태", POP: "강수확률(%)", PCP: "강수량(mm)" };
  const ptyMap = { 0: "없음", 1: "비", 2: "비/눈", 3: "눈", 4: "소나기" };

  /* 시간별로 묶기 */
  const grouped = {};
  data.forEach((i) => (grouped[i.fcstTime] ||= []).push(i));
  const sortedTimes = Object.keys(grouped).sort();

  let html = "";
  sortedTimes.forEach((time) => {
    const items = grouped[time];

    /* 클래스(이모지) 계산 */
    const sky = items.find((i) => i.category === "SKY")?.fcstValue;
    const pty = items.find((i) => i.category === "PTY")?.fcstValue;
    const skyCls = sky ? `sky-${sky}` : "";
    const ptyCls = pty && pty !== "0" ? `pty-${pty}` : "";

    /* 기온/시간 값 */
    const tmp = items.find((i) => i.category === "TMP")?.fcstValue ?? "N/A";
    const hhmm = `${time.slice(0, 2)}:${time.slice(2)}`;

    /* 컬러 박스(시간·PTY·POP·PCP) 만들기 */
    const getVal = (cat, conv) =>
      conv
        ? conv(items.find((i) => i.category === cat)?.fcstValue)
        : items.find((i) => i.category === cat)?.fcstValue ?? "-";

    const boxes = `
      <div class="info-grid">
        <div class="info-box time">시간 : ${hhmm}</div>
        <div class="info-box pty">강수형태 : ${getVal(
          "PTY",
          (v) => ptyMap[v] || v
        )}</div>
        <div class="info-box pop">강수확률 : ${getVal("POP")}%</div>
        <div class="info-box pcp">강수량 : ${getVal("PCP")}</div>
      </div>`;

    html += `<li class="data-list ${skyCls} ${ptyCls}">
               <h3>${tmp}°</h3><span class="sky-info"></span>
               ${boxes}
             </li>`;
  });
  return html;
}

// 현재 시각 기준으로 자동 날짜/시간 설정
function setDefaultDateTime() {
  const now = new Date(); // 현재 시각 객체 생성
  now.setMinutes(now.getMinutes() - 30); // API 기준 시간보다 30분 이전으로 보정 (예보 생성 시간 기준)

  const year = now.getFullYear(); // 연도 추출
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 월 추출 (0부터 시작하므로 +1), 두 자리로 패딩
  const date = String(now.getDate()).padStart(2, "0"); // 일 추출, 두 자리로 패딩
  const baseDate = `${year}${month}${date}`; // yyyyMMdd 형식으로 조합

  const hour = now.getHours(); // 시(hour) 추출
  const availableTimes = [2, 5, 8, 11, 14, 17, 20, 23]; // 기상청 예보 조회 가능 시간 목록
  let closestTime = availableTimes[0]; // 기본값: 가장 첫 시간으로 초기화

  // 현재 시간과 가장 가까운 예보 시간(baseTime)을 선택
  for (let i = 1; i < availableTimes.length; i++) {
    // 현재 시간(hour)과 각 예보 시간의 차이를 비교
    if (Math.abs(hour - availableTimes[i]) < Math.abs(hour - closestTime)) {
      closestTime = availableTimes[i]; // 더 가까운 예보 시간을 closestTime으로 설정
    }
    // 기상청 동네예보 API는 정해진 특정 시간(예: 02, 05, 08, 11시 등) 기준으로 데이터가 제공되기 때문에,
    // 사용자의 현재 시각과 가장 가까운 예보 시간을 자동으로 계산해서 그에 맞는 baseTime을 지정
  }

  const baseTime = String(closestTime).padStart(2, "0") + "00"; // 두 자리 시 + "00" 형식으로 baseTime 구성 (ex. "1400")

  document.getElementById("base_date").value = baseDate; // 날짜 입력 필드에 자동 설정

  const timeSelect = document.getElementById("base_time"); // 시간 select 요소 가져오기
  if (timeSelect) {
    timeSelect.value = baseTime; // select 요소에서 가까운 시간으로 선택 설정
  }
}

window.onload = function () {
  getLocation(); // 위치 정보
  setDefaultDateTime(); // 날짜/시간
};

// 엔터 키 입력 시 자동으로 조회 실행
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    fetchData();
  }
});
