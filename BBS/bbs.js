import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Firestoreインスタンス
const db = window.db;

// ✅ DOM取得
const threadList = document.getElementById("thread-list");
const categoryTabs = document.querySelectorAll(".category-tab");

// ✅ 初期選択（Hot）
let selectedCategory = "Hot";

// ✅ スレッド読み込み処理（Hot or 通常カテゴリ）
async function loadThreadsByCategory(category) {
  threadList.innerHTML = "<p style='color:#64748b;'>Loading threads...</p>";

  const threadsRef = collection(db, "threads");
  let q;

  if (category === "Hot") {
    q = query(
      threadsRef,
      orderBy("latestReplyAt", "desc"),
      orderBy("replyCount", "desc"),
      limit(20)
    );
  } else {
    q = query(
      threadsRef,
      where("category", "==", category),
      orderBy("latestReplyAt", "desc"),
      limit(20)
    );
  }

  try {
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      threadList.innerHTML = "<p style='color:#64748b;'>No threads in this category yet.</p>";
      return;
    }

    let html = "";
    let count = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;

      const title = data.title || "(no title)";
      const replyCount = data.replyCount ?? 0;
      const updatedAt = data.latestReplyAt?.toDate().toISOString().split("T")[0] ?? "Unknown";
      const category = data.category || "Unknown";

      const classMap = {
        "Indices & Stocks": "category-label-indices",
        Forex: "category-label-forex",
        Crypto: "category-label-crypto"
      };
      const labelClass = classMap[category] || "category-label-unknown";
      const labelHTML = `<div class="category-label-top ${labelClass}">${category}</div>`;

      html += `
        <li class="thread-item">
          ${labelHTML}
          <a href="bbs-thread.html?id=${id}" class="thread-title">${title}</a>
          <div class="thread-meta">Posts: ${replyCount} ｜ Last Updated: ${updatedAt}</div>
        </li>
      `;

      count++;

      // ✅ 5件ごとに広告挿入（スレッドと同じ見た目）
      if (count % 5 === 0) {
        html += `
          <li class="thread-item">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-format="autorelaxed"
                 data-ad-client="ca-pub-3836772651637182"
                 data-ad-slot="3700747259"></ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </li>
        `;
      }
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

// ✅ 初期読み込み（Hot）
loadThreadsByCategory(selectedCategory);
