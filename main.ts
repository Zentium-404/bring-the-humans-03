const fs = require('node:fs');
const path = require('node:path');

// The house reads VIDEO.json from the submitted repository; this program's
// only job is to copy it to /output for the gate.
const repo = process.env.MAKEFUN_BOT_DIR || '.';
const outDir = process.env.MAKEFUN_OUTPUT_DIR || 'out';

function readVideo(repoDir) {
  const raw = fs.readFileSync(path.join(repoDir, 'VIDEO.json'), 'utf8');
  const video = JSON.parse(raw);
  if (!video || typeof video.url !== 'string') {
    throw new Error('VIDEO.json holds no url string');
  }
  return video;
}

// A video's address only: https://www.tiktok.com/@<handle>/video/<id>.
// A short link (vm.tiktok.com, vt.tiktok.com, /t/) names no video to the gate,
// and a photo post (/photo/<id>) is refused, so catch both here rather than
// lose an entry to them at the snapshot stage.
function checkUrl(url) {
  const u = new URL(url);
  if (!/(^|\.)tiktok\.com$/.test(u.hostname)) {
    throw new Error(`not a tiktok.com address: ${u.hostname}`);
  }
  const parts = u.pathname.split('/').filter(Boolean);
  if (parts.length !== 3 || !parts[0].startsWith('@') || parts[1] !== 'video') {
    throw new Error(`not a video's address: ${u.pathname}`);
  }
  if (!/^\d+$/.test(parts[2])) {
    throw new Error(`video id is not digits: ${parts[2]}`);
  }
  return `https://www.tiktok.com/${parts[0]}/video/${parts[2]}`;
}

const video = readVideo(repo);
video.url = checkUrl(video.url);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'VIDEO.json'), JSON.stringify(video, null, 2) + '\n');
console.log('wrote', path.join(outDir, 'VIDEO.json'), video.url);