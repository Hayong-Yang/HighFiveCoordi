document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputId = document.getElementById("inputId").value;
    const inputPw = document.getElementById("inputPw").value;

    try {
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputId, inputPw }),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token); // ✅ 토큰 로컬스토리지에서 저장
            alert(`${data.inputId}님 로그인 성공!`);
            window.location.href = "/"; // 메인 페이지로 이동
        } else {
            alert(data.message || "로그인 실패");
        }
    } catch (error) {
        console.error("로그인 중 오류 발생:", error);
    }
});
/*
document.getElementById("logOut").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("token");
  alert("로그아웃 되었습니다.");
  window.location.href = "/"; // 서버에 요청해서 메인 페이지로 리디렉션
});*/

// 아이디찾기 화면 보여주기
document.getElementById("showFindId").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("findIdForm").style.display = "block";
});

// 아이디찾기 제출 처리
document
    .getElementById("findId")
    .addEventListener("submit", async function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        const response = await fetch("/auth/find-id", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email }),
        });

        const data = await response.json();
        const resultDiv = document.getElementById("resultMessage");

        if (data.success) {
            resultDiv.textContent = `✅ 아이디: ${data.user_id}`;
        } else {
            resultDiv.textContent = `❌ ${data.message}`;
        }
    });
