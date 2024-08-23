// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGbtMKpdZVhWxa493Cp8Er9acB6bllHj8",
  authDomain: "indiepodcasts-2ffac.firebaseapp.com",
  projectId: "indiepodcasts-2ffac",
  storageBucket: "indiepodcasts-2ffac.appspot.com",
  messagingSenderId: "988467058262",
  appId: "1:988467058262:web:8fe55d2685db958a048df7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;