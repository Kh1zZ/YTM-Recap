const actionPrefix = /^(?:Watched|Played|Listened to|Menonton|Diputar|Mendengarkan)\s+/i;
const topicSuffix = /\s*[-–—]\s*topic\s*$/i;
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const form = document.querySelector('#recap-form');
const fileInput = document.querySelector('#history-file');
const fileLabel = document.querySelector('#file-label');
const status = document.querySelector('#status');
const button = document.querySelector('#generate-button');
const result = document.querySelector('#result');
const preview = document.querySelector('#preview');
const downloadLink = document.querySelector('#download-link');
let currentUrl;
let backgroundImage;
let language = 'id';

const copy = {
  id: { headline: 'Recap musikmu,<br /><em>untuk kebutuhan story.</em>', intro: 'Upload histori Google Takeout, kustomisasi recap-mu sesuka hati. Tidak ada akun, server, maupun database.', privacy: 'File diproses sepenuhnya di perangkatmu.', includeYoutube: 'Ikut hitung histori YouTube biasa <small>(bisa mencakup video non-musik)</small>', formTitle: 'Buat gambar recap', uploadFile: 'Upload file JSON atau ZIP', takeoutFile: 'File dari Google Takeout', tutorialSummary: 'Cara mengambil histori dari <a href="https://takeout.google.com/" target="_blank" rel="noreferrer">Google Takeout</a>', tutorialContent: '<p><strong>1.</strong> Buka <a href="https://takeout.google.com/" target="_blank" rel="noreferrer">Google Takeout</a>, lalu klik <strong>Batalkan semua pilihan</strong>.</p><p><strong>2.</strong> Pilih <strong>YouTube dan YouTube Music</strong>, lalu lanjutkan ke langkah berikutnya.</p><p><strong>3.</strong> Buat ekspor. Setelah email dari Google datang, download file ZIP-nya.</p><p><strong>4.</strong> Upload ZIP tersebut langsung di atas—nggak perlu extract manual. Aplikasi akan mencari file histori tontonan otomatis.</p>', nameLabel: 'Nama atau nickname <span>(opsional)</span>', namePlaceholder: 'masukkan nama', periodLabel: 'Rentang recap', period1: '1 bulan terakhir', period6: '6 bulan terakhir', period12: '1 tahun terakhir', styleLabel: 'Pilih style gambar', glassDesc: 'Modern, gelap, dan berkilau', receiptDesc: 'Minimal seperti struk belanja', accentLabel: 'Warna dominan', backgroundLabel: 'Latar belakang', gradient: 'Gradasi warna', custom: 'Gambar sendiri', backgroundUpload: 'Upload gambar background', backgroundPreview: 'Preview background', blur: 'Blur', darkness: 'Kegelapan', size: 'Ukuran', positionX: 'Posisi horizontal', positionY: 'Posisi vertikal', defaultColor: 'Default', red: 'Merah', blue: 'Biru', purple: 'Ungu', green: 'Hijau', yellow: 'Kuning', pink: 'Pink', brown: 'Coklat', gray: 'Abu-hitam', generate: 'Buat recap', resultTitle: 'Ini recap-mu.', download: 'Download JPG', footer: 'Dibuat oleh kegabutan/bored ·', defaultName: 'Kamu', plays: 'kali diputar', topTracks: 'Top 10 lagu', play: 'PUTAR', topArtists: 'TOP 3 ARTISTS', item: 'ITEM', totalPlay: 'TOTAL PUTAR:', itemCount: 'JUMLAH ITEM:', thankYou: 'TERIMA KASIH SUDAH MENDENGARKAN!', noHistory: 'Tidak ada pemutaran YouTube Music dalam rentang waktu ini pada file tersebut.', analyzed: 'pemutaran dianalisis dalam', generating: 'Membuat recap…' },
  en: { headline: 'Your music recap,<br /><em>made for your story.</em>', intro: 'Upload your Google Takeout history and customize your recap your way. No accounts, servers, or databases.', privacy: 'Your file is processed entirely on your device.', includeYoutube: 'Also include regular YouTube history <small>(may include non-music videos)</small>', formTitle: 'Create recap image', uploadFile: 'Upload JSON or ZIP file', takeoutFile: 'File from Google Takeout', tutorialSummary: 'How to get your history from <a href="https://takeout.google.com/" target="_blank" rel="noreferrer">Google Takeout</a>', tutorialContent: '<p><strong>1.</strong> Open <a href="https://takeout.google.com/" target="_blank" rel="noreferrer">Google Takeout</a>, then click <strong>Deselect all</strong>.</p><p><strong>2.</strong> Select <strong>YouTube and YouTube Music</strong>, then continue to the next step.</p><p><strong>3.</strong> Create an export. When Google sends the email, download the ZIP file.</p><p><strong>4.</strong> Upload the ZIP directly above—there is no need to extract it. The app will find your watch-history file automatically.</p>', nameLabel: 'Name or nickname <span>(optional)</span>', namePlaceholder: 'enter name', periodLabel: 'Recap period', period1: 'Last 1 month', period6: 'Last 6 months', period12: 'Last 1 year', styleLabel: 'Choose recap style', glassDesc: 'Modern, dark, and luminous', receiptDesc: 'Minimal like a shopping receipt', accentLabel: 'Dominant color', backgroundLabel: 'Background', gradient: 'Color gradient', custom: 'Your own image', backgroundUpload: 'Upload background image', backgroundPreview: 'Background preview', blur: 'Blur', darkness: 'Darkness', size: 'Size', positionX: 'Horizontal position', positionY: 'Vertical position', defaultColor: 'Default', red: 'Red', blue: 'Blue', purple: 'Purple', green: 'Green', yellow: 'Yellow', pink: 'Pink', brown: 'Brown', gray: 'Gray-black', generate: 'Create recap', resultTitle: 'Your recap is ready.', download: 'Download JPG', footer: 'Made by kegabutan/bored ·', defaultName: 'You', plays: 'plays', topTracks: 'Top 10 tracks', play: 'PLAYS', topArtists: 'TOP 3 ARTISTS', item: 'ITEM', totalPlay: 'TOTAL PLAY:', itemCount: 'ITEM COUNT:', thankYou: 'THANK YOU FOR LISTENING!', noHistory: 'No YouTube Music plays were found in this time period.', analyzed: 'plays analyzed in the last', generating: 'Creating recap…' }
};
const accents = {
  default: ['#11101f', '#28163b', '#ff315b'], red: ['#11101f', '#3d1625', '#ff3b61'], blue: ['#11101f', '#172a53', '#50a4ff'], purple: ['#11101f', '#321b50', '#ae7aff'], green: ['#11101f', '#163c3b', '#53dfad'], yellow: ['#11101f', '#44351a', '#ffd65c'], pink: ['#11101f', '#44203d', '#ff85bb'], brown: ['#11101f', '#3b2923', '#d28a62'], gray: ['#11101f', '#2d303a', '#aeb3c1']
};
const t = (key) => copy[language][key] || key;

