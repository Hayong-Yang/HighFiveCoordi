export async function findId() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const result = document.getElementById("result");

    try {
        const res = await fetch("http://localhost:8080/api/findId", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
        });

        const data = await res.json();
        console.log("✅ 서버 응답:", data); // ← 여기가 찍히는지 봐야 함

        if (data.success) {
            result.textContent = `✅ 아이디는 "${data.userId}"입니다.`;
        } else {
            result.textContent = `❌ ${data.message}`;
        }
    } catch (err) {
        console.error("❌ 오류:", err);
        result.textContent = "⚠️ 오류 발생";
    }
}

// ✅ 반드시 추가! (이게 없으면 HTML에서 호출 못 함)
window.findId = findId;
