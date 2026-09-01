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

function buildStats(data, includeYoutube) {
  if (!Array.isArray(data)) throw new Error('Isi JSON harus berupa daftar histori dari Google Takeout.');
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
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

function jakartaDate(value) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(value);
  return `${parts.find((p) => p.type === 'year').value}-${parts.find((p) => p.type === 'month').value}-${parts.find((p) => p.type === 'day').value}`;
}

function drawGlassRecap({ tracks, artists, since }, username) {
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  const background = ctx.createLinearGradient(0, 0, 0, 1920); background.addColorStop(0, '#121123'); background.addColorStop(1, '#282139'); ctx.fillStyle = background; ctx.fillRect(0, 0, 1080, 1920);
  const glow = ctx.createRadialGradient(850, 260, 0, 850, 260, 700); glow.addColorStop(0, 'rgba(118,54,92,.72)'); glow.addColorStop(1, 'rgba(48,29,66,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 1920);
  roundedRect(ctx, 56, 78, 59, 40, 12, '#ff0033'); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(80, 87); ctx.lineTo(80, 109); ctx.lineTo(100, 98); ctx.fill();
  label(ctx, 'YOUTUBE MUSIC', 135, 110, { size: 28, weight: 700, color: '#ff536f' });
  label(ctx, username, 1024, 112, { size: 40, weight: 700, align: 'right', maxWidth: 500 });
  label(ctx, 'YouTube Music', 56, 215, { size: 53, weight: 700 });
  const now = new Date(); label(ctx, `Recap ${months[Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', month: 'numeric' }).format(now)) - 1]}`, 56, 300, { size: 62, weight: 700 });
  label(ctx, `${jakartaDate(since)} — ${jakartaDate(now)}  ·  30 hari terakhir`, 58, 350, { size: 22, color: '#e6e5f0' });
  for (let rank = 0; rank < 3; rank += 1) { const y = 385 + rank * 122; roundedRect(ctx, 56, y, 968, 105, 28, 'rgba(255,255,255,.10)', 'rgba(255,255,255,.22)'); const entry = artists[rank]; if (!entry) continue; const [artist, plays] = entry; ctx.fillStyle = '#ff234f'; ctx.beginPath(); ctx.arc(108, y + 53, 28, 0, Math.PI * 2); ctx.fill(); label(ctx, String(rank + 1), 108, y + 63, { size: 28, weight: 700, align: 'center' }); label(ctx, artist, 165, y + 53, { size: 28, weight: 700, maxWidth: 640 }); label(ctx, `${plays} kali diputar`, 165, y + 87, { size: 22, color: '#e6e5f0' }); }
  label(ctx, 'Top 10 lagu', 56, 815, { size: 53, weight: 700 }); label(ctx, 'PUTAR', 1024, 815, { size: 22, color: '#e6e5f0', align: 'right' });
  tracks.forEach(([[track, artist], plays], index) => { const y = 840 + index * 91; roundedRect(ctx, 56, y, 968, 81, 22, 'rgba(255,255,255,.10)', 'rgba(255,255,255,.22)'); label(ctx, String(index + 1).padStart(2, '0'), 80, y + 51, { size: 22, color: '#e6e5f0' }); label(ctx, track, 156, y + 43, { size: 28, weight: 700, maxWidth: 620 }); label(ctx, artist, 156, y + 70, { size: 22, color: '#e6e5f0', maxWidth: 620 }); label(ctx, `${plays}×`, 995, y + 52, { size: 28, weight: 700, align: 'right' }); });
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

function drawReceiptRecap({ tracks, artists, since, matched }, username) {
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#d4d0c5'; ctx.fillRect(0, 0, 1080, 1920);
  roundedRect(ctx, 48, 30, 984, 1860, 2, '#f7f4ea');
  // Subtle paper grain keeps the receipt from looking like a plain white card.
  for (let index = 0; index < 2600; index += 1) { ctx.fillStyle = `rgba(70,65,56,${Math.random() * .025})`; ctx.fillRect(55 + Math.random() * 970, 38 + Math.random() * 1845, 1, 1); }
  const now = new Date();
  receiptLabel(ctx, 'YTM-RECAP', 540, 132, { size: 56, weight: 700, align: 'center' });
  receiptLabel(ctx, '30 HARI TERAKHIR', 540, 184, { size: 26, align: 'center' });
  receiptLabel(ctx, `RECAP #${String(Math.floor(Math.random() * 10000)).padStart(4, '0')} FOR ${username.toUpperCase()}`, 82, 247, { size: 22, maxWidth: 900 });
  receiptLabel(ctx, jakartaDate(now), 82, 280, { size: 22 });
  receiptLine(ctx, 302);
  receiptLabel(ctx, 'TOP 3 ARTISTS', 82, 344, { size: 25, weight: 700 });
  artists.forEach(([artist, plays], index) => { const y = 382 + index * 38; receiptLabel(ctx, `${index + 1}.`, 82, y, { size: 23, weight: 700 }); receiptLabel(ctx, artist.toUpperCase(), 130, y, { size: 23, weight: 700, maxWidth: 650 }); receiptLabel(ctx, `${plays}x`, 998, y, { size: 23, weight: 700, align: 'right' }); });
  receiptLine(ctx, 506);
  receiptLabel(ctx, 'NO', 82, 542, { size: 22, weight: 700 }); receiptLabel(ctx, 'ITEM', 155, 542, { size: 22, weight: 700 }); receiptLabel(ctx, 'PUTAR', 998, 542, { size: 22, weight: 700, align: 'right' });
  receiptLine(ctx, 560);
  tracks.forEach(([[track, artist], plays], index) => { const y = 604 + index * 88; receiptLabel(ctx, String(index + 1).padStart(2, '0'), 82, y, { size: 24, weight: 700 }); receiptLabel(ctx, `${track.toUpperCase()} — ${artist.toUpperCase()}`, 155, y, { size: 24, weight: 700, maxWidth: 650 }); receiptLabel(ctx, `${plays}x`, 998, y, { size: 24, weight: 700, align: 'right' }); receiptLine(ctx, y + 31); });
  const summaryY = 1475;
  receiptLabel(ctx, 'ITEM COUNT:', 82, summaryY, { size: 22 }); receiptLabel(ctx, String(tracks.length).padStart(2, '0'), 998, summaryY, { size: 22, align: 'right' });
  receiptLabel(ctx, 'TOTAL PLAY:', 82, summaryY + 35, { size: 22 }); receiptLabel(ctx, String(matched), 998, summaryY + 35, { size: 22, align: 'right' });
  receiptLine(ctx, summaryY + 60);
  const authCode = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  receiptLabel(ctx, 'CARD : **** **** **** 2026', 82, summaryY + 96, { size: 20 });
  receiptLabel(ctx, `AUTH CODE: ${authCode}`, 82, summaryY + 126, { size: 20 });
  receiptLabel(ctx, `CARDHOLDER: ${username.toUpperCase()}`, 82, summaryY + 156, { size: 20, maxWidth: 900 });
  receiptLabel(ctx, 'THANK YOU FOR LISTENING!', 540, 1738, { size: 20, align: 'center' });
  receiptBarcode(ctx, 230, 1770, 620, 76);
  receiptLabel(ctx, 'YTM-Recap', 540, 1874, { size: 18, align: 'center' });
  return canvas;
}

fileInput.addEventListener('change', () => { fileLabel.textContent = fileInput.files[0]?.name || 'Pilih file histori JSON'; });
for (const eventName of ['dragenter', 'dragover']) document.querySelector('#upload-zone').addEventListener(eventName, (event) => { event.preventDefault(); event.currentTarget.classList.add('dragging'); });
for (const eventName of ['dragleave', 'drop']) document.querySelector('#upload-zone').addEventListener(eventName, (event) => { event.preventDefault(); event.currentTarget.classList.remove('dragging'); });
document.querySelector('#upload-zone').addEventListener('drop', (event) => { const [file] = event.dataTransfer.files; if (file) { const transfer = new DataTransfer(); transfer.items.add(file); fileInput.files = transfer.files; fileLabel.textContent = file.name; } });
document.querySelectorAll('input[name="style"]').forEach((input) => input.addEventListener('change', () => document.querySelectorAll('.style-option').forEach((option) => option.classList.toggle('selected', option.querySelector('input').checked))));

form.addEventListener('submit', async (event) => {
  event.preventDefault(); status.textContent = ''; result.classList.add('hidden'); button.disabled = true; button.firstChild.textContent = 'Membuat recap… ';
  try {
    const raw = await fileInput.files[0].text(); const stats = buildStats(JSON.parse(raw), document.querySelector('#include-youtube').checked);
    if (!stats.matched) throw new Error('Tidak ada pemutaran YouTube Music dalam 30 hari terakhir pada file ini.');
    const username = document.querySelector('#username').value.trim();
    const selectedStyle = document.querySelector('input[name="style"]:checked').value;
    const canvas = selectedStyle === 'receipt' ? drawReceiptRecap(stats, username) : drawGlassRecap(stats, username);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', .94));
    if (!blob) throw new Error('Gambar tidak dapat dibuat. Coba ulangi.');
    if (currentUrl) URL.revokeObjectURL(currentUrl); currentUrl = URL.createObjectURL(blob); preview.src = currentUrl; downloadLink.href = currentUrl; document.querySelector('#result-summary').textContent = `${stats.matched.toLocaleString('id-ID')} pemutaran dianalisis dalam 30 hari terakhir.`; result.classList.remove('hidden'); result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) { status.textContent = error.message || 'Terjadi kesalahan saat memproses file.'; }
  finally { button.disabled = false; button.firstChild.textContent = 'Buat recap '; }
});