function applyLanguage() {
  document.documentElement.lang = language;
  document.querySelector('#language-toggle').textContent = language === 'id' ? 'EN' : 'ID';
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.innerHTML = t(element.dataset.i18n); });
  document.querySelector('#username').placeholder = t('namePlaceholder');
  if (!fileInput.files[0]) fileLabel.textContent = t('uploadFile');
}

function musicTrack(item, includeYoutube) {
  if (!item || typeof item.title !== 'string' || typeof item.titleUrl !== 'string') return null;
  const match = item.title.match(actionPrefix);
  if (!match) return null;
  const products = Array.isArray(item.products) ? item.products.join(' ') : '';
  const isMusic = item.titleUrl.toLowerCase().includes('music.youtube.com') || products.toLowerCase().includes('youtube music');
  if (!isMusic && !includeYoutube) return null;
  const track = item.title.slice(match[0].length).trim();
  if (!track) return null;
  const rawArtist = item.subtitles?.[0]?.name;
  const artist = typeof rawArtist === 'string' ? rawArtist.replace(topicSuffix, '').trim() : '';
  return { track, artist: artist || 'Artis tidak diketahui', hasArtist: Boolean(artist) };
}

function topEntries(map, limit) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
}

function buildStats(data, includeYoutube, periodMonths) {
  if (!Array.isArray(data)) throw new Error('Isi JSON harus berupa daftar histori dari Google Takeout.');
  const since = new Date(); since.setMonth(since.getMonth() - periodMonths);
  const tracks = new Map();
  const artists = new Map();
  let matched = 0;
  for (const item of data) {
    const playedAt = new Date(item?.time);
    if (Number.isNaN(playedAt) || playedAt < since) continue;
    const song = musicTrack(item, includeYoutube);
    if (!song) continue;
    matched += 1;
    const trackKey = JSON.stringify([song.track, song.artist]);
    tracks.set(trackKey, (tracks.get(trackKey) || 0) + 1);
    if (song.hasArtist) artists.set(song.artist, (artists.get(song.artist) || 0) + 1);
  }
  return {
    matched, since,
    tracks: topEntries(tracks, 10).map(([key, count]) => [JSON.parse(key), count]),
    artists: topEntries(artists, 3),
  };
}

