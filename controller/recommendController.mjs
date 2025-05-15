import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
import { fileURLToPath } from "url";
import path from "path";
import * as recommendRepository from "../data/recommend.mjs";

const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const jwtExpiresInDays = config.jwt.expiresInSec;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 날씨 조회하면 옷 추천화면을 띄우는 기능
export async function recommendClothes(request, response, next) {
  try {
    const serviceKey =
      "NUqg9iZg+R57kpL1qrF1tst+AG3VXF5LAecO+CNKVMPmo34670TTUOan29Sq5DgB6/UXYTHmJOsUHoUp0CuKQw==";
    const { nx, ny, baseDate, baseTime } = request.body;

    console.log(
      "nx:",
      nx,
      "ny:",
      ny,
      "baseDate:",
      baseDate,
      "baseTime",
      baseTime
    );

    const url =
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?` +
      `serviceKey=${encodeURIComponent(serviceKey)}` +
      `&base_date=${baseDate}&base_time=${baseTime}` +
      `&nx=${nx}&ny=${ny}&numOfRows=10&dataType=JSON`; // 여기에 실제 API URL 입력
    const res = await fetch(url);
    const data = await res.json();

    const items = data.response.body.items.item;
    // const targetTime = recommendRepository.getTargetForecastTime(); // 예: "0600"
    const tmpItem = items.find(
      (item) => item.category === "TMP" && item.baseTime === baseTime
    );
    const windItem = items.find(
      (item) => item.category === "WSD" && item.baseTime === baseTime
    );
    const rainPercentItem = items.find(
      (item) => item.category === "POP" && item.baseTime === baseTime
    );
    // console.log("items:", items);
    // console.log("tmpItem:", tmpItem);

    if (!tmpItem) {
      return response
        .status(404)
        .json({ error: "TMP 항목을 찾을 수 없습니다." });
    }

    const realTemperature = tmpItem.fcstValue; // 실제온도
    const WindSpeed = windItem.fcstValue; // 풍속
    const rainPercent = rainPercentItem.fcstValue; // 강수확률(%)

    console.log("실제온도", realTemperature);
    console.log("풍속", WindSpeed);
    console.log("강수확률(%)", rainPercent);

    // 체감온도 계산, 날씨 level 도출
    // 체감온도와 날씨 level을 클라이언트로 보낸 후 전역변수 설정하기!!!!!  -> 아래 reloadClothes 함수에서 날씨 level 받아오기!

    // 옷 추천 알고리즘 적용.
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "날씨 데이터를 불러오는 중 오류 발생" });
  }
}

// 사용자가 색상적용하기 누르면 옷 추천화면을 새롭게 띄우는 기능
export async function reloadClothes(request, response, next) {
  const { topColor, bottomColor } = request.body;
  // 날씨 level 전역변수에서 받아오기.
  console.log("상의색상:", topColor, "하의 색상:", bottomColor);
}
