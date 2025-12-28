import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

 const firebaseConfig = {
    apiKey: "AIzaSyCOLyBnVy8YLnSXjXu1rZsc-rF09Nis_sI",
    authDomain: "shweywethla-49cb4.firebaseapp.com",
    databaseURL: "https://shweywethla-49cb4-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shweywethla-49cb4",
    storageBucket: "shweywethla-49cb4.firebasestorage.app",
    messagingSenderId: "594546464212",
    appId: "1:594546464212:web:97389851dba108344bf241",
    measurementId: "G-6F9283EEQZ"
  };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app,"shadowtalk");
export const storage = getStorage(app);