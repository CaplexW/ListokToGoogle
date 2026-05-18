// Инициализация Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDafMlOVzaGNinGwVAps9DclV05NO6vnTY",
  authDomain: "listok2-ea802.firebaseapp.com",
  projectId: "listok2-ea802",
  storageBucket: "listok2-ea802.firebasestorage.app",
  messagingSenderId: "862650729174",
  appId: "1:862650729174:web:a90bc402622b6a4021bf77",
  measurementId: "G-76N05JWSLM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Обработчик авторизации через Google
function handleCredentialResponse(response) {
  const accessToken = response.credential;
  console.log("Google OAuth Token:", accessToken);
  localStorage.setItem("googleAccessToken", accessToken);
  alert("Авторизация успешна! Токен сохранён в localStorage.");
}

// Инициализация GIS после загрузки страницы
window.onload = function () {
  google.accounts.id.initialize({
    client_id: "862650729174-t93uout29b5g7uah5kg3j9et0p9g949p.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    scope: "https://www.googleapis.com/auth/calendar",
    auto_select: false,
    cancel_on_tap_outside: false,
  });
  google.accounts.id.renderButton(
    document.getElementById("google-signin"),
    { theme: "outline", size: "large", text: "signin_with" }
  );
};