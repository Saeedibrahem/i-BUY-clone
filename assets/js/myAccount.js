const user = JSON.parse(localStorage.getItem("login")) ?? {};
const userData = JSON.parse(localStorage.getItem("userData")) ?? [];
const accountForm = document.getElementById("accountForm");
let userFormData = { ...user };

// ================================================================== DOM load check =========================================================

document.addEventListener("DOMContentLoaded", () => {
  if (!JSON.parse(localStorage.getItem("login"))) {
    const container = document.querySelector(".account__dashboard ")
    errorPage(container)
  } else {
    // let user = JSON.parse(localStorage.getItem("login"));
    let userName = JSON.parse(localStorage.getItem("login")).email.split("@")[0];

    document.getElementById("userName").textContent = user?.username ? user.username : userName;
    document.getElementById("validationDefaultUsername").value = user?.username ? user.username : userName;
    document.getElementById("validationDefault03").value = user.email;
  }
});

// ================================================================== logOut click event =========================================================

document.querySelector(".logOut").addEventListener("click", () => {
  if (location.pathname.includes("myAccount")) {
    let userName = JSON.parse(localStorage.getItem("login")).email.split("@")[0];
    notyf.success(`هتوحشنا 💔${user.username ? user.username : userName}`);
    loggedOut();
  }
});

// ================================================================== form edit account info events =========================================================


accountForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (user.password === e.target.userOldPass.value) {
    if (e.target.firstName.value.length !== 0) {
      userFormData.firstName = e.target.firstName.value;
    }
    if (e.target.lastName.value.length !== 0) {
      userFormData.lastname = e.target.lastName.value;
    }
    if (e.target.userName.value.length !== 0) {
      userFormData.username = e.target.userName.value;
    }
    if (e.target.userEmail.value.length !== 0) {
      userFormData.email = e.target.userEmail.value;
    }
    if (
      e.target.userNewPass.value.length !== 0 ||
      e.target.userNewPass2.value.length !== 0
    ) {
      if (e.target.userNewPass.value === e.target.userNewPass2.value) {
        userFormData.password = e.target.userNewPass.value;
        saveChanges(e.target);
        loggedOut();
        return;
      } else {
        notyf.error("كلمة المرور غير متطابقة");
      }
    }
    saveChanges(e.target);
  } else {
    notyf.error("كلمة المرور الحاليه خاطئه");
  }
});


// ================================================================== logOut func =========================================================

const loggedOut = () => {
  localStorage.removeItem("login");
  removeIsLogin()
  wishlistCounter.textContent = "0";
  setTimeout(() => {
    location.href = "/login.html";
  }, 2000);
};

// ================================================================== save Changes func =========================================================

const saveChanges = (e) => {
  const newUserData = userData.filter((ele) => ele.email !== user.email);
  newUserData.push(userFormData);
  localStorage.setItem("login", JSON.stringify(userFormData));
  localStorage.setItem("userData", JSON.stringify(newUserData));
  notyf.success("تم حفظ التغييرات بنجاح");
  e.firstName.value = "";
  e.lastName.value = "";
  e.userName.value = "";
  e.userEmail.value = "";
  e.userOldPass.value = "";
  e.userNewPass.value = "";
  e.userNewPass2.value = "";
};
