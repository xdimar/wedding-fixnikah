// --- SISTEM UCAPAN & DOA (REAL-TIME UPDATE - VERSION FIX) ---

// Fungsi untuk merender navigasi paginasi (versi profesional)
function renderPagination(currentPage, totalPages) {
  const paginationNav = document.getElementById("paginationNav");
  paginationNav.innerHTML = ""; // Kosongkan navigasi lama

  if (totalPages <= 1) {
    return; // Tampilkan pagination jika ada lebih dari 1 halaman
  }

  // Fungsi pembuat link
  const createLink = (page, text, isDisabled = false, isActive = false) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#wishes";
    a.className = "pagination-link";
    a.textContent = text;
    a.setAttribute("data-page", page);

    if (isDisabled) {
      a.classList.add("disabled");
    } else if (isActive) {
      a.classList.add("active");
    }

    li.appendChild(a);
    return li;
  };

  // Fungsi pembuat ellipsis (...)
  const createEllipsis = () => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = "...";
    span.className = "pagination-ellipsis";
    li.appendChild(span);
    return li;
  };

  // --- LOGIKA UTAMA ---
  const maxVisiblePages = 5;
  let pagesToShow = [];

  if (totalPages <= maxVisiblePages) {
    // Jika total halaman 5 atau kurang, tampilkan semua
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else {
    // Jika total halaman lebih dari 5
    pagesToShow.push(1); // Selalu tampilkan halaman pertama

    if (currentPage <= 3) {
      // Jika user di halaman awal (1, 2, 3)
      for (let i = 2; i <= 4; i++) {
        pagesToShow.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // Jika user di halaman akhir
      for (let i = totalPages - 3; i <= totalPages - 1; i++) {
        pagesToShow.push(i);
      }
    } else {
      // Jika user di halaman tengah
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pagesToShow.push(i);
      }
    }
    pagesToShow.push(totalPages); // Selalu tampilkan halaman terakhir
  }

  // Render tombol "Previous" (<<)
  paginationNav.appendChild(
    createLink(currentPage - 1, "<<", currentPage === 1)
  );

  // Render link angka dan ellipsis
  let lastPageAdded = 0;
  pagesToShow.forEach((page, index) => {
    if (index > 0 && page - lastPageAdded > 1) {
      paginationNav.appendChild(createEllipsis()); // Tambahkan ellipsis jika ada jeda
    }
    paginationNav.appendChild(
      createLink(page, page, false, page === currentPage)
    );
    lastPageAdded = page;
  });

  // Render tombol "Next" (>>)
  paginationNav.appendChild(
    createLink(currentPage + 1, ">>", currentPage === totalPages)
  );

  // Event listener untuk semua link (menggunakan event delegation)
  paginationNav.addEventListener("click", function (e) {
    e.preventDefault();
    const target = e.target.closest(".pagination-link");
    if (
      target &&
      !target.classList.contains("disabled") &&
      !target.classList.contains("active")
    ) {
      const pageToLoad = parseInt(target.getAttribute("data-page"));
      loadWishes(pageToLoad);
    }
  });
}

// Fungsi untuk memuat ucapan
function loadWishes(page = 1) {
  // --- TAMBAHKAN CACHE-BUSTER ---
  const timestamp = new Date().getTime();
  fetch(`api/get_wishes.php?page=${page}&t=${timestamp}`) // Ganti dengan path Anda
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const wishesContainer = document.getElementById("wishesContainer");
        const paginationNav = document.getElementById("paginationNav");
        const addWishBtn = document.getElementById("addWishBtn");

        const wishesToRemove = wishesContainer.querySelectorAll(
          ".wish-card, .no-wish-message"
        );
        wishesToRemove.forEach((el) => el.remove());

        if (data.data && data.data.length > 0) {
          data.data.forEach((wish) => {
            const initial = wish.name.charAt(0).toUpperCase();
            const newWish = document.createElement("div");
            newWish.className = "wish-card";
            // --- PERBAIKAN 1: Gunakan fallback || 0 di template ---
            newWish.innerHTML = `
                        <div class="wish-header">
                            <div class="wish-avatar">${initial}</div>
                            <div>
                                <div class="wish-name">${wish.name}</div>
                                <div class="wish-date">${
                                  wish.created_at_formatted
                                }</div>
                            </div>
                        </div>
                        <p class="wish-content">${wish.message}</p>
                        <div class="wish-actions">
                            <button class="btn-like" data-wish-id="${wish.id}">
                                <i class="fas fa-thumbs-up"></i>
                                <span class="like-count">${
                                  wish.likes || 0
                                }</span>
                            </button>
                            <button class="btn-dislike" data-wish-id="${
                              wish.id
                            }">
                                <i class="fas fa-thumbs-down"></i>
                                <span class="dislike-count">${
                                  wish.dislikes || 0
                                }</span>
                            </button>
                        </div>
                    `;
            wishesContainer.insertBefore(newWish, paginationNav);
          });
        } else {
          const noWishMessage = document.createElement("p");
          noWishMessage.className = "no-wish-message";
          noWishMessage.style.textAlign = "center";
          noWishMessage.style.opacity = "0.7";
          noWishMessage.textContent = "Belum ada ucapan. Jadilah yang pertama!";
          wishesContainer.insertBefore(noWishMessage, paginationNav);
        }
        renderPagination(
          data.pagination.current_page,
          data.pagination.total_pages
        );
        // --- PERBAIKAN 2: Pasang event listener setelah render ---
        attachLikeDislikeListeners();
      }
    })
    .catch((error) => console.error("Error loading wishes:", error));
}

