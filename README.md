# YTM-Recap

Buat recap YouTube Music dari Google Takeout langsung di browser secara instan dan privat.

**[Buka YTM-Recap →](https://ytm-recap-kh1z.vercel.app/)**

---

## 🔒 Privasi & Keamanan Terjamin

Tidak perlu login, akun, maupun koneksi ke server. Semua file histori Google Takeout diproses **100% di perangkat kamu (client-side)** melalui browser dan tidak pernah diunggah ke mana pun.

---

## ✨ Fitur Utama

- 📦 **Dukungan ZIP & JSON**: Upload langsung file ZIP hasil unduhan Google Takeout tanpa perlu diekstrak manual, atau pilih file JSON histori tontonan.
- ⏱️ **Pilihan Rentang Waktu**:
  - 1 bulan terakhir
  - 6 bulan terakhir
  - 1 tahun terakhir
- 🎨 **Dua Pilihan Gaya Desain**:
  - **Glass**: Desain modern, gelap, dan berkilau. Mendukung 9 pilihan warna dominan (Default, Merah, Biru, Ungu, Hijau, Kuning, Pink, Coklat, Abu-hitam) serta kustomisasi background sendiri (upload gambar + kontrol blur, kegelapan, ukuran, dan posisi).
  - **Receipt**: Desain minimalis monokrom bergaya struk belanja, lengkap dengan barcode, nomor item, dan total putar.
- 🌐 **Multi-bahasa Dinamis**: Beralih antara **Bahasa Indonesia (ID)** dan **English (EN)** secara instan.
- 🎵 **Opsi Filter Video**: Pilihan untuk menyertakan histori pemutaran video YouTube reguler (opsional).
- 📱 **Siap untuk Story**: Output gambar berformat JPG resolusi tinggi **1080×1920 (9:16)** yang pas untuk Instagram Story, WhatsApp Status, atau TikTok.

---

## 📖 Cara Menggunakan

1. Kunjungi **[ytm-recap-kh1z.vercel.app](https://ytm-recap-kh1z.vercel.app/)**.
2. Ambil histori dari [Google Takeout](https://takeout.google.com/):
   - Klik **Batalkan semua pilihan** (*Deselect all*).
   - Centang **YouTube dan YouTube Music**.
   - Klik **Langkah berikutnya** dan buat ekspor.
   - Unduh file ZIP yang dikirimkan Google ke email kamu.
3. Upload file ZIP tersebut langsung ke web YTM-Recap.
4. Sesuaikan nama/nickname, rentang waktu, gaya recap, dan warna/background sesuai selera.
5. Klik **Buat recap** dan download gambar hasilnya.

---

## 💻 Menjalankan Secara Lokal

### 1. Web Version (HTML/JS)
Halaman web ini sepenuhnya statis (Vanilla HTML, CSS, JS). Kamu bisa:
- Membuka file `index.html` langsung di browser, atau
- Menjalankannya menggunakan ekstensi **Live Server** di VS Code.

### 2. CLI / Node.js Version
Generator via terminal juga tersedia untuk membuat gambar versi Glass:

```powershell
# Install dependencies
npm install

# Masukkan file JSON histori ke folder input/ lalu jalankan:
npm run recap -- --name "NamaKamu"

# Opsi tambahan untuk menyertakan histori YouTube biasa:
npm run recap -- --name "NamaKamu" --include-youtube
```

Hasil gambar akan disimpan di `output/youtube_music_recap.jpg`.

---

## 📄 Lisensi

Proyek ini berada di bawah lisensi [MIT License](LICENSE).

