import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Firestore インスタンス
const db = window.db;

// ✅ DOM取得
const form = document.querySelector("form");
const categorySelect = form.querySelector('select[name="category"]');
const titleInput = form.querySelector('input[name="title"]');
const nameInput = form.querySelector('input[name="name"]');
const bodyInput = form.querySelector('textarea[name="body"]');

// ✅ 投稿イベント
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // ✅ 投稿間隔チェック（30秒）
  const lastPostTime = localStorage.getItem("lastPostTime");
  const now = Date.now();
  if (lastPostTime && now - parseInt(lastPostTime, 10) < 30000) {
    alert("You're posting too quickly. Please wait a few seconds before posting again.");
    return;
  }

  const category = categorySelect.value;
  const title = titleInput.value.trim();
  const name = nameInput.value.trim() || "Anonymous";
  const body = bodyInput.value.trim();

  if (!category || !title || !body) {
    alert("Please select a category and enter both a thread title and content.");
    return;
  }

  if (body.length < 5) {
    alert("Your post must be at least 5 characters.");
    return;
  }

  try {
    // ✅ スレッドを作成（categoryを保存・replyCount初期値1）
    const threadRef = await addDoc(collection(db, "threads"), {
      category,
      title,
      createdAt: serverTimestamp(),
      latestReplyAt: serverTimestamp(),
      replyCount: 1
    });

    // ✅ 初回投稿を登録（Firestoreルールに合うように6項目すべて追加）
    await addDoc(collection(db, "threads", threadRef.id, "posts"), {
      name,
      content: body,
      createdAt: serverTimestamp(),
      deleted: false,
      reported: false,
      likes: 0
    });

    // ✅ 投稿間隔記録
    localStorage.setItem("lastPostTime", now.toString());

    // ✅ スレッドページへリダイレクト
    window.location.href = `bbs-thread.html?id=${threadRef.id}`;
  } catch (err) {
    console.error("Thread creation failed:", err);
    alert("Failed to create thread. Please try again.");
  }
});
