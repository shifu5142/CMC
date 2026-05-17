// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAguoHID_rslY1R_Z8EXShQAwu_kSoALdw",
  authDomain: "planplan-c8971.firebaseapp.com",
  projectId: "planplan-c8971",
  storageBucket: "planplan-c8971.firebasestorage.app",
  messagingSenderId: "76461613958",
  appId: "1:76461613958:web:491825f5f12b74e4160207",
  measurementId: "G-9N6M1JKQRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };


// Initialize Firebase
