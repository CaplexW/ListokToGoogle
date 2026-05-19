// Инициализация Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
import showMessage from "./utils/showMessage.js";

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

let tokenClient;

function initClient() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: "862650729174-t93uout29b5g7uah5kg3j9et0p9g949p.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/calendar",
    callback: (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      localStorage.setItem("googleAccessToken", accessToken);

      // Устанавливаем токен в gapi.client, если он загружен
      if (window.gapi?.client) {
        gapi.client.setToken({ access_token: accessToken });
      }

      showMessage("Авторизация успешна!");
    },
  });
}

// --- Инициализация gapi.client (один раз!)
function initGapiClient() {
  if (!window.gapi) {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('client', () => {
        gapi.client.init({
          apiKey: "",
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        }).then(() => {
          const accessToken = localStorage.getItem("googleAccessToken");
          if (accessToken) {
            gapi.client.setToken({ access_token: accessToken });
          }
        });
      });
    };
    document.head.appendChild(script);
  } else {
    gapi.load('client', () => {
      gapi.client.init({
        apiKey: "",
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      }).then(() => {
        const accessToken = localStorage.getItem("googleAccessToken");
        if (accessToken) {
          gapi.client.setToken({ access_token: accessToken });
        }
      });
    });
  }
}

// --- Инициализация при загрузке страницы
window.onload = function () {
  initClient();
  initGapiClient();

  // Кнопка авторизации (HTML-кнопка, а не GIS)
  document.getElementById("google-signin").addEventListener("click", () => {
    tokenClient.requestAccessToken();
  });
};


export async function isTokenValid(accessToken) {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
    const data = await response.json();

    if (response.ok) {
      // Токен валиден
      return true;
    } else {
      // Токен невалиден
      return false;
    }
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return false;
  }
}

