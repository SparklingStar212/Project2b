/* others.js
   Logic for the Dashboard preview and the Vowel Lesson (others folder)
   - Preloads native vowel audio from ../Audio/Single%20vowel/
   - Lets user play, record, and compare similarity for each vowel
   - Stores best scores in localStorage under 'vowelScores'
*/

const audioBase = '../Audio/Single%20vowel/';
const vowels = [
  { key: 'a', char: '아', file: 'kr-m-zy-a.mp3' },
  { key: 'ae', char: '애', file: 'kr-m-zy-ae.mp3' },
  { key: 'e', char: '에', file: 'kr-m-zy-e.mp3' },
  { key: 'eo', char: '어', file: 'kr-m-zy-eo.mp3' },
  { key: 'eu', char: '으', file: 'kr-m-zy-eu.mp3' },
  { key: 'i', char: '이', file: 'kr-m-zy-i.mp3' },
  { key: 'o', char: '오', file: 'kr-m-zy-o.mp3' },
  { key: 'u', char: '우', file: 'kr-m-zy-u.mp3' }
];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const nativeBuffers = {}; // key -> Float32Array

function normalizeAudio(arr) {
  if (!arr || arr.length === 0) return arr;
  let max = 0;
  for (let i = 0; i < arr.length; i++) max = Math.max(max, Math.abs(arr[i]));
  if (max === 0) return arr;
  const out = new Float32Array(arr.length);
  for (let i = 0; i < arr.length; i++) out[i] = arr[i] / max;
  return out;
}

function crossCorrelationSimilarity(a, b) {
  if (!a || !b) return 0;
  const min = Math.min(a.length, b.length);
  if (min === 0) return 0;
  let sum = 0, an = 0, bn = 0;
  for (let i = 0; i < min; i++) {
    sum += a[i] * b[i];
    an += a[i] * a[i];
    bn += b[i] * b[i];
  }
  if (an === 0 || bn === 0) return 0;
  return sum / (Math.sqrt(an) * Math.sqrt(bn));
}

async function preloadNativeAudio() {
  const promises = vowels.map(async v => {
    try {
      const resp = await fetch(audioBase + v.file);
      const buf = await resp.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(buf);
      const channelData = audioBuffer.getChannelData(0);
      nativeBuffers[v.key] = normalizeAudio(channelData.slice(0));
    } catch (e) {
      console.warn('Failed to load', v.file, e);
    }
  });
  await Promise.all(promises);
}

function loadScores() {
  return JSON.parse(localStorage.getItem('vowelScores') || '{}');
}

function saveScore(key, score) {
  const scores = loadScores();
  const prev = scores[key] || 0;
  if (score > prev) {
    scores[key] = score;
    localStorage.setItem('vowelScores', JSON.stringify(scores));
  }
}

function overallScoreText() {
  const scores = loadScores();
  const vals = Object.values(scores);
  if (!vals.length) return '—';
  const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  return avg + '% (avg)';
}

function renderVowels() {
  const container = document.getElementById('vowelList');
  if (!container) return;
  container.innerHTML = '';
  const scores = loadScores();
  vowels.forEach(v => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4';
    const card = document.createElement('div');
    card.className = 'card';

    const inner = document.createElement('div');
    inner.className = 'd-flex align-items-center justify-content-between p-2';

    const left = document.createElement('div');
    left.innerHTML = `<div class="vowel-char" aria-hidden="true">${v.char}</div>
                      <div class="small-muted">${v.key.toUpperCase()}</div>`;

    const right = document.createElement('div');
    right.style.minWidth = '170px';
    right.innerHTML = `
      <div class="d-flex gap-2 align-items-center">
        <button class="btn btn-light btn-sm btn-play" data-key="${v.key}">▶ Play</button>
        <button class="btn btn-primary btn-sm btn-record" data-key="${v.key}">🎤 Record</button>
        <div class="meter ms-2">${scores[v.key] ? scores[v.key] + '%' : '—'}</div>
      </div>
    `;

    inner.appendChild(left);
    inner.appendChild(right);
    card.appendChild(inner);
    col.appendChild(card);
    container.appendChild(col);
  });

  // wire events
  document.querySelectorAll('.btn-play').forEach(btn => btn.addEventListener('click', e => {
    const key = e.currentTarget.dataset.key;
    const v = vowels.find(x => x.key === key);
    if (!v) return;
    new Audio(audioBase + v.file).play();
  }));

  document.querySelectorAll('.btn-record').forEach(btn => btn.addEventListener('click', async e => {
    const key = e.currentTarget.dataset.key;
    const v = vowels.find(x => x.key === key);
    if (!v) return;
    await recordAndCompare(key, v);
  }));

  const overall = document.getElementById('overallScore');
  if (overall) overall.textContent = overallScoreText();
}

