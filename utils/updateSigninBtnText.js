import { isTokenValid } from "../googleServices.js";

export default async function updateSigninBtnText() {
  const authButton = document.getElementById("google-signin");
  const accessToken = localStorage.getItem("googleAccessToken");

  if (accessToken) {
    const tokenIsValid = await isTokenValid(accessToken);
    const buttonText = tokenIsValid ? "Вы авторизированы" : "Авторизироваться через Google";

    authButton.textContent = buttonText;

    if (!tokenIsValid) localStorage.removeItem("googleAccessToken");
  }
}