async function historyFromFile(file) {
  const isZip = file.name.toLowerCase().endsWith('.zip') || file.type === 'application/zip';
  if (!isZip) return JSON.parse(await file.text());
  if (!window.JSZip) throw new Error('Fitur pembaca ZIP belum siap. Periksa koneksi internet lalu coba lagi.');
  const archive = await window.JSZip.loadAsync(file);
  const score = (name) => {
    const value = name.toLowerCase();
    return (value.includes('histori-tontonan') || value.includes('watch-history') ? 10 : 0) + (value.includes('history') || value.includes('histori') ? 2 : 0);
  };
  const files = Object.values(archive.files).filter((entry) => !entry.dir && entry.name.toLowerCase().endsWith('.json')).sort((a, b) => score(b.name) - score(a.name));
  for (const entry of files) {
    try {
      const data = JSON.parse(await entry.async('text'));
      if (Array.isArray(data) && data.some((item) => item && typeof item === 'object' && ('title' in item || 'time' in item))) return data;
    } catch { /* Try the next JSON file inside the archive. */ }
  }
  throw new Error('File ZIP ini tidak memuat histori tontonan YouTube yang dapat dibaca.');
}

function roundedRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function truncate(ctx, value, width) {
  if (ctx.measureText(value).width <= width) return value;
  let text = value;
  while (text && ctx.measureText(`${text}…`).width > width) text = text.slice(0, -1);
  return `${text.trimEnd()}…`;
}

function label(ctx, value, x, y, options = {}) {
  const { size = 28, weight = 400, color = '#fff', align = 'left', maxWidth } = options;
  ctx.font = `${weight} ${size}px Arial, sans-serif`; ctx.fillStyle = color; ctx.textAlign = align;
  ctx.fillText(maxWidth ? truncate(ctx, value, maxWidth) : value, x, y);
}

// Canvas positions text by its baseline. Measure each line so the complete
// title/subtitle group stays optically centered inside its card.
function centeredTextBlock(ctx, lines, x, centerY) {
  const measured = lines.map((line) => {
    ctx.font = `${line.weight || 400} ${line.size || 28}px Arial, sans-serif`;
    const metrics = ctx.measureText(line.value);
    return { ...line, ascent: metrics.actualBoundingBoxAscent, descent: metrics.actualBoundingBoxDescent };
  });
  const gap = 4;
  const height = measured.reduce((total, line) => total + line.ascent + line.descent, 0) + gap * Math.max(0, measured.length - 1);
  let cursor = centerY - height / 2;
  measured.forEach((line) => {
    cursor += line.ascent;
    label(ctx, line.value, x, cursor, line);
    cursor += line.descent + gap;
  });
}

