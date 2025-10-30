// Firebase v9 모듈 기반 초기화
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUfO8I4GChXteaEczsEj5wAGa6x3tQgY0",
  authDomain: "spchon-todo-backend.firebaseapp.com",
  projectId: "spchon-todo-backend",
  storageBucket: "spchon-todo-backend.firebasestorage.app",
  messagingSenderId: "296310172625",
  appId: "1:296310172625:web:b3a2e3ca14a7298e920ef0",
  databaseURL: "https://spchon-todo-backend-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { db, rtdb };
