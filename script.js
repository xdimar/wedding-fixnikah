// --- SISTEM NOTIFIKASI KUSTOM ---

/**
 * Fungsi untuk menampilkan notifikasi
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {'success'|'error'} type - Tipe notifikasi (sukses atau error)
 * @param {number} [duration=5000] - Durasi notifikasi muncul dalam milidetik
 */
function showNotification(message, type = "success", duration = 3000) {
  const container = document.getElementById("notificationContainer");
  if (!container) {
    console.error("Notification container not found!");
    return;
  }

  // 1. Buat elemen notifikasi
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  // 2. Isi konten notifikasi
  notification.innerHTML = `
        <div class="notification-header">
            <span>${
              type === "success" ? "Berhasil!" : "Terjadi Kesalahan"
            }</span>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-body">${message}</div>
    `;

  // 3. Tambahkan ke container
  container.appendChild(notification);

  // 4. Tambahkan event listener untuk tombol tutup
  const closeButton = notification.querySelector(".notification-close");
  closeButton.addEventListener("click", () => {
    hideNotification(notification);
  });

  // 5. Tampilkan notifikasi dengan animasi (trigger reflow)
  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  // 6. Sembunyikan notifikasi otomatis setelah durasi tertentu
  setTimeout(() => {
    hideNotification(notification);
  }, duration);
}
// Music Player
const audio = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
let isPlaying = true;

// Autoplay music when page loads (note: modern browsers may block autoplay)
document.addEventListener("DOMContentLoaded", function () {
  // Try to autoplay
  audio
    .play()
    .then(() => {
      isPlaying = true;
      musicToggle.classList.add("playing");
    })
    .catch((error) => {
      console.log("Autoplay prevented:", error);
      isPlaying = false;
      musicToggle.classList.remove("playing");
    });
});

// Toggle music play/pause
musicToggle.addEventListener("click", function () {
  if (isPlaying) {
    audio.pause();
    musicToggle.classList.remove("playing");
    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    audio.play();
    musicToggle.classList.add("playing");
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
  }
  isPlaying = !isPlaying;
});

function createHearts() {
  const heartsContainer = document.getElementById("heartsContainer");
  const heartSymbols = ["❤️", "💕", "💖", "💗", "💝"];

  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML =
      heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    heart.style.animationDuration = Math.random() * 10 + 10 + "s";
    heart.style.animationDelay = Math.random() * 5 + "s";

    heartsContainer.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
      heart.remove();
    }, 20000);
  }, 3000);
}

createHearts();
document.addEventListener("click", function (e) {
  createClickHeart(e.clientX, e.clientY);
});

function createClickHeart(x, y) {
  const clickHeart = document.createElement("div");
  clickHeart.className = "click-heart";
  clickHeart.innerHTML = "❤️";
  clickHeart.style.left = x + "px";
  clickHeart.style.top = y + "px";
  clickHeart.style.fontSize = "30px";
  clickHeart.style.color = "#e50914";

  document.body.appendChild(clickHeart);

  setTimeout(() => {
    clickHeart.remove();
  }, 1000);
}
// Fungsi untuk membuat partikel animasi
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 300;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Ukuran acak untuk partikel
    const size = Math.random() * 5 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Posisi acak untuk partikel
    particle.style.left = `${Math.random() * 100}%`;

    // Delay animasi acak
    particle.style.animationDelay = `${Math.random() * 15}s`;

    // Durasi animasi acak
    particle.style.animationDuration = `${Math.random() * 10 + 15}s`;

    particlesContainer.appendChild(particle);
  }
}
createParticles();
/**
 * Fungsi untuk menyembunyikan dan menghapus notifikasi
 * @param {HTMLElement} notification - Elemen notifikasi yang akan dihapus
 */
function hideNotification(notification) {
  notification.classList.remove("show");
  // Tunggu animasi selesai sebelum menghapus elemen dari DOM
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300); // Durasi harus sama dengan CSS transition
}
// Countdown Timer
function updateCountdown() {
  const weddingDate = new Date("January 7, 2026 08:00:00").getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days < 10 ? "0" + days : days;
  document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
  document.getElementById("minutes").innerText =
    minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("seconds").innerText =
    seconds < 10 ? "0" + seconds : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

const rsvpForm = document.getElementById("rsvpForm");
rsvpForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(rsvpForm);

  fetch("api/submit_rsvp.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        showNotification(data.message, "success"); // GANTI ALERT
        rsvpForm.reset();
      } else {
        showNotification(data.message, "error"); // GANTI ALERT
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(
        "Gagal mengirim RSVP. Periksa koneksi internet Anda.",
        "error"
      ); // GANTI ALERT
    });
});
// Copy Account Number
const copyButtons = document.querySelectorAll(".btn-copy");

copyButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const accountNumber = this.getAttribute("data-account-number");

    // Use the Clipboard API
    navigator.clipboard
      .writeText(accountNumber)
      .then(() => {
        // Change button text temporarily
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> <span>Tersalin</span>';
        this.classList.add("copied");

        // Show notification
        const notification = this.closest(".bank-card").querySelector(
          ".copied-notification"
        );
        notification.classList.add("show");

        // Reset button after 2 seconds
        setTimeout(() => {
          this.innerHTML = originalHTML;
          this.classList.remove("copied");
          notification.classList.remove("show");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = accountNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        // Change button text temporarily
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> <span>Tersalin</span>';
        this.classList.add("copied");

        // Reset button after 2 seconds
        setTimeout(() => {
          this.innerHTML = originalHTML;
          this.classList.remove("copied");
        }, 2000);
      });
  });
});

// Scroll Animations (Fade In and Fade Out)
// Scroll Animations (Fade In and Fade Out)
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px", // Mulai fade out saat elemen 100px di bawah layar
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    // Jika elemen masuk ke layar, tambahkan class 'active'
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
    // Jika elemen keluar dari layar, hapus class 'active'
    else {
      entry.target.classList.remove("active");
    }
  });
}, observerOptions);

// Amati semua section yang memiliki class 'fade-in'
document.querySelectorAll(".fade-in").forEach((section) => {
  observer.observe(section);
});
