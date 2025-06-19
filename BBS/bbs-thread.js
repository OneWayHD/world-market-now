import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
  updateDoc as updatePostDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Firebase接続
const db = window.db;

// ✅ 管理者表示モード（trueでDeleteボタンは出る）
const isAdmin = true;

// ✅ パスワード（JS内に埋め込まれる簡易方式）
const ADMIN_PASSWORD = "w0rldM4rketNow";

// ✅ URLからスレッドIDを取得
const params = new URLSearchParams(location.search);
const threadId = params.get("id");

// ✅ 要素取得
const titleEl = document.getElementById("thread-title");
const postList = document.getElementById("post-list");
const replyForm = document.getElementById("reply-form");

// ✅ 投稿一覧を読み込む関数
async function loadThread() {
  if (!threadId) {
    titleEl.innerText = "❌ Thread ID is missing.";
    return;
  }

  try {
    const threadRef = doc(db, "threads", threadId);
    const threadSnap = await getDoc(threadRef);

    if (!threadSnap.exists()) {
      titleEl.innerText = "❌ Thread not found.";
      return;
    }

    titleEl.innerText = threadSnap.data().title || "(no title)";

    const postsRef = collection(db, "threads", threadId, "posts");
    const q = query(postsRef, orderBy("createdAt", "asc"));
    const postSnap = await getDocs(q);

    if (postSnap.empty) {
      postList.innerHTML = "<li>No posts yet.</li>";
      return;
    }

    let html = "";
    postSnap.forEach(docSnap => {
      const data = docSnap.data();
      const postId = docSnap.id;

      if (data.deleted === true) return;

      const name = data.name || "Anonymous";
      const time = data.createdAt?.toDate().toLocaleString() ?? "Unknown";
      const isReported = data.reported === true;
      const content = data.content || "";

      const contentHtml = isReported
        ? `
          <div class="post-content" style="color:#9ca3af;">
            ⚠ This post has been reported.<br>
            <span style="font-style: italic;">${content}</span>
          </div>`
        : `<div class="post-content">${content}</div>`;

      const reportBtn = `<button class="report-button" data-id="${postId}">Report</button>`;
      const deleteBtn = isAdmin
        ? `<button class="delete-button" data-id="${postId}">Delete</button>`
        : "";

      html += `
        <li class="post" data-id="${postId}">
          <div class="post-author">${name}</div>
          ${contentHtml}
          <div class="post-time">${time}</div>
          ${deleteBtn}
          ${reportBtn}
        </li>
      `;
    });

    postList.innerHTML = html;

    // ✅ 通報処理
    const reportButtons = document.querySelectorAll(".report-button");
    reportButtons.forEach(button => {
      button.addEventListener("click", async () => {
        const postId = button.dataset.id;
        const postRef = doc(db, "threads", threadId, "posts", postId);

        try {
          await updatePostDoc(postRef, { reported: true });
          alert("Reported. Thank you for your feedback.");
          location.reload();
        } catch (err) {
          console.error("Report failed:", err);
          alert("Failed to report this post. Please try again later.");
        }
      });
    });

    // ✅ 削除処理（adminのみ）
    if (isAdmin) {
      const deleteButtons = document.querySelectorAll(".delete-button");
      deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
          const postId = button.dataset.id;

          const input = prompt("Enter admin password to delete this post:");
          if (input !== ADMIN_PASSWORD) {
            alert("Incorrect password. Deletion cancelled.");
            return;
          }

          const confirmDelete = confirm("Are you sure you want to delete this post?");
          if (!confirmDelete) return;

          const postRef = doc(db, "threads", threadId, "posts", postId);
          try {
            await updatePostDoc(postRef, { deleted: true });
            alert("Post deleted.");
            location.reload();
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete the post. Please try again later.");
          }
        });
      });
    }

  } catch (err) {
    console.error("Error loading thread:", err);
    titleEl.innerText = "❌ Failed to load thread.";
  }
}

loadThread();

// ✅ 返信投稿処理
if (replyForm) {
  replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const lastPostTime = localStorage.getItem("lastPostTime");
    const now = Date.now();
    if (lastPostTime && now - parseInt(lastPostTime, 10) < 30000) {
      alert("You're posting too quickly. Please wait a few seconds before replying again.");
      return;
    }

    const name = replyForm.name.value.trim() || "Anonymous";
    const content = replyForm.content.value.trim(); // ✅ 修正済：value.trim()

    if (!content) {
      alert("Please enter some content.");
      return;
    }

    if (content.length < 5) {
      alert("Your reply must be at least 5 characters.");
      return;
    }

    try {
      await addDoc(collection(db, "threads", threadId, "posts"), {
        name,
        content,
        createdAt: serverTimestamp(),
        deleted: false
      });

      await updateDoc(doc(db, "threads", threadId), {
        latestReplyAt: serverTimestamp()
      });

      localStorage.setItem("lastPostTime", now.toString());
      location.reload();
    } catch (err) {
      console.error("Error posting reply:", err);
      alert("Failed to post reply. Please try again.");
    }
  });
}
