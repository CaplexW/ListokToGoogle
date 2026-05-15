  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDafMlOVzaGNinGwVAps9DclV05NO6vnTY",
    authDomain: "listok2-ea802.firebaseapp.com",
    projectId: "listok2-ea802",
    storageBucket: "listok2-ea802.firebasestorage.app",
    messagingSenderId: "862650729174",
    appId: "1:862650729174:web:a90bc402622b6a4021bf77",
    measurementId: "G-76N05JWSLM"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);