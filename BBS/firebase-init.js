// ✅ Firebase SDKの読み込み
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

// ✅ Firebaseプロジェクト設定（修正済）
const firebaseConfig = {
  apiKey: "AIzaSyBegpVTN1QihqgssCKkJDzTG17R8Tl--U8",
  authDomain: "world-market-now.firebaseapp.com",
  projectId: "world-market-now",
  storageBucket: "world-market-now.appspot.com", // ✅ 修正済み！
  messagingSenderId: "442033538783",
  appId: "1:442033538783:web:7b84a91834f5454e910b6a"
};

// ✅ 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ グローバル定義（すべてのJSで使えるようにする）
window.db = db;
window.storage = storage;

// ✅ 確認ログ（読み込み確認用）
console.log("✅ firebase-init.js loaded");
