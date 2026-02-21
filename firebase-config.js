// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVu8nlzm3HLuZBFY479PvK3RACza0aIrg",
  authDomain: "maxmobileshop-c63f6.firebaseapp.com",
  projectId: "maxmobileshop-c63f6",
  storageBucket: "maxmobileshop-c63f6.firebasestorage.app",
  messagingSenderId: "208284587491",
  appId: "1:208284587491:web:16723255b585e4ab2c3cd6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { firebaseConfig };
export default app;