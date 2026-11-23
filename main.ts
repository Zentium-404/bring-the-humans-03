const fs = require('node:fs');
const path = require('node:path');

// The house reads VIDEO.json from the submitted repository; this program's
// only job is to copy it to /output for the gate.
const repo = process.env.MAKEFUN_BOT_DIR || '.';
const outDir = process.env.MAKEFUN_OUTPUT_DIR || 'out';

const video = JSON.parse(fs.readFileSync(path.join(repo, 'VIDEO.json'), 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'VIDEO.json'), JSON.stringify(video, null, 2) + '\n');
console.log('wrote', path.join(outDir, 'VIDEO.json'), video.url);