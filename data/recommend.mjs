import { db } from "../db/database.mjs";
import { config } from "../config.mjs";
import bcrypt from "bcrypt";

//now.getHours() → 정각으로 만든 현재 시각에서 시(hour) 만 추출 (0~23)
// .toString() → 숫자를 문자열로 변환
// .padStart(2, "0") → 한 자리 숫자일 경우 앞에 0을 붙여 두 자리로 만듦
// + "00" → 시각 끝에 "00"을 붙여 "HH00" 형식으로 만듦
// export function getTargetForecastTime() {
//   const now = new Date();
//   now.setMinutes(0, 0, 0); //현재 시각을 "정각(00분)"으로 맞추기 위해 사용.
//   return now.getHours().toString().padStart(2, "0") + "00";
// }

// RGB(hex형식)을 hue로 바꾸는 함수
export function rgbToHue(rgb) {
  // 16진수 문자열을 10진수로 변환 (예: 'e8' → 232)
  // 0255 범위 값을 01 범위로 정규화
  const r = parseInt(rgb.substr(1, 2), 16) / 255;
  const g = parseInt(rgb.substr(3, 2), 16) / 255;
  const b = parseInt(rgb.substr(5, 2), 16) / 255;
  // max와 min을 찾는 이유: 색조(Hue)를 계산할 때 RGB 중 어떤 성분이 강한지 알아야 함.
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h;
  // 색상 성분이 모두 같으면 회색 → Hue는 의미 없으므로 0
  if (max === min) h = 0;
  //빨강이 가장 크면 Hue는 0 ~ 60도, 또는 300도 이상
  else if (max === r) h = (60 * ((g - b) / (max - min))) % 360;
  // 초록이 가장 크면 Hue는 120 ~ 180도 범위
  else if (max === g) h = 60 * ((b - r) / (max - min)) + 120;
  //파랑이 가장 크면 Hue는 240 ~ 300도 범위
  else h = 60 * ((r - g) / (max - min)) + 240;
  return (h + 360) % 360;
}


export function calculateWindChill(temp, windSpeed) {
  const T = parseFloat(temp);
  const V = parseFloat(windSpeed);

  if (T > 10 || V <= 4.8) return T;

  const windChill =
    13.12 +
    0.6215 * T -
    11.37 * Math.pow(V, 0.16) +
    0.3965 * T * Math.pow(V, 0.16);
  return Math.round(windChill * 10) / 10;
}

// 레벨 만드는 함수
export function getTempLevel(windChill){
    if (windChill >= 23) return 3;      // 더운 날씨
  if (windChill >= 10) return 2;      // 보통 날씨
  return 1;  
}
// 옷 타입 랜덤 설정
export function getRecommendationType(topHue, bottomHue) {
  if (topHue !== undefined && bottomHue !== undefined) {
    return 'custom';
  }
  // 정해지지 않으면 33%,33%,34%로 추천
  const rand = Math.random();
  if (rand < 0.33) return 'similar';
  else if (rand < 0.66) return 'opposite';
  else return 'triad';
}
// getRecommendationType을 토대로 카테고리에 대한 색상 옷 리스트 생성
// 타입 공식은 손봐야함
export function getHueTargets(type, topHue, bottomHue) {
  if (type === 'similar') {
    return [
      { category: 'top', hue: topHue },
      { category: 'pants', hue: bottomHue },
      { category: 'outer', hue: topHue },
      { category: 'shoes', hue: bottomHue },
      { category: 'etc', hue: (topHue + 15) % 360 }
    ];
  } else if (type === 'opposite') {
    return [
      { category: 'top', hue: (bottomHue + 180) % 360 },
      { category: 'pants', hue: (topHue + 180) % 360 },
      { category: 'outer', hue: (topHue + 150) % 360 },
      { category: 'shoes', hue: (bottomHue + 150) % 360 },
      { category: 'etc', hue: (topHue + 90) % 360 }
    ];
  } else if (type === 'triad') {
    return [
      { category: 'top', hue: topHue },
      { category: 'pants', hue: (topHue + 120) % 360 },
      { category: 'outer', hue: (topHue + 240) % 360 },
      { category: 'shoes', hue: (bottomHue + 120) % 360 },
      { category: 'etc', hue: (bottomHue + 240) % 360 }
    ];
  } else if (type === 'custom') {
    let delta = Math.abs(topHue - bottomHue);
    if (delta > 180) delta = 360 - delta;

    if (delta < 30) {
      return [
        { category: 'top', hue: topHue },
        { category: 'pants', hue: bottomHue },
        { category: 'outer', hue: (topHue + bottomHue) / 2 },
        { category: 'shoes', hue: bottomHue },
        { category: 'etc', hue: topHue }
      ];
    } else if (delta < 90) {
      return [
        { category: 'top', hue: topHue },
        { category: 'pants', hue: bottomHue },
        { category: 'outer', hue: (topHue + 30) % 360 },
        { category: 'shoes', hue: (bottomHue + 60) % 360 },
        { category: 'etc', hue: (bottomHue + 90) % 360 }
      ];
    } else {
      return [
        { category: 'top', hue: (bottomHue + 180) % 360 },
        { category: 'pants', hue: (topHue + 180) % 360 },
        { category: 'outer', hue: (topHue + 90) % 360 },
        { category: 'shoes', hue: (bottomHue + 90) % 360 },
        { category: 'etc', hue: (topHue + 45) % 360 }
      ];
    }
  }
  // 만약 해당 안 되면 빈 배열
  return [];
}
export async function getClosefromDB(hueTargets,level) {
const results = [];
  //getHueTargets 에서 만든 리스트를 hueTargets이 하나씩 가져옴
  for (const target of hueTargets) {
    const [rows] = await pool.query(
      `SELECT id, image_url FROM products 
       WHERE category = ? AND level = ? AND ABS(hue - ?) < 20 
       ORDER BY RAND() LIMIT 1`,
      [target.category, level, target.hue]
    );
    // 찾은 첫번째 옷 배열에 저장
    if (rows.length > 0) results.push(rows[0]);
  }

// 어떤 타입이고 무슨 옷으 추천했는지 반환
  return { type, recommendations: results };
}
//최종적 옷추천 함수
export async function getRecommendations({ topHue, bottomHue, level }) {
  const type = recommendRepository.getRecommendationType(topHue, bottomHue);
  const hueTargets = recommendRepository.getHueTargets(type, topHue ?? 0, bottomHue ?? 0);
  const result = await recommendRepository.getClosefromDB(hueTargets, level);
  return result;
}