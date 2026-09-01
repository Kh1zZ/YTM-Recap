# YTM-Recap

Buat recap YouTube Music dari Google Takeout langsung di browser.

**[Buka YTM-Recap →](https://ytm-recap-kh1z.vercel.app/)**

Tidak perlu akun atau database. File histori diproses langsung di perangkat pengguna dan tidak diunggah ke server.

## Cara pakai

1. Buka [ytm-recap-kh1z.vercel.app](https://ytm-recap-kh1z.vercel.app/).
2. Download ekspor **YouTube dan YouTube Music** dari [Google Takeout](https://takeout.google.com/).
3. Upload file ZIP Takeout langsung ke halaman—tidak perlu extract manual. File JSON histori juga didukung.
4. Isi nama atau nickname, lalu pilih style **Glass** atau **Receipt**.
5. Klik **Buat recap**, lalu download gambar JPG-nya.

## Fitur

- Analisis pemutaran YouTube Music selama 30 hari terakhir.
- Menampilkan Top 3 Artist dan Top 10 Lagu.
- Dua pilihan desain: Glass dan Receipt.
- Menerima JSON maupun ZIP Google Takeout.
- Membuat dan mengunduh JPG 1080×1920 langsung dari browser.

## Menjalankan lokal

Halaman web bersifat statis. Cukup buka `index.html` dengan browser, atau jalankan lewat ekstensi Live Server di VS Code.

Generator Node.js juga tetap tersedia untuk membuat versi Glass dari terminal:

```powershell
npm install
npm run recap -- --name "(nama)"
```

Hasil terminal dibuat di `output/youtube_music_recap.jpg`.
