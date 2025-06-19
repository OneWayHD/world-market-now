import {
  getFirestore,
  collectionGroup,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Firebase接続
const db = window.db;

// ✅ 管理者チェック（あとでAuth切り替え可）
const isAdmin = true;

if (!isAdmin) {
  alert("Access denied. Admins only.");
  document.body.innerHTML = "<h2 style='text-align:center;color:#ef4444;'>Access Denied</h2>";
  throw new Error("Access denied.");
}

const container = document.getElementById("reported-posts");

async function loadReportedPosts() {
  try {
    const snapshot = await getDocs(collectionGroup(db, "posts"));
    let found = 0;

    console.log("🔍 読み込んだ投稿数:", snapshot.size);

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const parentPath = docSnap.ref.parent.parent.path; // threads/{threadId}
      const postId = docSnap.id;

      // ✅ ログ出力（デバッグ用）
      console.log(`📦 POST [${postId}]`, {
        reported: data.reported,
        deleted: data.deleted,
        name: data.name,
        content: data.content,
        path: `${parentPath}/posts/${postId}`
      });

      // ✅ 通報投稿かつ未削除
      if (data.reported === true && data.deleted !== true) {
        found++;

        const card = document.createElement("div");
        card.className = "card";

        const name = data.name || "Anonymous";
        const time = data.createdAt?.toDate().toLocaleString() || "Unknown";
        const content = data.content || "";

        card.innerHTML = `
          <div class="card-header">🧑 ${name}</div>
          <div class="card-time">📅 ${time}</div>
          <div class="card-content">📝 ${content}</div>
          <button data-thread="${parentPath}" data-post="${postId}">Delete</button>
        `;

        card.querySelector("button").addEventListener("click", async () => {
          const confirmDelete = confirm("Are you sure you want to delete this reported post?");
          if (!confirmDelete) return;

          try {
            await updateDoc(doc(db, `${parentPath}/posts/${postId}`), {
              deleted: true
            });
            alert("Post deleted.");
            card.remove();
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete post.");
          }
        });

        container.appendChild(card);
      }
    });

    if (found === 0) {
      container.innerHTML = "<p style='text-align:center;color:#64748b;'>No reported posts found.</p>";
    }

  } catch (err) {
    console.error("Failed to load reported posts:", err);
    container.innerHTML = "<p style='color:red;'>Error loading reported posts.</p>";
  }
}

loadReportedPosts();
