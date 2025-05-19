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
    const rgb = colorThief.getColor(preview);
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
    const [hue, saturation, lightness] = hsl;
    const color = document.getElementById("color").value;
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
