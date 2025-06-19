import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Firestore のインスタンス取得
const db = window.db;

// HTMLの表示先コンテナを探す（ulタグ）
const threadList = document.querySelector(".thread-list") || createThreadList();

function createThreadList() {
  const ul = document.createElement("ul");
  ul.className = "thread-list";
  document.querySelector("main").appendChild(ul);
  return ul;
}

// スレッド一覧を取得して表示
async function loadThreads() {
  const threadsRef = collection(db, "threads");
  const q = query(threadsRef, orderBy("latestReplyAt", "desc"));

  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      threadList.innerHTML = "<p>No threads yet. Be the first to post!</p>";
      return;
    }

    let html = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      const title = data.title || "(no title)";
      const replyCount = data.replyCount ?? 0;
      const updatedAt = data.latestReplyAt?.toDate().toISOString().split("T")[0] ?? "Unknown";

      html += `
        <li class="thread-item">
          <a href="bbs-thread.html?id=${id}">${title}</a>
          <div class="thread-meta">Posts: ${replyCount} ｜ Last Updated: ${updatedAt}</div>
        </li>
      `;
    });

    threadList.innerHTML = html;

  } catch (error) {
    console.error("Failed to load threads:", error);
    threadList.innerHTML = "<p style='color:red;'>Error loading threads.</p>";
  }
}

loadThreads();
