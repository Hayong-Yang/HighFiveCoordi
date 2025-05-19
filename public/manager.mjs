function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
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

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");
const token = localStorage.getItem("token");
let hsl = [0, 0, 0]; // 전역 저장

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
});
// RGB to HEX 변환 함수
function rgbToHex(r, g, b) {
    return "#" + [r, g, b]
        .map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        })
        .join("");
}

preview.addEventListener("load", () => {
    const colorThief = new ColorThief();
    const rgb = colorThief.getColor(preview); // [r, g, b]
    hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    colorName = getClosestColorName(rgb); // 🔥 여기에 저장

    const [h, s, l] = hsl;
    document.getElementById("hsl").innerText = `(${h}, ${s}%, ${l}%)`;
});



document.getElementById("submitBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const price = parseInt(document.getElementById("price").value);
    const description = document.getElementById("description").value;
    const temp_level = parseInt(document.getElementById("level").value);
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
        color: colorName
    };

    try {
        const res = await fetch("/product/createProduct", {
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

