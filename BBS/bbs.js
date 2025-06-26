import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Firestoreインスタンス
const db = window.db;

// ✅ DOM取得
const threadList = document.getElementById("thread-list");
const categoryTabs = document.querySelectorAll(".category-tab");

// ✅ 選択中カテゴリ（初期値：Indices）
let selectedCategory = "Indices";

// ✅ スレッド読み込み処理（カテゴリ別）
async function loadThreadsByCategory(category) {
  threadList.innerHTML = "<p style='color:#64748b;'>Loading threads...</p>";

  const threadsRef = collection(db, "threads");
  const q = query(
    threadsRef,
    where("category", "==", category),
    orderBy("latestReplyAt", "desc")
  );

  try {
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      threadList.innerHTML = "<p style='color:#64748b;'>No threads in this category yet.</p>";
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
  } catch (err) {
    console.error("🔥 Failed to load threads:", err);
    threadList.innerHTML = "<p style='color:red;'>Error loading threads.</p>";
  }
}

// ✅ タブ切替イベント
categoryTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    categoryTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    selectedCategory = tab.dataset.category;
    loadThreadsByCategory(selectedCategory);
  });
});

// ✅ 初期読み込み（Indices）
loadThreadsByCategory(selectedCategory);
