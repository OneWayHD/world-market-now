import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Firestore インスタンス
const db = window.db;

// DOM取得
const form = document.querySelector("form");
const titleInput = form.querySelector('input[name="title"]');
const nameInput = form.querySelector('input[name="name"]');
const bodyInput = form.querySelector('textarea[name="body"]');

// 送信イベント
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // ✅ 投稿間隔制限（30秒以内の連投禁止）
  const lastPostTime = localStorage.getItem("lastPostTime");
  const now = Date.now();
  if (lastPostTime && now - parseInt(lastPostTime, 10) < 30000) {
    alert("You're posting too quickly. Please wait a few seconds before posting again.");
    return;
  }

  const title = titleInput.value.trim();
  const name = nameInput.value.trim() || "Anonymous";
  const body = bodyInput.value.trim();

  // ✅ 入力チェック
  if (!title || !body) {
    alert("Please enter both a thread title and content.");
    return;
  }

  // ✅ 文字数制限（本文5文字以上）
  if (body.length < 5) {
    alert("Your post must be at least 5 characters.");
    return;
  }

  try {
    // スレッドデータを登録（threadsコレクション）
    const threadRef = await addDoc(collection(db, "threads"), {
      title,
      createdAt: serverTimestamp(),
      latestReplyAt: serverTimestamp(),
      replyCount: 1
    });

    // 初回投稿をサブコレクションに登録
    await addDoc(collection(db, "threads", threadRef.id, "posts"), {
      name,
      content: body,
      createdAt: serverTimestamp(),
      deleted: false
    });

    // ✅ 成功時に投稿時間を記録（localStorage）
    localStorage.setItem("lastPostTime", now.toString());

    // リダイレクト
    window.location.href = `bbs-thread.html?id=${threadRef.id}`;
  } catch (err) {
    console.error("Thread creation failed:", err);
    alert("Failed to create thread. Please try again.");
  }
});