function jakartaDate(value) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(value);
  return `${parts.find((p) => p.type === 'year').value}-${parts.find((p) => p.type === 'month').value}-${parts.find((p) => p.type === 'day').value}`;
}

function drawBackground(ctx) {
  const [deep, mid, accent] = accents[document.querySelector('#accent-color').value];
  ctx.fillStyle = deep; ctx.fillRect(0, 0, 1080, 1920);
  if (document.querySelector('#background-type').value === 'custom' && backgroundImage) {
    const scale = Number(document.querySelector('#background-size').value) / 100;
    const cover = Math.max(1080 / backgroundImage.width, 1920 / backgroundImage.height) * scale;
    const width = backgroundImage.width * cover; const height = backgroundImage.height * cover;
    const x = (1080 - width) * (Number(document.querySelector('#background-x').value) / 100);
    const y = (1920 - height) * (Number(document.querySelector('#background-y').value) / 100);
    ctx.save(); ctx.filter = `blur(${document.querySelector('#background-blur').value}px)`; ctx.drawImage(backgroundImage, x, y, width, height); ctx.restore();
    ctx.fillStyle = `rgba(5, 8, 18, ${Number(document.querySelector('#background-darkness').value) / 100})`; ctx.fillRect(0, 0, 1080, 1920);
  } else {
    const background = ctx.createLinearGradient(0, 0, 0, 1920); background.addColorStop(0, deep); background.addColorStop(1, mid); ctx.fillStyle = background; ctx.fillRect(0, 0, 1080, 1920);
  }
  const glow = ctx.createRadialGradient(720, 340, 0, 720, 340, 1240); glow.addColorStop(0, `${accent}8f`); glow.addColorStop(.55, `${accent}35`); glow.addColorStop(1, `${mid}00`); ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 1920);
  return accent;
}

function updateBackgroundPreview() {
  const canvas = document.querySelector('#background-preview');
  const ctx = canvas.getContext('2d'); const width = canvas.width; const height = canvas.height;
  const [deep, mid, accent] = accents[document.querySelector('#accent-color').value];
  const gradient = ctx.createLinearGradient(0, 0, 0, height); gradient.addColorStop(0, deep); gradient.addColorStop(1, mid); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
  if (backgroundImage) {
    const scale = Number(document.querySelector('#background-size').value) / 100;
    const cover = Math.max(width / backgroundImage.width, height / backgroundImage.height) * scale;
    const imageWidth = backgroundImage.width * cover; const imageHeight = backgroundImage.height * cover;
    const x = (width - imageWidth) * (Number(document.querySelector('#background-x').value) / 100);
    const y = (height - imageHeight) * (Number(document.querySelector('#background-y').value) / 100);
    ctx.save(); ctx.filter = `blur(${Number(document.querySelector('#background-blur').value) * (width / 1080)}px)`; ctx.drawImage(backgroundImage, x, y, imageWidth, imageHeight); ctx.restore();
    ctx.fillStyle = `rgba(5, 8, 18, ${Number(document.querySelector('#background-darkness').value) / 100})`; ctx.fillRect(0, 0, width, height);
  }
  const glow = ctx.createRadialGradient(width * .68, height * .18, 0, width * .68, height * .18, width * 1.15); glow.addColorStop(0, `${accent}8f`); glow.addColorStop(.55, `${accent}35`); glow.addColorStop(1, `${mid}00`); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
}

function periodText(periodMonths) { return language === 'id' ? `${periodMonths === 12 ? '1 tahun' : `${periodMonths} bulan`} terakhir` : periodMonths === 12 ? 'last 1 year' : `last ${periodMonths} months`; }

