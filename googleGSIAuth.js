import showElement from "./utils/showElement.js";

const clienId = "862650729174-t93uout29b5g7uah5kg3j9et0p9g949p.apps.googleusercontent.com";
const scopeURL = "https://www.googleapis.com/auth/calendar"
const calendarAPIUrl = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

let tokenClient;


window.onload = function () {
  google.accounts.id.initialize({
    client_id: "862650729174-t93uout29b5g7uah5kg3j9et0p9g949p.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    // scope: "openid email profile https://www.googleapis.com/auth/calendar",
    auto_select: true,
    cancel_on_tap_outside: false,
  });

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: "862650729174-t93uout29b5g7uah5kg3j9et0p9g949p.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/calendar",
    callback: (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      localStorage.setItem("googleAccessToken", accessToken);
    },
  });

  google.accounts.id.renderButton(
    document.getElementById("google-signin"),
    { theme: "outline", size: "large", text: "Авторизоваться через" }
  );

  initClient();
  initGapiClient();
};

function handleCredentialResponse(response) {
  const idToken = response.credential;
  localStorage.setItem("googleAccessToken", idToken);
  tokenClient.requestAccessToken();
}

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