async function recordAndCompare(key, v) {
  const recordBtn = document.querySelector(`.btn-record[data-key="${key}"]`);
  const playBtn = document.querySelector(`.btn-play[data-key="${key}"]`);
  const meter = recordBtn ? recordBtn.parentElement.querySelector('.meter') : null;
  const resultMessage = document.getElementById('resultMessage');
  if (!recordBtn) return;

  try {
    recordBtn.disabled = true;
    if (playBtn) playBtn.disabled = true;
    recordBtn.classList.add('recording');
    recordBtn.textContent = '● Recording';

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.start();
    resultMessage.textContent = 'Recording... speak the vowel clearly.';
    await new Promise(r => setTimeout(r, 1500));
    mediaRecorder.stop();

    const blob = await new Promise(resolve => mediaRecorder.onstop = () => resolve(new Blob(chunks)));
    const arrayBuffer = await blob.arrayBuffer();
    const userAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const userData = normalizeAudio(userAudioBuffer.getChannelData(0));

    const nativeData = nativeBuffers[key];
    const sim = nativeData ? crossCorrelationSimilarity(nativeData, userData) : 0;
    const percent = Math.max(0, Math.min(100, Math.round(sim * 100)));

    // feedback
    if (percent >= 80) {
      resultMessage.textContent = `✅ Excellent — ${percent}% similarity`;
    } else if (percent >= 60) {
      resultMessage.textContent = `🟡 Good — ${percent}% similarity`;
    } else {
      resultMessage.textContent = `❌ Keep trying — ${percent}% similarity`;
    }

    if (meter) meter.textContent = (loadScores()[key] || 0) < percent ? percent + '%' : (loadScores()[key] || '—') + '%';
    saveScore(key, percent);
    const overall = document.getElementById('overallScore');
    if (overall) overall.textContent = overallScoreText();

    // cleanup
    stream.getTracks().forEach(t => t.stop());
  } catch (err) {
    console.error(err);
    document.getElementById('resultMessage').textContent = 'Error recording — check microphone permissions.';
  } finally {
    recordBtn.disabled = false;
    if (playBtn) playBtn.disabled = false;
    recordBtn.classList.remove('recording');
    recordBtn.textContent = '🎤 Record';
    renderVowels();
  }
}

// Dashboard helpers
function renderDashboardProgress() {
  const el = document.getElementById('progressList');
  if (!el) return;
  const scores = loadScores();
  el.innerHTML = '';
  vowels.forEach(v => {
    const row = document.createElement('div');
    row.className = 'd-flex align-items-center justify-content-between py-2 border-bottom';
    const left = document.createElement('div');
    left.innerHTML = `<strong>${v.char}</strong> <span class="small-muted ms-2">${v.key.toUpperCase()}</span>`;
    const right = document.createElement('div');
    right.innerHTML = `<span>${scores[v.key] ? scores[v.key] + '%' : '—'}</span>`;
    row.appendChild(left);
    row.appendChild(right);
    el.appendChild(row);
  });
}

// actions
document.addEventListener('DOMContentLoaded', async () => {
  await preloadNativeAudio();
  renderVowels();
  renderDashboardProgress();

  const practiceAll = document.getElementById('practiceAll');
  if (practiceAll) practiceAll.addEventListener('click', () => window.location.href = 'lesson-vowels.html');

  const resetBtn = document.getElementById('resetProgress');
  if (resetBtn) resetBtn.addEventListener('click', () => { localStorage.removeItem('vowelScores'); renderVowels(); renderDashboardProgress(); });

  const streakEl = document.getElementById('streak');
  if (streakEl) {
    const s = localStorage.getItem('linguaStreak') || '0';
    streakEl.textContent = `${s} days 🔥`;
  }
});