function drawGlassRecap({ tracks, artists, since }, username, periodMonths) {
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  const accent = drawBackground(ctx);
  // Header follows the compact YouTube Music Recap lockup from the reference.
  ctx.fillStyle = '#ff0033'; ctx.beginPath(); ctx.arc(116, 132, 60, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(116, 132, 30, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(108, 115); ctx.lineTo(108, 149); ctx.lineTo(137, 132); ctx.fill();
  label(ctx, 'YouTube Music', 204, 119, { size: 51, weight: 700 });
  label(ctx, 'RECAP', 204, 181, { size: 62, weight: 700 });
  label(ctx, username, 1024, 154, { size: 42, weight: 700, align: 'right', maxWidth: 390 });
  const now = new Date();
  label(ctx, `${jakartaDate(since)} — ${jakartaDate(now)}  |  ${periodText(periodMonths)}`, 56, 256, { size: 22, color: '#e6e5f0' });
  for (let rank = 0; rank < 3; rank += 1) { const y = 300 + rank * 122; roundedRect(ctx, 56, y, 968, 105, 28, 'rgba(255,255,255,.10)', 'rgba(255,255,255,.22)'); const entry = artists[rank]; if (!entry) continue; const [artist, plays] = entry; ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(108, y + 53, 28, 0, Math.PI * 2); ctx.fill(); label(ctx, String(rank + 1), 108, y + 63, { size: 28, weight: 700, align: 'center' }); centeredTextBlock(ctx, [{ value: artist, size: 28, weight: 700, maxWidth: 640 }, { value: `${plays} ${t('plays')}`, size: 22, color: '#e6e5f0', maxWidth: 640 }], 165, y + 53); }
  label(ctx, t('topTracks'), 56, 730, { size: 53, weight: 700 }); label(ctx, t('play'), 1024, 730, { size: 22, color: '#e6e5f0', align: 'right' });
  tracks.forEach(([[track, artist], plays], index) => { const y = 755 + index * 91; roundedRect(ctx, 56, y, 968, 81, 22, 'rgba(255,255,255,.10)', 'rgba(255,255,255,.22)'); label(ctx, String(index + 1).padStart(2, '0'), 80, y + 48, { size: 22, color: '#e6e5f0' }); centeredTextBlock(ctx, [{ value: track, size: 28, weight: 700, maxWidth: 620 }, { value: artist, size: 22, color: '#e6e5f0', maxWidth: 620 }], 156, y + 41); label(ctx, `${plays}×`, 995, y + 51, { size: 28, weight: 700, align: 'right' }); });
  label(ctx, 'ytm-recap-kh1z.vercel.app', 540, 1840, { size: 22, weight: 700, color: '#e6e5f0', align: 'center' });
  return canvas;
}

function receiptLine(ctx, y) {
  ctx.save(); ctx.setLineDash([7, 7]); ctx.strokeStyle = '#37342f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(82, y); ctx.lineTo(998, y); ctx.stroke(); ctx.restore();
}

function receiptLabel(ctx, value, x, y, options = {}) {
  const { size = 21, weight = 400, color = '#25231f', align = 'left', maxWidth } = options;
  ctx.font = `${weight} ${size}px "Courier New", monospace`; ctx.fillStyle = color; ctx.textAlign = align;
  ctx.fillText(maxWidth ? truncate(ctx, value, maxWidth) : value, x, y);
}

function receiptBarcode(ctx, x, y, width, height) {
  let cursor = x;
  const bars = Array.from({ length: 64 }, () => 2 + Math.floor(Math.random() * 7));
  const gap = 2;
  const scale = (width - gap * (bars.length - 1)) / bars.reduce((sum, bar) => sum + bar, 0);
  ctx.fillStyle = '#151411';
  bars.forEach((bar) => { const barWidth = bar * scale; ctx.fillRect(cursor, y, barWidth, height); cursor += barWidth + gap; });
}

function drawReceiptRecap({ tracks, artists, since, matched }, username, periodMonths) {
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#d4d0c5'; ctx.fillRect(0, 0, 1080, 1920);
  roundedRect(ctx, 48, 30, 984, 1860, 2, '#f7f4ea');
  // Subtle paper grain keeps the receipt from looking like a plain white card.
  for (let index = 0; index < 2600; index += 1) { ctx.fillStyle = `rgba(70,65,56,${Math.random() * .025})`; ctx.fillRect(55 + Math.random() * 970, 38 + Math.random() * 1845, 1, 1); }
  const now = new Date();
  receiptLabel(ctx, 'YOUTUBE-MUSIC-RECAP', 540, 132, { size: 46, weight: 700, align: 'center' });
  receiptLabel(ctx, periodText(periodMonths).toUpperCase(), 540, 184, { size: 26, align: 'center' });
  receiptLabel(ctx, `RECAP #${String(Math.floor(Math.random() * 10000)).padStart(4, '0')} FOR ${username.toUpperCase()}`, 82, 247, { size: 22, maxWidth: 900 });
  receiptLabel(ctx, jakartaDate(now), 82, 280, { size: 22 });
  receiptLine(ctx, 302);
  receiptLabel(ctx, t('topArtists'), 82, 344, { size: 25, weight: 700 });
  artists.forEach(([artist, plays], index) => { const y = 382 + index * 38; receiptLabel(ctx, `${index + 1}.`, 82, y, { size: 23, weight: 700 }); receiptLabel(ctx, artist.toUpperCase(), 130, y, { size: 23, weight: 700, maxWidth: 650 }); receiptLabel(ctx, `${plays}x`, 998, y, { size: 23, weight: 700, align: 'right' }); });
  receiptLine(ctx, 506);
  receiptLabel(ctx, 'NO', 82, 542, { size: 22, weight: 700 }); receiptLabel(ctx, t('item'), 155, 542, { size: 22, weight: 700 }); receiptLabel(ctx, t('play'), 998, 542, { size: 22, weight: 700, align: 'right' });
  receiptLine(ctx, 560);
  tracks.forEach(([[track, artist], plays], index) => { const y = 604 + index * 88; receiptLabel(ctx, String(index + 1).padStart(2, '0'), 82, y, { size: 24, weight: 700 }); receiptLabel(ctx, `${track.toUpperCase()} — ${artist.toUpperCase()}`, 155, y, { size: 24, weight: 700, maxWidth: 650 }); receiptLabel(ctx, `${plays}x`, 998, y, { size: 24, weight: 700, align: 'right' }); receiptLine(ctx, y + 31); });
  const summaryY = 1475;
  receiptLabel(ctx, t('itemCount'), 82, summaryY, { size: 22 }); receiptLabel(ctx, String(tracks.length).padStart(2, '0'), 998, summaryY, { size: 22, align: 'right' });
  receiptLabel(ctx, t('totalPlay'), 82, summaryY + 35, { size: 22 }); receiptLabel(ctx, String(matched), 998, summaryY + 35, { size: 22, align: 'right' });
  receiptLine(ctx, summaryY + 60);
  const authCode = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  receiptLabel(ctx, 'CARD : **** **** **** 2026', 82, summaryY + 96, { size: 20 });
  receiptLabel(ctx, `AUTH CODE: ${authCode}`, 82, summaryY + 126, { size: 20 });
  receiptLabel(ctx, `CARDHOLDER: ${username.toUpperCase()}`, 82, summaryY + 156, { size: 20, maxWidth: 900 });
  receiptLabel(ctx, t('thankYou'), 540, 1738, { size: 20, align: 'center' });
  receiptBarcode(ctx, 230, 1770, 620, 76);
  receiptLabel(ctx, 'ytm-recap-kh1z.vercel.app', 540, 1874, { size: 18, align: 'center' });
  return canvas;
}

function updateSubmitState() { button.disabled = !fileInput.files.length; }
fileInput.addEventListener('change', () => { fileLabel.textContent = fileInput.files[0]?.name || t('uploadFile'); updateSubmitState(); });
for (const eventName of ['dragenter', 'dragover']) document.querySelector('#upload-zone').addEventListener(eventName, (event) => { event.preventDefault(); event.currentTarget.classList.add('dragging'); });
for (const eventName of ['dragleave', 'drop']) document.querySelector('#upload-zone').addEventListener(eventName, (event) => { event.preventDefault(); event.currentTarget.classList.remove('dragging'); });
document.querySelector('#upload-zone').addEventListener('drop', (event) => { const [file] = event.dataTransfer.files; if (file) { const transfer = new DataTransfer(); transfer.items.add(file); fileInput.files = transfer.files; fileLabel.textContent = file.name; updateSubmitState(); } });
document.querySelectorAll('input[name="style"]').forEach((input) => input.addEventListener('change', () => {
  document.querySelectorAll('.style-option').forEach((option) => option.classList.toggle('selected', option.querySelector('input').checked));
  document.querySelector('#glass-controls').classList.toggle('hidden', !document.querySelector('input[name="style"]:checked').value.includes('glass'));
}));
document.querySelector('#background-type').addEventListener('change', (event) => document.querySelector('#custom-background-controls').classList.toggle('hidden', event.target.value !== 'custom'));
document.querySelector('#background-file').addEventListener('change', (event) => {
  const [file] = event.target.files; if (!file) { backgroundImage = undefined; updateBackgroundPreview(); return; }
  const image = new Image(); image.onload = () => { backgroundImage = image; updateBackgroundPreview(); }; image.src = URL.createObjectURL(file);
});
['#accent-color', '#background-blur', '#background-darkness', '#background-size', '#background-x', '#background-y'].forEach((selector) => {
  document.querySelector(selector).addEventListener('input', updateBackgroundPreview);
  document.querySelector(selector).addEventListener('change', updateBackgroundPreview);
});
document.querySelector('#language-toggle').addEventListener('click', () => { language = language === 'id' ? 'en' : 'id'; applyLanguage(); });
applyLanguage();
updateBackgroundPreview();

// Fungsi helper untuk menangani download di HP (Android WebView/Capacitor) maupun Laptop
async function handleDownloadImage(blob) {
  const fileName = 'YTM-Recap.jpg';
  const file = new File([blob], fileName, { type: 'image/jpeg' });

  // 1. Cek apakah perangkat mendukung Web Share API (Di HP Android ini akan membuka menu bawaan HP)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'YTM Recap',
        text: 'Ini hasil YTM Recap saya!',
      });
      return;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Gagal membagikan/menyimpan file:', error);
      }
    }
  }

  // 2. Fallback untuk browser laptop/desktop biasa
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Event listener submit form utama
form.addEventListener('submit', async (event) => {
  event.preventDefault(); status.textContent = ''; result.classList.add('hidden'); button.disabled = true; button.querySelector('[data-i18n="generate"]').textContent = t('generating');
  try {
    const periodMonths = Number(document.querySelector('#period').value);
    const history = await historyFromFile(fileInput.files[0]); const stats = buildStats(history, document.querySelector('#include-youtube').checked, periodMonths);
    if (!stats.matched) throw new Error(t('noHistory'));
    const username = document.querySelector('#username').value.trim() || t('defaultName');
    const selectedStyle = document.querySelector('input[name="style"]:checked').value;
    const canvas = selectedStyle === 'receipt' ? drawReceiptRecap(stats, username, periodMonths) : drawGlassRecap(stats, username, periodMonths);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', .94));
    if (!blob) throw new Error('Gambar tidak dapat dibuat. Coba ulangi.');

    if (currentUrl) URL.revokeObjectURL(currentUrl);
    currentUrl = URL.createObjectURL(blob);
    preview.src = currentUrl;

    // Intersepsi tombol download agar mengeksekusi handleDownloadImage
    downloadLink.onclick = (e) => {
      e.preventDefault();
      handleDownloadImage(blob);
    };

    document.querySelector('#result-summary').textContent = `${stats.matched.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')} ${t('analyzed')} ${periodText(periodMonths)}.`;
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    status.textContent = error.message || 'Terjadi kesalahan saat memproses file.';
  } finally {
    updateSubmitState();
    button.querySelector('[data-i18n="generate"]').textContent = t('generate');
  }
});
