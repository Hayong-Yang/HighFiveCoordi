// 유효성 검사 함수
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^010-\d{4}-\d{4}$/.test(phone);
}

function isStrongPassword(pw) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(pw);
}

// 새로고침시 마다 중복체크 값 n으로 초기화
window.onload = function () {
    document.getElementById("hiddenIdCheck").value = "n";
};

// inputId 값이 바뀔 때마다 hiddenIdCheck를 'n'으로 초기화
document.getElementById("inputId").addEventListener("input", () => {
    document.getElementById("hiddenIdCheck").value = "n";
});

// 회원가입 기능
document
    .getElementById("SignUpBtn")
    .addEventListener("click", async function () {
        const inputId = document.getElementById("inputId").value.trim();
        const inputPw = document.getElementById("inputPw").value.trim();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const hiddenIdCheck = document.getElementById("hiddenIdCheck").value;
        const ischecked = document.querySelector(
            "input[type='checkbox']"
        ).checked;

        //유효성 검사
        if (!inputId || !inputPw || !name || !email || !phone) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        if (!isValidEmail(email)) {
            alert("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        if (!isValidPhone(phone)) {
            alert("전화번호는 010-0000-0000 형식이어야 합니다.");
            return;
        }

        if (!isStrongPassword(inputPw)) {
            alert(
                "비밀번호는 8자 이상이며, 영문/숫자/특수문자를 모두 포함해야 합니다."
            );
            return;
        }

        if (hiddenIdCheck !== "y") {
            alert("아이디 중복확인을 완료해주세요.");
            return;
        }

        if (!ischecked) {
            alert("이용약관에 동의해야 회원가입이 가능합니다.");
            return;
        }

        const response = await fetch("/auth/signUp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inputId: inputId,
                inputPw: inputPw,
                name: name,
                email: email,
                phone: phone,
                hiddenIdCheck: hiddenIdCheck,
                ischecked: ischecked,
            }),
        });
        const result = await response.json();
        if (response.ok) {
            alert("회원가입 축하드립니다.");
            window.location.href = "/login.html";
        } else {
            alert(result.message);
        }
    });

// 아이디 중복확인 기능
document.getElementById("idCheck").addEventListener("click", async function () {
    const inputId = document.getElementById("inputId").value.trim();
    const hiddenIdCheck = document.getElementById("hiddenIdCheck");

    if (!inputId) {
        alert("아이디를 입력해주세요.");
        return;
    }

    const response = await fetch("/auth/duplicateCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            inputId: inputId,
            hiddenIdCheck: hiddenIdCheck,
        }),
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        hiddenIdCheck.value = "y";
        console.log("중복 확인 완료:", hiddenIdCheck.value);
    } else {
        alert(result.message);
        hiddenIdCheck.value = "n";
        console.log("중복 확인 실패:", hiddenIdCheck.value);
    }
});
/*
document.getElementById("logOut").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("token");
  alert("로그아웃 되었습니다.");
  window.location.href = "/"; // 서버에 요청해서 메인 페이지로 리디렉션
});*/
