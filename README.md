# YouTube Music Takeout Stats

Generator Node.js yang membuat recap YouTube Music vertikal 1080×1920 dalam format JPG. Recap memuat 10 lagu dan 3 artis yang paling sering diputar selama 30 hari terakhir dari ekspor JSON Google Takeout.

## Persiapan

Pasang [Node.js LTS](https://nodejs.org/) (versi 20 atau lebih baru), lalu dari folder proyek jalankan:

```powershell
npm install
```

Ekstrak Google Takeout lalu salin file atau folder JSON-nya ke dalam folder `input` proyek ini.

## Menjalankan

```powershell
npm run recap
```

Hasil dibuat di `output/youtube_music_recap.jpg`.

Tambahkan nama atau username pada gambar dengan opsi `--name`:

```powershell
npm run recap -- --name "kh1zz"
```

Secara bawaan, hanya event yang jelas berasal dari YouTube Music yang dihitung. Jika histori Anda hanya memakai URL `youtube.com`, gunakan:

```powershell
npm run recap -- --include-youtube
```

Opsi tersebut dapat ikut menghitung video non-musik. Nama artis diambil dari informasi channel/artis pada setiap event Takeout; bila tidak tersedia, artis tidak dapat dihitung.
