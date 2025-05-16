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
