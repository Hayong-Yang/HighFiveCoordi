import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
import { fileURLToPath } from "url";
import path from "path";
import * as recommendRepository from "../data/recommend.mjs";
import { calculateWindChill } from "../util/weatherUtils.mjs";

const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const jwtExpiresInDays = config.jwt.expiresInSec;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function recommendClothes(request, response, next) {
  try {
    const serviceKey = "API_KEY";
    const { nx, ny, baseDate, baseTime } = request.body;

    const url =
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?` +
      `serviceKey=${encodeURIComponent(serviceKey)}` +
      `&base_date=${baseDate}&base_time=${baseTime}` +
      `&nx=${nx}&ny=${ny}&numOfRows=10&dataType=JSON`;

    const res = await fetch(url);
    const data = await res.json();

    const items = data.response.body.items.item;

    const tmpItem = items.find(
      (item) => item.category === "TMP" && item.baseTime === baseTime
    );
    const windItem = items.find(
      (item) => item.category === "WSD" && item.baseTime === baseTime
    );
    const rainPercentItem = items.find(
      (item) => item.category === "POP" && item.baseTime === baseTime
    );

    if (!tmpItem || !windItem || !rainPercentItem) {
      return response
        .status(404)
        .json({ error: "예보 데이터를 충분히 찾을 수 없습니다." });
    }

    const realTemperature = tmpItem.fcstValue;
    const windSpeed = windItem.fcstValue;
    const rainPercent = rainPercentItem.fcstValue;

    const feltTemperature = calculateWindChill(realTemperature, windSpeed);

    return response.status(200).json({
      temperature: parseFloat(realTemperature),
      windSpeed: parseFloat(windSpeed),
      rainPercent: parseFloat(rainPercent),
      feltTemperature: feltTemperature,
    });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "날씨 데이터를 불러오는 중 오류 발생" });
  }
}