// Fungsi untuk menambahkan event listener ke tombol like/dislike
function attachLikeDislikeListeners() {
  document.querySelectorAll(".btn-like, .btn-dislike").forEach((button) => {
    // Hapus listener lama untuk mencegah duplikasi
    button.replaceWith(button.cloneNode(true));
  });

  // Tambahkan listener ke semua tombol yang baru
  document.querySelectorAll(".btn-like, .btn-dislike").forEach((button) => {
    button.onclick = function () {
      const wishId = this.getAttribute("data-wish-id");
      const action = this.classList.contains("btn-like") ? "like" : "dislike";

      fetch("api/like_wish.php", {
        // Ganti dengan path Anda
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `wish_id=${wishId}&action=${action}`,
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            showNotification(result.message, "success");
            // Update angka like/dislike di tombol
            const likeCount = this.querySelector(".like-count");
            const dislikeCount =
              this.parentElement.querySelector(".dislike-count");

            // Gunakan Number() untuk konversi yang aman
            const currentLikes = Number(likeCount.textContent) || 0;
            const currentDislikes = Number(dislikeCount.textContent) || 0;

            if (action === "like") {
              likeCount.textContent = currentLikes + 1;
            } else {
              dislikeCount.textContent = currentDislikes + 1;
            }
          } else {
            showNotification(result.message, "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showNotification("Gagal memberikan vote.", "error");
        });
    };
  });
}

// --- KONEKSI SERVER-SENT EVENTS ---
function connectToEventSource() {
  const eventSource = new EventSource("api/stream_wishes.php"); // Ganti dengan path Anda

  eventSource.onmessage = function (event) {
    const newWish = JSON.parse(event.data);

    const initial = newWish.name.charAt(0).toUpperCase();
    const newWishElement = document.createElement("div");
    newWishElement.className = "wish-card";
    // --- PERBAIKAN 3: Template untuk ucapan baru juga pakai fallback ---
    newWishElement.innerHTML = `
            <div class="wish-header">
                <div class="wish-avatar">${initial}</div>
                <div>
                    <div class="wish-name">${newWish.name}</div>
                    <div class="wish-date">${newWish.created_at_formatted}</div>
                </div>
            </div>
            <p class="wish-content">${newWish.message}</p>
            <div class="wish-actions">
                <button class="btn-like" data-wish-id="${newWish.id}">
                    <i class="fas fa-thumbs-up"></i>
                    <span class="like-count">${newWish.likes || 0}</span>
                </button>
                <button class="btn-dislike" data-wish-id="${newWish.id}">
                    <i class="fas fa-thumbs-down"></i>
                    <span class="dislike-count">${newWish.dislikes || 0}</span>
                </button>
            </div>
        `;

    // Tambahkan ke container di bagian paling atas
    const wishesContainer = document.getElementById("wishesContainer");
    const paginationNav = document.getElementById("paginationNav");
    wishesContainer.insertBefore(newWishElement, paginationNav);

    // Tambahkan animasi fade-in
    newWishElement.style.opacity = "0";
    newWishElement.style.transform = "translateY(20px)";
    setTimeout(() => {
      newWishElement.style.transition = "all 0.5s ease";
      newWishElement.style.opacity = "1";
      newWishElement.style.transform = "translateY(0)";
    }, 100);

    // --- PERBAIKAN 4: Pasang event listener pada elemen BARU ---
    attachLikeDislikeListeners();
  };

  eventSource.onerror = function(e) {
        // --- LOGI ERROR UNTUK DEBUGGING ---
        console.error("EventSource error:", e);
        
        // --- TUTUP KONEKSI YANG ERROR ---
        eventSource.close();

        // --- COBA KONEKSI KEMBALI SETELAH 3 DETIK ---
        setTimeout(() => {
            console.log("Attempting to reconnect to EventSource...");
            connectToEventSource();
        }, 3000);
    };
}

// --- INISIALISASI SAAT HALAMAN DIMUAT ---
document.addEventListener("DOMContentLoaded", function () {
  // ... kode untuk modal wish (tidak perlu diubah) ...
  const addWishBtn = document.getElementById("addWishBtn");
  const wishModal = document.getElementById("wishModal");
  const closeModal = document.getElementById("closeModal");
  const wishForm = document.getElementById("wishForm");

  if (addWishBtn && wishModal && closeModal && wishForm) {
    addWishBtn.addEventListener("click", () =>
      wishModal.classList.add("active")
    );
    closeModal.addEventListener("click", () =>
      wishModal.classList.remove("active")
    );
    wishModal.addEventListener("click", (e) => {
      if (e.target === wishModal) wishModal.classList.remove("active");
    });

    wishForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(wishForm);
      const submitButton = wishForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = "Mengirim...";
      submitButton.disabled = true;

      fetch("api/submit_wish.php", { method: "POST", body: formData })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            showNotification(data.message, "success");
            wishForm.reset();
            wishModal.classList.remove("active");
          } else {
            showNotification(data.message, "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showNotification(
            "Gagal mengirim ucapan. Periksa koneksi internet Anda.",
            "error"
          );
        })
        .finally(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        });
    });
  } else {
    console.error("Elemen modal/ucapan tidak ditemukan.");
  }

  // Muat ucapan awal dan mulai koneksi real-time
  loadWishes(1);
  connectToEventSource();
});
