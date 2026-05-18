// Инициализация Firebase (если нужно)
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

// Инициализация OAuth 2.0 клиента
let tokenClient;

function initClient() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: "862650729174-t93uout29b5g7uah5kg3j9et0p9g949p.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/calendar",
    callback: (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      console.log("Access Token:", accessToken);
      localStorage.setItem("googleAccessToken", accessToken);
      alert("Авторизация успешна! Токен сохранён.");
    },
  });
}

// Инициализация при загрузке страницы
window.onload = function () {
  initClient();
  // Добавляем обработчик на кнопку Google Sign-In
  document.getElementById("google-signin").addEventListener("click", () => {
    tokenClient.requestAccessToken();
  });
};