function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
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
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");

let hsl = [0, 0, 0];
let colorName = "Unknown";

let isDragging = false;
let startX, startY, endX, endY, img;

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
}

canvas.addEventListener("mousedown", (e) => {
    const pos = getMousePosition(e);
    startX = pos.x;
    startY = pos.y;
    isDragging = true;
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const pos = getMousePosition(e);
    endX = pos.x;
    endY = pos.y;

    ctx.drawImage(img, 0, 0);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    const sx = Math.min(startX, endX);
    const sy = Math.min(startY, endY);
    const sw = Math.abs(endX - startX);
    const sh = Math.abs(endY - startY);

    if (sw === 0 || sh === 0) return;

    const pixels = ctx.getImageData(sx, sy, sw, sh).data;
    let r = 0,
        g = 0,
        b = 0,
        count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    hsl = rgbToHsl(r, g, b);
    colorName = getColorNameByHSL(hsl[0], hsl[1], hsl[2]);

    result.innerText = `드래그 영역 평균 색상 (RGB): ${r}, ${g}, ${b}\nHSL: (${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)\n컬러 이름: ${colorName}`;
});

document.getElementById("submitBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const price = parseInt(document.getElementById("price").value);
    const description = document.getElementById("description").value;
    const temp_level = parseInt(document.getElementById("level").value);
    const url = document.getElementById("url").value;
    const file = imageInput.files[0];
    const filename = file ? file.name : "default.png";
    const image_url = `http://localhost:8080/product_images/${filename}`;

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
        color: colorName,
        image_url,
        url,
    };

    const token = localStorage.getItem("token");
    try {
        const res = await fetch("/product/createProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (res.status !== 201) throw new Error("서버 응답 실패");
        const result = await res.json();
        alert("상품 등록 완료! ID: " + result.id);
        window.location.href = "/manager.html";
    } catch (err) {
        console.error("상품 등록 실패:", err);
        alert("상품 등록 실패!");
    }
});
