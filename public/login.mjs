const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputId = document.getElementById("inputId").value;
    const inputPw = document.getElementById("inputPw").value;

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputId, inputPw }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert(`${data.userid}님 로그인 성공!`);
        window.location.href = "/";
      } else {
        alert(data.message || "로그인 실패");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    }
  });
}

// 아이디 찾기 폼 이벤트 처리 (find-id.html)
const findIdForm = document.getElementById("findId");
if (findIdForm) {
  findIdForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const resultDiv = document.getElementById("resultMessage");

    try {
      const response = await fetch("/auth/find-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (data.success) {
        resultDiv.textContent = `✅ 아이디: ${data.user_id}`;
      } else {
        resultDiv.textContent = `❌ ${data.message}`;
      }
    } catch (err) {
      resultDiv.textContent = "❌ 요청 실패";
    }
  });
}

// 비밀번호 찾기 폼 이벤트 처리 (find-pw.html)
const findPasswordForm = document.getElementById("findPassword");
if (findPasswordForm) {
  findPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pwId = document.getElementById("pwId").value;
    const pwPhone = document.getElementById("pwPhone").value;
    const resultDiv = document.getElementById("resultMessage");

    try {
      const response = await fetch("/auth/sendSms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pwId, pwPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        resultDiv.textContent = `✅ ${data.message}`;
        document.getElementById("verifySection").style.display = "block";
      } else {
        resultDiv.textContent = `❌ ${data.message}`;
      }
    } catch (err) {
      resultDiv.textContent = "❌ 오류 발생";
    }
  });
}

// 인증번호 확인 버튼 이벤트 (find-pw.html)
const verifyBtn = document.getElementById("verifyBtn");
if (verifyBtn) {
  verifyBtn.addEventListener("click", async () => {
    const pwPhone = document.getElementById("pwPhone").value;
    const code = document.getElementById("verifyCode").value;
    const resultDiv = document.getElementById("resultMessage");

    try {
      const response = await fetch("/auth/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pwPhone, code }),
      });

      const data = await response.json();

      if (response.ok) {
        resultDiv.textContent = `✅ 인증 성공. 새 비밀번호를 입력하세요.`;
        document.getElementById("resetPasswordSection").style.display = "block";
      } else {
        resultDiv.textContent = `❌ ${data.message}`;
      }
    } catch (err) {
      resultDiv.textContent = "❌ 인증 확인 실패";
    }
  });
}

// 비밀번호 재설정 폼 이벤트 처리 (find-pw.html)
const resetPasswordForm = document.getElementById("resetPasswordForm");
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("pwId").value;
    const newPassword = document.getElementById("newPassword").value;
    const resultDiv = document.getElementById("resultMessage");

    try {
      const response = await fetch("/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        resultDiv.innerHTML = `✅ 비밀번호가 재설정되었습니다.<br>다시 로그인 해주세요.`;
      } else {
        resultDiv.textContent = `❌ ${data.message}`;
      }
    } catch (err) {
      resultDiv.textContent = "❌ 비밀번호 변경 실패";
    }
  });
}
