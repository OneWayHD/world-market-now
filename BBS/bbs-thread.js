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
  increment
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const db = window.db;
const isAdmin = true;
const ADMIN_PASSWORD = "w0rldM4rketNow";

const params = new URLSearchParams(location.search);
const threadId = params.get("id");

const titleEl = document.getElementById("thread-title");
const categoryLabel = document.getElementById("thread-category-label");
const postList = document.getElementById("post-list");
const replyForm = document.getElementById("reply-form");
const replyTextarea = replyForm?.content;

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function linkifyAnchors(content) {
  return content.replace(/&gt;&gt;(\d+)/g, (match, num) => {
    return `<a href="#post-${num}" class="anchor-link">&gt;&gt;${num}</a>`;
  });
}

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

    const threadData = threadSnap.data();
    const category = threadData.category || "Unknown";

    const classMap = {
      Indices: "category-indices",
      Forex: "category-forex",
      Crypto: "category-crypto"
    };
    const cssClass = classMap[category] || "";
    categoryLabel.innerHTML = `<span class="category-label ${cssClass}">${category}</span>`;
    titleEl.innerText = escapeHTML(threadData.title || "(no title)");

    const postsRef = collection(db, "threads", threadId, "posts");
    const q = query(postsRef, orderBy("createdAt", "asc"));
    const postSnap = await getDocs(q);

    if (postSnap.empty) {
      postList.innerHTML = "<li>No posts yet.</li>";
      return;
    }

    let html = "";
    let index = 1;

    postSnap.forEach(docSnap => {
      const data = docSnap.data();
      const postId = docSnap.id;

      if (data.deleted === true) return;

      const name = escapeHTML(data.name || "Anonymous");
      const time = data.createdAt?.toDate().toLocaleString() ?? "Unknown";
      const isReported = data.reported === true;
      const rawContent = data.content || "";
      const escapedContent = escapeHTML(rawContent).replace(/\n/g, "<br>");
      const linkedContent = linkifyAnchors(escapedContent);

      const contentHtml = isReported
        ? `<div class="post-content" style="color:#9ca3af;">
            ⚠ This post has been reported.<br>
            <span style="font-style: italic;">${linkedContent}</span>
          </div>`
        : `<div class="post-content">${linkedContent}</div>`;

      const likeCount = data.likes || 0;
      const likeBtn = `<button class="like-button" data-id="${postId}">👍 ${likeCount}</button>`;
      const replyBtn = `<button class="reply-button" data-number="${index}">Reply</button>`;
      const reportBtn = `<button class="report-button" data-id="${postId}">Report</button>`;
      const deleteBtn = isAdmin
        ? `<button class="delete-button" data-id="${postId}">Delete</button>`
        : "";

      html += `
        <li class="post" id="post-${index}" data-id="${postId}">
          <div class="post-author">#${index} ${name}</div>
          ${contentHtml}
          <div class="post-time">${time}</div>
          <div class="reaction-bar">${likeBtn}</div>
          ${replyBtn}
          ${deleteBtn}
          ${reportBtn}
        </li>
      `;

      // ✅ 5件ごとに広告を挿入
      if (index % 5 === 0) {
        html += `
          <li class="post" style="text-align: center; padding: 16px;">
            <ins class="adsbygoogle"
                 style="display:inline-block;width:728px;height:90px"
                 data-ad-client="ca-pub-3836772651637182"
                 data-ad-slot="6566583745"></ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </li>
        `;
      }

      index++;
    });

    postList.innerHTML = html;

    document.querySelectorAll(".report-button").forEach(button => {
      button.addEventListener("click", async () => {
        const postId = button.dataset.id;
        const postRef = doc(db, "threads", threadId, "posts", postId);
        try {
          await updateDoc(postRef, { reported: true });
          alert("Reported. Thank you for your feedback.");
          location.reload();
        } catch (err) {
          console.error("Report failed:", err);
          alert("Failed to report this post. Please try again later.");
        }
      });
    });

    if (isAdmin) {
      document.querySelectorAll(".delete-button").forEach(button => {
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
            await updateDoc(postRef, { deleted: true });
            alert("Post deleted.");
            location.reload();
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete the post. Please try again later.");
          }
        });
      });
    }

    document.querySelectorAll(".reply-button").forEach(button => {
      button.addEventListener("click", () => {
        const number = button.dataset.number;
        const current = replyTextarea.value;
        if (!current.includes(`>>${number}`)) {
          replyTextarea.value = `>>${number}\n` + current;
        }
        replyTextarea.focus();
      });
    });

    document.querySelectorAll(".like-button").forEach(button => {
      button.addEventListener("click", async () => {
        const postId = button.dataset.id;
        const postRef = doc(db, "threads", threadId, "posts", postId);
        try {
          await updateDoc(postRef, {
            likes: increment(1)
          });
          location.reload();
        } catch (err) {
          console.error("Like failed:", err);
          alert("Failed to like the post. Please try again.");
        }
      });
    });

  } catch (err) {
    console.error("Error loading thread:", err);
    titleEl.innerText = "❌ Failed to load thread.";
  }
}

loadThread();

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
    const content = replyForm.content.value.trim();

    if (!content || content.length < 5) {
      alert("Your reply must be at least 5 characters.");
      return;
    }

    try {
      await addDoc(collection(db, "threads", threadId, "posts"), {
        name,
        content,
        createdAt: serverTimestamp(),
        deleted: false,
        reported: false,
        likes: 0
      });

      await updateDoc(doc(db, "threads", threadId), {
        latestReplyAt: serverTimestamp(),
        replyCount: increment(1)
      });

      localStorage.setItem("lastPostTime", now.toString());
      location.reload();

    } catch (err) {
      console.error("Reply or counter update failed:", err);
      alert("Reply posted, but thread counter failed to update.");
      localStorage.setItem("lastPostTime", now.toString());
      location.reload();
    }
  });
}
