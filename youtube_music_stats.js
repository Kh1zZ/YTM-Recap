#!/usr/bin/env node

import { mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const projectDir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, '$1'));
const inputDir = path.join(projectDir, 'input');
const outputFile = path.join(projectDir, 'output', 'youtube_music_recap.jpg');
const actionPrefix = /^(?:Watched|Played|Listened to|Menonton|Diputar|Mendengarkan)\s+/i;
const topicSuffix = /\s*[-–—]\s*topic\s*$/i;
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

async function jsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const itemPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return jsonFiles(itemPath);
    return entry.isFile() && entry.name.toLowerCase().endsWith('.json') ? [itemPath] : [];
  }));
  return nested.flat();
}

async function readRecords(files) {
  const records = [];
  for (const file of files) {
    try {
      const data = JSON.parse(await readFile(file, 'utf8'));
      if (Array.isArray(data)) records.push(...data.filter((item) => item && typeof item === 'object'));
    } catch (error) {
      console.warn(`Lewati ${file}: ${error.message}`);
    }
  }
  return records;
}

function extractMusicTrack(item, includeYoutube) {
  if (typeof item.title !== 'string' || typeof item.titleUrl !== 'string') return null;
  const match = item.title.match(actionPrefix);
  if (!match) return null;
  const products = Array.isArray(item.products) ? item.products.join(' ') : '';
  const isMusic = item.titleUrl.toLowerCase().includes('music.youtube.com') || products.toLowerCase().includes('youtube music');
  if (!isMusic && !includeYoutube) return null;
  const track = item.title.slice(match[0].length).trim();
  if (!track) return null;
  let artist = item.subtitles?.[0]?.name;
  artist = typeof artist === 'string' ? artist.replace(topicSuffix, '').trim() : null;
  return { track, artist: artist || null };
}

function countBy(items, key) {
  return items.reduce((counts, item) => counts.set(key(item), (counts.get(key(item)) ?? 0) + 1), new Map());
}

function top(counts, limit) {
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, limit);
}

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
}

function fit(text, maxChars) {
  const value = text || 'Artis tidak diketahui';
  return value.length <= maxChars ? value : `${value.slice(0, maxChars - 1).trimEnd()}…`;
}

function text(x, y, value, size, options = {}) {
  const { fill = '#fff', weight = 400, anchor = 'start', opacity = 1 } = options;
  return `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}">${escapeXml(value)}</text>`;
}

function glassBox(x, y, width, height, radius = 28) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="#ffffff" fill-opacity=".10" stroke="#ffffff" stroke-opacity=".22" stroke-width="2"/>`;
}

function recapSvg(topTracks, topArtists, since, now) {
  const date = (value) => value.toISOString().slice(0, 10);
  const artists = Array.from({ length: 3 }, (_, rank) => {
    const entry = topArtists[rank];
    const y = 385 + rank * 122;
    if (!entry) return glassBox(56, y, 968, 105);
    const [artist, plays] = entry;
    return `${glassBox(56, y, 968, 105)}<circle cx="108" cy="${y + 53}" r="28" fill="#ff234f"/>${text(108, y + 63, rank + 1, 28, { weight: 700, anchor: 'middle' })}${text(165, y + 53, fit(artist, 37), 28, { weight: 700 })}${text(165, y + 87, `${plays} kali diputar`, 22, { fill: '#e6e5f0', opacity: .78 })}`;
  }).join('');
  const tracks = topTracks.map(([[track, artist], plays], index) => {
    const y = 840 + index * 91;
    return `${glassBox(56, y, 968, 81, 22)}${text(80, y + 51, String(index + 1).padStart(2, '0'), 22, { fill: '#e6e5f0', opacity: .65 })}${text(156, y + 43, fit(track, 43), 28, { weight: 700 })}${text(156, y + 70, fit(artist, 56), 22, { fill: '#e6e5f0', opacity: .78 })}${text(995, y + 52, `${plays}×`, 28, { weight: 700, anchor: 'end' })}`;
  }).join('');
  return `<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#121123"/><stop offset="1" stop-color="#282139"/></linearGradient><radialGradient id="glow" cx="79%" cy="14%" r="55%"><stop stop-color="#76365c" stop-opacity=".72"/><stop offset="1" stop-color="#301d42" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#bg)"/><rect width="1080" height="1920" fill="url(#glow)"/><rect x="56" y="78" width="59" height="40" rx="12" fill="#ff0033"/><path d="M80 87v22l20-11z" fill="white"/>${text(135, 110, 'YOUTUBE MUSIC', 28, { fill: '#ff536f', weight: 700 })}${text(56, 215, 'YouTube Music', 53, { weight: 700 })}${text(56, 300, `Recap ${monthNames[now.getMonth()]}`, 62, { weight: 700 })}${text(58, 350, `${date(since)} — ${date(now)}  ·  30 hari terakhir`, 22, { fill: '#e6e5f0', opacity: .82 })}${artists}${text(56, 815, 'Top 10 lagu', 53, { weight: 700 })}${text(1024, 815, 'PUTAR', 22, { fill: '#e6e5f0', opacity: .8, anchor: 'end' })}${tracks}</svg>`;
}

async function main() {
  const includeYoutube = process.argv.includes('--include-youtube');
  let files;
  try { files = await jsonFiles(inputDir); } catch { console.error(`Tidak menemukan folder input: ${inputDir}`); process.exitCode = 1; return; }
  if (!files.length) { console.error(`Tidak menemukan file JSON di: ${inputDir}`); process.exitCode = 1; return; }
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const events = (await readRecords(files)).map((item) => ({ item, playedAt: new Date(item.time) })).filter(({ playedAt }) => !Number.isNaN(playedAt) && playedAt >= since).map(({ item }) => extractMusicTrack(item, includeYoutube)).filter(Boolean);
  if (!events.length) { console.log(`Tidak ada event pemutaran ${includeYoutube ? 'YouTube/YouTube Music' : 'YouTube Music'} yang ditemukan.`); return; }
  const tracks = top(countBy(events, ({ track, artist }) => JSON.stringify([track, artist || 'Artis tidak diketahui'])), 10).map(([key, plays]) => [JSON.parse(key), plays]);
  const artists = top(countBy(events.filter(({ artist }) => artist), ({ artist }) => artist), 3);
  // The recap heading follows Jakarta time, consistent with the original report.
  const nowJakarta = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  await mkdir(path.dirname(outputFile), { recursive: true });
  await sharp(Buffer.from(recapSvg(tracks, artists, since, nowJakarta))).jpeg({ quality: 94, mozjpeg: true }).toFile(outputFile);
  console.log(`Selesai: ${events.length} event pemutaran 30 hari terakhir dianalisis.`);
  console.log(`Gambar JPG dibuat: ${outputFile}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
