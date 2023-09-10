// ================================================================== DOM load check =========================================================

document.addEventListener("DOMContentLoaded", () => {
  if (JSON.parse(localStorage.getItem("login"))) {
    const container = document.querySelector(".login__section ")
    errorPage(container)
  }
});
