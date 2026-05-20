// Инициализация Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import showMessage from "./utils/showMessage.js";
import { firebaseConfig } from "./firebaseConfig.js";

const clienId = "862650729174-t93uout29b5g7uah5kg3j9et0p9g949p.apps.googleusercontent.com";
const scopeURL = "https://www.googleapis.com/auth/calendar"
const calendarAPIUrl = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

let tokenClient;

export function initClient() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clienId,
    scope: scopeURL,
    callback: (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      localStorage.setItem("googleAccessToken", accessToken);

      if (window.gapi?.client) {
        gapi.client.setToken({ access_token: accessToken });
      }

      showMessage("Авторизация успешна!");
    },
  });
}

export function initGapiClient() {
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: "",
      discoveryDocs: [calendarAPIUrl],
    }).then(() => {
      const accessToken = localStorage.getItem("googleAccessToken");
      if (accessToken) {
        gapi.client.setToken({ access_token: accessToken });
      }
    });
  });
};

// window.onload = function () {
  // initClient();
  // initGapiClient();

//   document.getElementById("google-signin").addEventListener("click", () => {
//     tokenClient.requestAccessToken();
//   });
// };
