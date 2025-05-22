//유효성 검사 함수
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^010-\d{4}-\d{4}$/.test(phone);
}

// 로그인 처리
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputId = document.getElementById("inputId").value.trim();
        const inputPw = document.getElementById("inputPw").value.trim();

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
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();

        const resultDiv = document.getElementById("resultMessage");

        if (!name || !email) {
            resultDiv.textContent = "❌ 이름과 이메일을 입력해주세요.";
            return;
        }

        if (!isValidEmail(email)) {
            resultDiv.textContent = "❌ 올바른 이메일 형식을 입력해주세요.";
            return;
        }

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
const sendSmsButton = findPasswordForm?.querySelector("button[type='submit']");
let cooldown = false;

if (findPasswordForm) {
    findPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (cooldown) {
            alert("잠시 기다려주세요. 인증번호가 이미 전송되었습니다.");
            return;
        }

        const pwId = document.getElementById("pwId").value.trim();
        const pwPhone = document.getElementById("pwPhone").value.trim();
        const resultDiv = document.getElementById("resultMessage");

        if (!pwId || !pwPhone) {
            resultDiv.textContent = "❌ 아이디와 전화번호를 입력해주세요.";
            return;
        }

        if (!isValidPhone(pwPhone)) {
            resultDiv.textContent =
                "❌ 전화번호는 010-0000-0000 형식이어야 합니다.";
            return;
        }

        try {
            const response = await fetch("/auth/sendSms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pwId, pwPhone }),
            });

            const data = await response.json();

            if (response.ok) {
                resultDiv.textContent = `✅ ${data.message}`;
                document.getElementById("verifySection").style.display =
                    "block";
                startCooldown();
            } else {
                resultDiv.textContent = `❌ ${data.message}`;
            }
        } catch (err) {
            resultDiv.textContent = "❌ 오류 발생";
        }
    });
}

// 60초 쿨타임 적용 함수
function startCooldown() {
    cooldown = true;
    let seconds = 60;
    sendSmsButton.disabled = true;
    sendSmsButton.textContent = `다시 요청 (${seconds})`;

    const interval = setInterval(() => {
        seconds--;
        sendSmsButton.textContent = `다시 요청 (${seconds})`;

        if (seconds <= 0) {
            clearInterval(interval);
            cooldown = false;
            sendSmsButton.disabled = false;
            sendSmsButton.textContent = "인증번호 전송";
        }
    }, 1000);
}

// 인증번호 확인 - 실패 3회 제한
let verifyFailCount = 0;
const MAX_FAIL = 3;
const verifyBtn = document.getElementById("verifyBtn");

if (verifyBtn) {
    verifyBtn.addEventListener("click", async () => {
        const pwPhone = document.getElementById("pwPhone").value.trim();
        const code = document.getElementById("verifyCode").value.trim();
        const resultDiv = document.getElementById("resultMessage");

        if (verifyFailCount >= MAX_FAIL) {
            resultDiv.textContent =
                "❌ 인증 시도 횟수를 초과했습니다. 다시 요청해주세요.";
            verifyBtn.disabled = true;
            return;
        }

        try {
            const response = await fetch("/auth/verifyCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pwPhone, code }),
            });

            const data = await response.json();
            console.log("data", data);

            if (response.ok) {
                localStorage.setItem("tmpToken", data.tmpToken);
                resultDiv.textContent = `✅ 인증 성공. 새 비밀번호를 입력하세요.`;
                document.getElementById("resetPasswordSection").style.display =
                    "block";
                verifyFailCount = 0; // 성공 시 초기화
            } else {
                verifyFailCount++;
                resultDiv.textContent = `❌ ${data.message} (시도 ${verifyFailCount}/3)`;
                if (verifyFailCount >= MAX_FAIL) {
                    resultDiv.textContent =
                        "❌ 인증 시도 3회 초과. 인증을 다시 요청해주세요.";
                    verifyBtn.disabled = true;
                }
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

        const userId = document.getElementById("pwId").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();
        const resultDiv = document.getElementById("resultMessage");
        const tmpToken = localStorage.getItem("tmpToken");
        // 비밀번호 강도 검사
        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
        if (!pwRegex.test(newPassword)) {
            resultDiv.textContent =
                "❌ 비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.";
            return;
        }

        try {
            const response = await fetch("/auth/resetPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newPassword, tmpToken }),
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
