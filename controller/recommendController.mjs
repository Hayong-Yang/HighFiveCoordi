import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
import { fileURLToPath } from "url";
import path from "path";
import * as recommendRepository from "../data/recommend.mjs";
import * as colorHarmony from "../data/colorHarmony.mjs";

const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const jwtExpiresInDays = config.jwt.expiresInSec;
const weatherApiServiceKey = config.weatherAPI.servicekey;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// async function getWeatherBasedRecommendations(level) {
//   const categories = ["top", "pants", "outer", "shoes", "etc"];
//   const results = {};

// 날씨 조회하면 옷 추천화면을 띄우는 기능
export async function recommendClothes(request, response, next) {
    try {
        const serviceKey = weatherApiServiceKey;
        const { nx, ny, baseDate, baseTime } = request.body;
        const url =
            `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?` +
            `serviceKey=${encodeURIComponent(serviceKey)}` +
            `&base_date=${baseDate}&base_time=${baseTime}` +
            `&nx=${nx}&ny=${ny}&numOfRows=10&dataType=JSON`;

    const res = await fetch(url);
    const data = await res.json();
    // console.log("data", data);
    const items = data.response.body.items.item;
    console.log("items", items);
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
        const feltTemperature = recommendRepository.calculateWindChill(
            realTemperature,
            windSpeed
        );
        const level = recommendRepository.getTempLevel(feltTemperature);
        // 선택없다면  pickedColor= 0 으로 우선 설정
        const pickedColor = 0;

        const recommendedResult = await colorHarmony.getRecommendations(
            pickedColor,
            level
        );
        // console.log("백에서 보내는 결과: ", recommendedResult);
        return response.status(200).json({
            recommendedResult,
            temperature: parseFloat(realTemperature),
            windSpeed: parseFloat(windSpeed),
            rainPercent: parseFloat(rainPercent),
            feltTemperature: feltTemperature,
            level: level,
        });
    } catch (err) {
        console.error(err);
        response
            .status(500)
            .json({ error: "날씨 데이터를 불러오는 중 오류 발생" });
    }
}

// 다시 추천 버튼 누르면 날씨 기반으로 옷 다시 추천
// recommendAgain
export async function recommendAgain(request, response, next) {
  try {
    const { level } = request.body;
    const pickedColor = 0;

    const recommendedResult = await colorHarmony.getRecommendations(
      pickedColor,
      level
    );
    return response.status(200).json({
      recommendedResult,
    });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "날씨 데이터를 불러오는 중 오류 발생" });
  }
}

// 사용자가 색상적용하기 누르면 옷 추천화면을 새롭게 띄우는 기능
export async function reloadClothes(request, response, next) {
    try {
        const { topColor, level } = request.body;
        // 날씨 level 전역변수에서 받아오기.
        // console.log("상의색상:", topColor, "하의 색상:", bottomColor);
        // console.log("받아온 체감온도 레벨", level);

        const recommendedResult = await colorHarmony.getRecommendations(
            topColor,
            level
        );
        return response.status(200).json({
            recommendedResult,
        });
    } catch (err) {
        console.error(err);
        response
            .status(500)
            .json({ error: "날씨 데이터를 불러오는 중 오류 발생" });
    }
}