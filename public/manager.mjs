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

function getClosestColorName([r, g, b]) {
    const colorMap = [
        { name: "Red", rgb: [255, 0, 0] },
        { name: "Green", rgb: [0, 255, 0] },
        { name: "Blue", rgb: [0, 0, 255] },
        { name: "Yellow", rgb: [255, 255, 0] },
        { name: "Cyan", rgb: [0, 255, 255] },
        { name: "Magenta", rgb: [255, 0, 255] },
        { name: "Black", rgb: [0, 0, 0] },
        { name: "White", rgb: [255, 255, 255] },
        { name: "Gray", rgb: [128, 128, 128] },
        { name: "Orange", rgb: [255, 165, 0] },
        { name: "Pink", rgb: [255, 192, 203] },
        { name: "Purple", rgb: [128, 0, 128] },
        { name: "Brown", rgb: [165, 42, 42] },
    ];

    let minDist = Infinity;
    let closest = "Unknown";

    for (const c of colorMap) {
        const [cr, cg, cb] = c.rgb;
        const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
        if (dist < minDist) {
            minDist = dist;
            closest = c.name;
        }
    }
    return closest;
}

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

let hsl = [0, 0, 0];
let colorName = "Unknown";

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

preview.addEventListener("load", () => {
    const colorThief = new ColorThief();
    const rgb = colorThief.getColor(preview);
    hsl = rgbToHsl(...rgb);
    colorName = getClosestColorName(rgb);

    result.innerText = `대표 색상 (RGB): ${rgb.join(", ")}\nHSL: (${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)\n컬러 이름: ${colorName}`;
});

document.getElementById("submitBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const price = parseInt(document.getElementById("price").value);
    const description = document.getElementById("description").value;
    const temp_level = parseInt(document.getElementById("level").value);
    const url = document.getElementById("url").value;
    const [hue, saturation, lightness] = hsl;

    const data = {
        name,
        category,
        price,
        description,
        temp_level,
        url,              // 사용자 제공 base64 이미지 or 링크
        hue,
        saturation,
        lightness,
        color: colorName,
    };
    const token = localStorage.getItem("token");
    try {
        const res = await fetch("/product/createProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (res.status !== 201) throw new Error("서버 응답 실패");

        const result = await res.json();
        alert("상품 등록 완료! ID: " + result.id);
    } catch (err) {
        console.error("상품 등록 실패:", err);
        alert("상품 등록 실패!");
    }
});
