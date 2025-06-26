import {
  getFirestore,
  collectionGroup,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Firestoreインスタンス
const db = window.db;

// ✅ HTML表示先
const container = document.getElementById("deleted-posts");

// ✅ 投稿一覧を読み込む関数
async function loadDeletedPosts() {
  try {
    const snapshot = await getDocs(collectionGroup(db, "posts"));
    let found = 0;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const parentPath = docSnap.ref.parent.parent.path; // threads/{threadId}
      const postId = docSnap.id;

      if (data.deleted === true) {
        found++;

        const name = data.name || "Anonymous";
        const time = data.createdAt?.toDate().toLocaleString() || "Unknown";
        const content = data.content || "";

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <div class="card-header">🧑 ${name}</div>
          <div class="card-time">🕓 ${time}</div>
          <div class="card-content">📝 ${content}</div>
          <div class="card-thread">📌 Path: <code>${parentPath}/posts/${postId}</code></div>
          <button class="restore-button" data-thread="${parentPath}" data-id="${postId}" style="
            margin-top: 10px;
            background-color: #22c55e;
            color: white;
            padding: 6px 12px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          ">🔁 Restore</button>
        `;

        container.appendChild(card);
      }
    });

    if (found === 0) {
      container.innerHTML = "<p style='text-align:center; color:#64748b;'>No deleted posts found.</p>";
    }

    // ✅ 復元処理（管理者用）
    const restoreButtons = document.querySelectorAll(".restore-button");
    restoreButtons.forEach(button => {
      button.addEventListener("click", async () => {
        const threadPath = button.dataset.thread; // threads/xxx
        const postId = button.dataset.id;

        const confirmRestore = confirm("Restore this deleted post?");
        if (!confirmRestore) return;

        const postRef = doc(db, `${threadPath}/posts`, postId);
        try {
          await updateDoc(postRef, { deleted: false });
          alert("Post restored successfully.");
          location.reload();
        } catch (err) {
          console.error("Failed to restore post:", err);
          alert("Error restoring post.");
        }
      });
    });

  } catch (err) {
    console.error("❌ Failed to load deleted posts:", err);
    container.innerHTML = "<p style='color:red;'>Error loading deleted posts.</p>";
  }
}

loadDeletedPosts();
