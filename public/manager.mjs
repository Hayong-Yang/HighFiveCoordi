function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function getColorDistance(rgb1, rgb2) {
    return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
    );
}

function getNearestColorName(rgb) {
    const namedColors = [
        { name: "black", rgb: [0, 0, 0] },
        { name: "white", rgb: [255, 255, 255] },
        { name: "red", rgb: [255, 0, 0] },
        { name: "green", rgb: [0, 128, 0] },
        { name: "blue", rgb: [0, 0, 255] },
        { name: "yellow", rgb: [255, 255, 0] },
        { name: "purple", rgb: [128, 0, 128] },
        { name: "gray", rgb: [128, 128, 128] },
        { name: "orange", rgb: [255, 165, 0] },
        { name: "pink", rgb: [255, 192, 203] },
        { name: "brown", rgb: [139, 69, 19] },
        { name: "navy", rgb: [0, 0, 128] },
        { name: "teal", rgb: [0, 128, 128] }
    ];

    let closest = namedColors[0];
    let minDist = getColorDistance(rgb, closest.rgb);

    for (const color of namedColors) {
        const dist = getColorDistance(rgb, color.rgb);
        if (dist < minDist) {
            closest = color;
            minDist = dist;
        }
    }
    return closest.name;
}

// DOM 요소
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");
const colorNameSpan = document.getElementById("colorName");
const token = localStorage.getItem("token");

let hsl = [0, 0, 0];
let nearestColor = "";

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => preview.src = e.target.result;
    reader.readAsDataURL(file);
});

preview.addEventListener("load", () => {
    const colorThief = new ColorThief();
    const rgb = colorThief.getColor(preview); // [r, g, b]
    hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);

    const hexColor = rgbToHex(rgb[0], rgb[1], rgb[2]);
    document.getElementById("color").value = hexColor;  // 🔥 자동 반영 핵심

    result.innerText = `대표 색상 (RGB): ${rgb.join(", ")}\nHSL: (${hsl[0]}, ${hsl[1]}%)`;
});


document.getElementById("submitBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const price = parseInt(document.getElementById("price").value);
    const description = document.getElementById("description").value;
    const temp_level = parseInt(document.getElementById("level").value);
    const url = preview.src;

    const [hue, saturation, lightness] = hsl;

    const data = {
        name,
        category,
        price,
        description,
        temp_level,
        hue,
        saturation,
        lightness,
        color
    };

    try {
        const res = await fetch("/products/createProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        alert("상품 등록 완료! ID: " + result.id);
    } catch (err) {
        console.error("상품 등록 실패:", err);
        alert("상품 등록 실패!");
    }
});
// 1. CSS 색상 이름 목록 (기본 색상만 예시, 필요시 확장 가능)
const cssColors = {
    black: [0, 0, 0],
    white: [255, 255, 255],
    red: [255, 0, 0],
    green: [0, 128, 0],
    blue: [0, 0, 255],
    navy: [0, 0, 128],
    gray: [128, 128, 128],
    silver: [192, 192, 192],
    maroon: [128, 0, 0],
    olive: [128, 128, 0],
    teal: [0, 128, 128],
    purple: [128, 0, 128],
    orange: [255, 165, 0],
    pink: [255, 192, 203],
    brown: [165, 42, 42],
    gold: [255, 215, 0],
    beige: [245, 245, 220],
    khaki: [240, 230, 140],
    indigo: [75, 0, 130],
    turquoise: [64, 224, 208],
    slategray: [112, 128, 144],
};

// 2. RGB 거리 계산 함수
function getColorDistance(rgb1, rgb2) {
    return Math.sqrt(
        (rgb1[0] - rgb2[0]) ** 2 +
        (rgb1[1] - rgb2[1]) ** 2 +
        (rgb1[2] - rgb2[2]) ** 2
    );
}

// 3. 가장 가까운 색상 이름 반환 함수
function getClosestColorName(rgb) {
    let minDistance = Infinity;
    let closestColor = "";
    for (const [name, cssRgb] of Object.entries(cssColors)) {
        const distance = getColorDistance(rgb, cssRgb);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = name;
        }
    }
    return closestColor;
}
let colorName = "";

