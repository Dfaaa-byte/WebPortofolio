/* =========================================================
   JAVASCRIPT UNTUK UX YANG LEBIH BAIK
   ========================================================= */

// --- 1. Animasi Fade-In Saat Scroll (Observer API) ---
// Menambahkan kelas 'appear' pada elemen dengan kelas 'fade-in' saat masuk viewport.
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.1, // Elemen akan muncul saat 10% terlihat
    rootMargin: "0px 0px -50px 0px" // Memberikan margin offset sedikit
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target); // Matikan observasi setelah muncul
        }
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});


// --- 2. Navigasi Smooth Scroll (Tambahan JS untuk Kontrol Lebih Baik) ---
// Menggunakan perilaku 'scrollIntoView' yang halus untuk navigasi anchor.
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href');
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// --- 3. Form Submission (Integrasi Nyata dengan Web3Forms) ---
const contactForm = document.getElementById('proContactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Menghentikan refresh halaman

        // Menampilkan status loading pada tombol
        const btn = contactForm.querySelector('.btn-submit');
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = "Sedang Mengirim... <i class='fas fa-spinner fa-spin'></i>";
        btn.disabled = true;

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let res = await response.json();
            if (response.status == 200) {
                // Berhasil Terkirim
                alert("Terima kasih!, Pesan Anda telah berhasil terkirim ke email pribadi saya.");
                contactForm.reset();
            } else {
                // Gagal dari sisi server
                alert("Waduh, sepertinya ada masalah: " + res.message);
            }
        })
        .catch(error => {
            // Gagal karena koneksi atau error lainnya
            console.log(error);
            alert("Maaf, terjadi kesalahan teknis. Silakan coba lagi nanti.");
        })
        .then(function() {
            // Mengembalikan tombol ke keadaan semula
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
        });
    });
}