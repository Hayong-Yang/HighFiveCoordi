import { db } from "../db/database.mjs";
import { config } from "../config.mjs";
import bcrypt from "bcrypt";

//now.getHours() → 정각으로 만든 현재 시각에서 시(hour) 만 추출 (0~23)
// .toString() → 숫자를 문자열로 변환
// .padStart(2, "0") → 한 자리 숫자일 경우 앞에 0을 붙여 두 자리로 만듦
// + "00" → 시각 끝에 "00"을 붙여 "HH00" 형식으로 만듦
export function getTargetForecastTime() {
  const now = new Date();
  now.setMinutes(0, 0, 0); //현재 시각을 "정각(00분)"으로 맞추기 위해 사용.
  return now.getHours().toString().padStart(2, "0") + "00";
}
