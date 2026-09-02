# YTM-Recap

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Web_App-Live_Demo-ff0033?logo=youtube&logoColor=white)](https://ytm-recap-kh1z.vercel.app/)
[![Android App](https://img.shields.io/badge/Android-Download_APK-green?logo=android&logoColor=white)](https://github.com/Kh1zZ/YTM-Recap/releases)

Buat gambar *recap* pemutaran musik YouTube Music kamu dari Google Takeout secara instan, privat, dan siap diunggah ke *story*.

---

## 🚀 Coba Langsung

* **Web App:** [ytm-recap-kh1z.vercel.app](https://ytm-recap-kh1z.vercel.app/)
* **Aplikasi Android (APK):** [Unduh Versi Terbaru (Releases)](https://github.com/Kh1zZ/YTM-Recap/releases)

---

## 🔒 Privasi & Keamanan Terjamin

Tidak perlu *login*, akun, maupun koneksi ke server/database. Semua berkas histori Google Takeout diproses **100% secara lokal di perangkat kamu (*client-side*)** melalui browser/aplikasi dan tidak pernah diunggah ke mana pun.

---

## ✨ Fitur Utama

- 📦 **Dukungan ZIP & JSON**: Unggah langsung file `.zip` hasil unduhan Google Takeout tanpa perlu diekstrak manual, atau pilih file `.json` histori tontonan.
- ⏱️ **Pilihan Rentang Waktu**:
  - 1 bulan terakhir
  - 6 bulan terakhir
  - 1 tahun terakhir
- 🎨 **Dua Pilihan Gaya Desain**:
  - **Glass**: Desain modern, gelap, dan berkilau. Mendukung 9 pilihan warna aksen (*Default*, Merah, Biru, Ungu, Hijau, Kuning, Pink, Cokelat, Abu-Hitam) serta kustomisasi *background* mandiri (unggah gambar + atur *blur*, kegelapan, ukuran, dan posisi).
  - **Receipt**: Desain minimalis monokrom bergaya struk belanja, lengkap dengan *barcode*, nomor item, dan total pemutaran.
- 🌐 **Multi-bahasa Dinamis**: Beralih antara **Bahasa Indonesia (ID)** dan **English (EN)** secara instan.
- 🎵 **Opsi Filter Video**: Pilihan untuk menyertakan histori pemutaran video YouTube reguler (opsional).
- 📱 **Siap untuk Story**: Hasil gambar berformat JPG resolusi tinggi **1080×1920 (9:16)** yang pas untuk Instagram Story, WhatsApp Status, maupun TikTok.
- 📲 **Dukungan Android Native**: Tersedia dalam bentuk file APK offline yang ringan dan responsif.

---

## 📖 Cara Menggunakan

1. Ambil berkas histori dari [Google Takeout](https://takeout.google.com/):
   - Klik **Batalkan semua pilihan** (*Deselect all*).
   - Centang **YouTube dan YouTube Music**.
   - Klik **Langkah berikutnya** dan buat ekspor.
   - Unduh berkas `.zip` yang dikirimkan Google ke email kamu.
2. Buka **[YTM-Recap](https://ytm-recap-kh1z.vercel.app/)** di browser atau gunakan **Aplikasi Android**.
3. Unggah berkas `.zip` tersebut langsung ke aplikasi (tidak perlu diekstrak).
4. Sesuaikan nama/kustomisasi, rentang waktu, gaya *recap*, serta warna/latar belakang sesuai selera.
5. Klik **Buat recap** dan unduh gambar hasilnya.

---

## 💻 Menjalankan Secara Lokal

Halaman web ini sepenuhnya statis (Vanilla HTML, CSS, JavaScript). Kamu bisa:

1. *Clone* atau unduh repositori ini.
2. Buka berkas `index.html` langsung di browser, atau gunakan ekstensi **Live Server** di VS Code.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [GNU General Public License v3.0](LICENSE).