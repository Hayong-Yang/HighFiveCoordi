import { db } from "../db/database.mjs";
import { config } from "../config.mjs";
import bcrypt from "bcrypt";
import { rgbToHSL } from "./recommend.mjs";

// 선택된 색상을 이용해서 baseColor구하기. 선택안됐다면 랜덤 baseColor
export function getBaseColor(pickedColor) {
    // 선택된 색상을 hue로 변환
    const hsl = rgbToHSL(pickedColor);
    const pickedHue = hsl.h;

    // pickedHue 기준 ±15 범위에서 랜덤 baseColor 생성
    const min = (pickedHue - 15 + 360) % 360;
    const max = (pickedHue + 15) % 360;
    const diff = (max - min + 360) % 360;
    const rand = Math.floor(Math.random() * (diff + 1));
    return (min + rand) % 360;
}

//*********************************************
//유사색상 함수: baseColor 기준으로 랜덤hue를 만들고, 각 부위에 대입.
export function similarHarmony(baseColor) {
    const categories = ["top", "pants", "outer", "shoes", "etc"];

    // 랜덤 유사색 Hue 생성 함수
    function getRandomSimilarHue(hue) {
        // 방법1 : 유사하지 않았음.
        // const h1 = (hue + 30) % 360;
        // const h2 = (hue - 30 + 360) % 360;
        // const diff = (h2 - h1 + 360) % 360;
        // const rand = Math.floor(Math.random() * (diff + 1));
        // return (h1 + rand) % 360;

        // 방법 2 : 너무 유사
        // const offset = Math.floor(Math.random() * 31) - 15; // -15 ~ +15
        // return (hue + offset + 360) % 360;

        // 방법 3
        const offset = Math.floor(Math.random() * 21) + 10; // 10~30도 범위
        const direction = Math.random() < 0.5 ? -1 : 1;
        return (hue + direction * offset + 360) % 360;
    }

    // 각 카테고리에 랜덤 hue 부여
    return categories.map((category) => ({
        category,
        hue: getRandomSimilarHue(baseColor),
    }));
}

//*********************************************
//보색 함수: baseColor 기준으로 반대hue를 만들고, 각 부위에 대입.
export function complementaryHarmony(baseColor) {
    const categories = ["top", "pants", "outer", "shoes", "etc"];
    const complementaryColor = (baseColor + 180) % 360;

    // ±15도 내 랜덤 hue 생성 함수
    function getRandomHueAround(hue) {
        const min = (hue - 15 + 360) % 360;
        const max = (hue + 15) % 360;
        const diff = (max - min + 360) % 360;
        const rand = Math.floor(Math.random() * (diff + 1));
        return (min + rand) % 360;
    }

    // baseColor 기반 hue 2~3개, 보색 기반 hue 2~3개로 구성
    const baseHueCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const compHueCount = 5 - baseHueCount;

    const baseHues = Array.from({ length: baseHueCount }, () =>
        getRandomHueAround(baseColor)
    );
    const compHues = Array.from({ length: compHueCount }, () =>
        getRandomHueAround(complementaryColor)
    );

    const mixedHues = [...baseHues, ...compHues].slice(0, 5);

    //순서대로로 top, pants, ...에 랜덤 hue
    return categories.map((category, idx) => ({
        category,
        hue: mixedHues[idx],
    }));
}

//*********************************************
//삼각조화 함수: baseColor 기준으로 삼각hue를 만들고, 각 부위에 대입.
export function triadicHarmony(baseColor) {
    const categories = ["top", "pants", "outer", "shoes", "etc"];

    // Triadic 색상들 (기본색 + 두 보조색)
    const hues = [baseColor, (baseColor + 120) % 360, (baseColor + 240) % 360];

    // 각 Hue를 기준으로 ±15 범위 내 랜덤 hue 생성 함수
    function getRandomHueAround(hue) {
        const min = (hue - 15 + 360) % 360;
        const max = (hue + 15) % 360;
        const diff = (max - min + 360) % 360;
        const rand = Math.floor(Math.random() * (diff + 1));
        return (min + rand) % 360;
    }

    // 세 가지 triadic 색상 기준으로 5개의 랜덤 hue 만들기
    const mixedHues = Array.from({ length: 5 }, () => {
        const selectedHue = hues[Math.floor(Math.random() * hues.length)];
        return getRandomHueAround(selectedHue);
    });

    //순서대로로 top, pants, ...에 랜덤 hue
    return categories.map((category, idx) => ({
        category,
        hue: mixedHues[idx],
    }));
}

////*********************************************
//*********************************************

export async function getClothesfromDB(hueTargets, level) {
    const results = [];

    for (const target of hueTargets) {
        const [rows] = await db.query(
            `SELECT idx, category, image_url, url FROM products 
       WHERE category = ? AND temp_level = ? AND LEAST(ABS(hue - ?), 360 - ABS(hue - ?)) < 20 
       ORDER BY RAND() LIMIT 1`,
            [target.category, level, target.hue, target.hue]
        );

        if (rows.length > 0) results.push(rows[0]);
    }

    // 어떤 타입이고 무슨 옷으 추천했는지 반환
    return { recommendations: results };
}

//*********************************************
//*********************************************
// 최종적 옷 추천 함수
export async function getRecommendations(pickedColor, level) {
    const baseColor = getBaseColor(pickedColor);

    // 추천 알고리즘 목록 중 랜덤 선택
    const recommendStrategies = [
        similarHarmony,
        complementaryHarmony,
        triadicHarmony,
    ];
    const randomStrategy =
        recommendStrategies[
            Math.floor(Math.random() * recommendStrategies.length)
        ];

    // 랜덤 전략 실행 → [{ category, hue }, ...]
    const hueTargets = randomStrategy(baseColor);

    console.log("베이스컬러", baseColor);
    console.log(randomStrategy);
    console.log("hueTargets:", hueTargets);
    //   hueTargets.forEach((t) =>
    //     console.log(`[${t.category}] hue=${t.hue} (${typeof t.hue})`)
    //   );

    const { recommendations } = await getClothesfromDB(hueTargets, level);
    return recommendations;
    //   return {
    //     recommendations: results,
    //     baseColor,
    //     strategy: randomStrategy.name,
    //   };
}
