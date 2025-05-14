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
    const inputId = document.getElementById("inputId").value;
    const inputPw = document.getElementById("inputPw").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const hiddenIdCheck = document.getElementById("hiddenIdCheck").value;
    const ischecked = document.querySelector("input[type='checkbox']").checked;

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
  const inputId = document.getElementById("inputId").value;
  const hiddenIdCheck = document.getElementById("hiddenIdCheck");

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
    console.log(hiddenIdCheck.value);
  } else {
    alert(result.message);
    hiddenIdCheck.value = "n";
    console.log(hiddenIdCheck.value);
  }
});
/*
document.getElementById("logOut").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("token");
  alert("로그아웃 되었습니다.");
  window.location.href = "/"; // 서버에 요청해서 메인 페이지로 리디렉션
});*/
