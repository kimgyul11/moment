import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDujLk3I5rTRshiDkIjHcNrcJmEX73JZZo",
  authDomain: "moment-b15ab.firebaseapp.com",
  projectId: "moment-b15ab",
  storageBucket: "moment-b15ab.appspot.com",
  messagingSenderId: "1043206803983",
  appId: "1:1043206803983:web:4b51ef18393e9b7006897a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
