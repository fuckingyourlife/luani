// ================================================================
// NARRATOR + GRAVADOR DE VOZ — versão corrigida
// ================================================================

// ── TTS ──────────────────────────────────────────────────────────
const synth = window.speechSynthesis;
let utterance     = null;
let isNarrating   = false;
let narratorSpeed = 0.82;
let selectedVoice = null;

function loadVoices() {
  if (!synth) return;
  const v = synth.getVoices();
  if (!v.length) return;
  selectedVoice =
    v.find(x => x.lang === 'pt-BR' && x.name.toLowerCase().includes('google')) ||
    v.find(x => x.lang === 'pt-BR') ||
    v.find(x => x.lang.startsWith('pt')) ||
    v[0] || null;
}
if (synth) { synth.onvoiceschanged = loadVoices; loadVoices(); }

// ── Mensagem especial da página principal ───────────────────────
function toggleSpecialMessage() {
  const audio = document.getElementById('specialMessageAudio');
  const button = document.getElementById('specialMessagePlay');
  const icon = document.getElementById('specialMessageIcon');
  if (!audio || !button || !icon) return;
  if (audio.paused) {
    audio.play().then(() => {
      button.classList.add('playing');
      icon.className = 'fas fa-pause';
    }).catch(() => showToast('Não foi possível carregar o arquivo arquivo.mp3.'));
  } else {
    audio.pause();
    button.classList.remove('playing');
    icon.className = 'fas fa-play';
  }
  audio.onended = () => {
    button.classList.remove('playing');
    icon.className = 'fas fa-play';
  };
}

// ── Cache de URLs ─────────────────────────────────────────────────
const voiceURLCache = {};

async function resolveVoiceURL(storyId, pageIndex) {
  const key = `${storyId}_${pageIndex}`;
  if (key in voiceURLCache) return voiceURLCache[key];
  if (localStorage.getItem(`voice_removed_${key}`) === '1') {
    voiceURLCache[key] = null;
    return null;
  }

  // 1. Índice local (URLs já conhecidas)
  const indexed = getAudioIndex(storyId, pageIndex);
  if (indexed) { voiceURLCache[key] = indexed; return indexed; }

  // 2. localStorage (base64 gravado offline)
  const local = localStorage.getItem(`voice_${key}`);
  if (local) { voiceURLCache[key] = local; return local; }

  // 3. Cloudinary (URL determinística — verifica se existe)
  if (cloudinaryOK()) {
    const cdnURL = cloudGetURL(storyId, pageIndex);
    // Testa se o arquivo existe com HEAD request
    try {
      const r = await fetch(cdnURL, { method: 'HEAD' });
      if (r.ok) {
        voiceURLCache[key] = cdnURL;
        saveAudioIndex(storyId, pageIndex, cdnURL);
        return cdnURL;
      }
    } catch {}
  }

  voiceURLCache[key] = null;
  return null;
}

function invalidateVoiceCache(storyId, pageIndex) {
  delete voiceURLCache[`${storyId}_${pageIndex}`];
}

// ── Texto da página ───────────────────────────────────────────────
function getNarrText() {
  if (!currentStory) return '';
  if (currentPage === 0)
    return `${currentStory.title}. Uma história especial para a Luani, narrada com amor pelo Felipe.`;
  const pg = currentStory.pages[currentPage - 1];
  if (!pg) return '';
  return `${pg.title}. ${pg.text.replace(/\n+/g, '. ')}`;
}

// ── Player ────────────────────────────────────────────────────────
let felipeAudioEl = null;

async function startNarrator() {
  narratorStop();
  if (!currentStory) return;
  setNarrStatus('carregando...');
  const url = await resolveVoiceURL(currentStory.id, currentPage);
  if (url) playAudioURL(url);
  else useTTS();
}

function playAudioURL(url) {
  const audio = new Audio(url);
  felipeAudioEl = audio;
  audio.onended = () => {
    if (felipeAudioEl !== audio) return;
    isNarrating = false; felipeAudioEl = null;
    setNarrIcon('play'); setNarrStatus('concluído ✨'); setNarrPulse(false);
    advanceAfterNarration();
  };
  audio.onerror = () => {
    if (felipeAudioEl !== audio) return;
    felipeAudioEl = null;
    useTTS();
  };
  audio.play().then(() => {
    isNarrating = true;
    setNarrIcon('pause');
    setNarrStatus('voz do Felipe 💜');
    setNarrPulse(true);
  }).catch(() => useTTS());
}

function useTTS() {
  if (!synth) { setNarrStatus('use Chrome para narração'); return; }
  loadVoices();
  const text = getNarrText();
  if (!text.trim()) return;
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR'; utterance.rate = narratorSpeed;
  utterance.pitch = 0.88; utterance.volume = 1.0;
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onstart = () => { isNarrating = true; setNarrIcon('pause'); setNarrStatus('narrando...'); setNarrPulse(true); };
  utterance.onend   = () => { isNarrating = false; utterance = null; setNarrIcon('play'); setNarrStatus('concluído ✨'); setNarrPulse(false); advanceAfterNarration(); };
  utterance.onerror = e  => { if (e.error === 'interrupted') return; isNarrating = false; utterance = null; setNarrIcon('play'); setNarrStatus('toque play'); setNarrPulse(false); };
  setTimeout(() => { if (utterance) synth.speak(utterance); }, 50);
}

function advanceAfterNarration() {
  if (currentPage < totalPages) nextPage();
}

// ── Controles ─────────────────────────────────────────────────────
function narratorStop() {
  if (synth) synth.cancel();
  if (felipeAudioEl) { felipeAudioEl.pause(); felipeAudioEl.currentTime = 0; felipeAudioEl = null; }
  isNarrating = false; utterance = null;
  setNarrIcon('play'); setNarrStatus('pronto para narrar'); setNarrPulse(false);
}

function toggleNarrator() {
  if (felipeAudioEl && !felipeAudioEl.paused) {
    felipeAudioEl.pause(); setNarrIcon('play'); isNarrating = false; setNarrPulse(false); setNarrStatus('pausado');
  } else if (felipeAudioEl && felipeAudioEl.paused) {
    felipeAudioEl.play(); setNarrIcon('pause'); isNarrating = true; setNarrPulse(true); setNarrStatus('voz do Felipe 💜');
  } else if (synth?.paused) {
    synth.resume(); setNarrIcon('pause'); isNarrating = true; setNarrPulse(true);
  } else if (synth?.speaking) {
    synth.pause(); setNarrIcon('play'); isNarrating = false; setNarrPulse(false); setNarrStatus('pausado');
  } else {
    startNarrator();
  }
}

function narratorRewind() { narratorStop(); setTimeout(() => startNarrator(), 80); }

function updateSpeed(val) {
  narratorSpeed = parseFloat(val);
  document.getElementById('speedVal').textContent = parseFloat(val).toFixed(2) + 'x';
  if (synth?.speaking && !synth.paused) { narratorStop(); setTimeout(() => startNarrator(), 80); }
}

// ── UI ────────────────────────────────────────────────────────────
function setNarrIcon(s) { const el = document.getElementById('narrIcon'); if (el) el.className = s === 'pause' ? 'fas fa-pause' : 'fas fa-play'; }
function setNarrStatus(msg) { const el = document.getElementById('narrStatus'); if (el) el.textContent = msg; }
function setNarrPulse(on) {
  const ring = document.getElementById('narrRing');
  const av   = document.getElementById('narrAvatar');
  if (ring) { ring.style.opacity = on ? '1' : '0'; ring.style.animationPlayState = on ? 'running' : 'paused'; }
  if (av) av.style.boxShadow = on ? '0 0 22px rgba(168,85,247,.9)' : '0 0 12px rgba(168,85,247,.3)';
}

async function updateRecordBtn() {
  const btn = document.getElementById('recordPageBtn');
  if (!btn || !currentStory) return;
  const url = await resolveVoiceURL(currentStory.id, currentPage);
  btn.innerHTML = url
    ? '<i class="fas fa-microphone" style="color:#e879f9"></i>'
    : '<i class="fas fa-microphone-slash" style="opacity:.45"></i>';
  btn.title = url ? 'Página gravada — clique para regravar' : 'Gravar esta página com sua voz';
}

// ================================================================
// GRAVADOR DE PÁGINA
// ================================================================
let recMR        = null;
let recChunks    = [];
let recRecording = false;
let recStoryId   = null;
let recPageIdx   = null;
let prTimerIv    = null;
let prTimerSecs  = 0;
let prAnimId     = null;

// ── Senha simples ─────────────────────────────────────────────────
const FELIPE_PIN = '1234'; // mude esta senha para o que quiser

function checkPin() {
  const saved = localStorage.getItem('fp_auth');
  if (saved === FELIPE_PIN) return true;
  const entered = prompt('🔒 Área do Felipe\nDigite a senha para gravar:');
  if (entered === null) return false;       // cancelou
  if (entered === FELIPE_PIN) {
    localStorage.setItem('fp_auth', FELIPE_PIN);
    return true;
  }
  showToast('Senha incorreta ❌');
  return false;
}

// ── Abrir modal ───────────────────────────────────────────────────
async function openPageRecorder() {
  // Precisa ter uma história aberta
  if (!currentStory) {
    showToast('Abra uma história primeiro');
    return;
  }

  // Verifica senha
  if (!checkPin()) return;

  recStoryId = currentStory.id;
  recPageIdx = currentPage;

  // Label da página
  const lbl = document.getElementById('prPageLabel');
  if (lbl) {
    lbl.textContent = currentPage === 0
      ? `Capa — ${currentStory.title}`
      : `Pág. ${currentPage}/${totalPages} — ${(currentStory.pages[currentPage - 1] || {}).title || ''}`;
  }

  // Texto para leitura
  const txtEl = document.getElementById('prText');
  if (txtEl) txtEl.textContent = getNarrText();

  // Gravação existente
  const url = await resolveVoiceURL(recStoryId, recPageIdx);
  const existEl = document.getElementById('prExisting');
  if (existEl) {
    if (url) {
      existEl.style.display = 'flex';
      const audioEl = document.getElementById('prAudioExist');
      if (audioEl) audioEl.src = url;
    } else {
      existEl.style.display = 'none';
    }
  }

  // Reseta estado
  const playbackEl = document.getElementById('prPlayback');
  if (playbackEl) playbackEl.style.display = 'none';
  const statusEl = document.getElementById('prUploadStatus');
  if (statusEl) { statusEl.style.display = 'none'; statusEl.textContent = ''; }
  resetPRBtn();

  // Abre modal
  const modal = document.getElementById('pageRecorderModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  narratorStop();
  playSound('click');
}

// ── Fechar modal ──────────────────────────────────────────────────
function closePageRecorder() {
  if (recRecording) stopPageRecording();
  stopPRViz();
  const modal = document.getElementById('pageRecorderModal');
  if (modal) modal.classList.remove('active');
  // Mantém overflow:hidden porque o reader ainda está aberto
  document.body.style.overflow = 'hidden';
}

// ── Toggle gravação ───────────────────────────────────────────────
async function togglePageRecording() {
  if (recRecording) stopPageRecording();
  else await startPageRecording();
}

async function startPageRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true }
    });

    recChunks = [];
    const mime = getBestMime();
    recMR = new MediaRecorder(stream, mime ? { mimeType: mime } : {});

    recMR.ondataavailable = e => { if (e.data.size > 0) recChunks.push(e.data); };

    recMR.onstop = () => {
      const blob = new Blob(recChunks, { type: recMR.mimeType || 'audio/webm' });
      recMR._blob = blob;
      const url = URL.createObjectURL(blob);
      const audioNew = document.getElementById('prAudioNew');
      if (audioNew) audioNew.src = url;
      const playbackEl = document.getElementById('prPlayback');
      if (playbackEl) playbackEl.style.display = 'block';
      stream.getTracks().forEach(t => t.stop());
    };

    recMR.start(250);
    recRecording = true;

    const btn = document.getElementById('prRecBtn');
    if (btn) btn.classList.add('recording');
    const ic = document.getElementById('prRecIcon');
    if (ic) ic.className = 'fas fa-square';
    const lb = document.getElementById('prRecLabel');
    if (lb) lb.textContent = 'Parar';
    const timer = document.getElementById('prTimer');
    if (timer) timer.style.display = 'block';

    startPRTimer();
    startPRViz(stream);
    playSound('click');

  } catch (err) {
    console.error(err);
    alert('Não foi possível acessar o microfone.\n\nNo Chrome: clique no ícone de cadeado na barra de endereços → Microfone → Permitir.');
  }
}

function stopPageRecording() {
  if (recMR && recMR.state !== 'inactive') recMR.stop();
  recRecording = false;
  resetPRBtn();
  stopPRTimer();
  stopPRViz();
  playSound('click');
}

function resetPRBtn() {
  const btn = document.getElementById('prRecBtn');
  if (!btn) return;
  btn.classList.remove('recording');
  const ic = document.getElementById('prRecIcon');
  if (ic) ic.className = 'fas fa-circle';
  const lb = document.getElementById('prRecLabel');
  if (lb) lb.textContent = 'Gravar';
  const timer = document.getElementById('prTimer');
  if (timer) { timer.style.display = 'none'; timer.textContent = '0:00'; }
}

// ── Salvar ────────────────────────────────────────────────────────
async function savePageVoice() {
  if (!recMR || !recMR._blob) {
    showToast('Grave primeiro antes de salvar ⚠️');
    return;
  }

  const blob     = recMR._blob;
  const statusEl = document.getElementById('prUploadStatus');
  const saveBtn  = document.getElementById('prSaveBtn');

  if (saveBtn) { saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...'; }
  if (statusEl) { statusEl.style.display = 'flex'; statusEl.className = 'pr-upload-status uploading'; statusEl.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> Enviando para a nuvem...'; }

  try {
    let finalURL = null;
    localStorage.removeItem(`voice_removed_${recStoryId}_${recPageIdx}`);

    if (cloudinaryOK()) {
      // ── Cloudinary (grátis, sem cartão) ──
      finalURL = await cloudUploadAudio(blob, recStoryId, recPageIdx);
      saveAudioIndex(recStoryId, recPageIdx, finalURL);
      // Salva também no localStorage como cache
      localStorage.setItem(`voice_${recStoryId}_${recPageIdx}`, finalURL);
    } else {
      // ── Fallback local (base64 — só funciona neste dispositivo) ──
      finalURL = await blobToDataURL(blob);
      localStorage.setItem(`voice_${recStoryId}_${recPageIdx}`, finalURL);
    }

    invalidateVoiceCache(recStoryId, recPageIdx);

    if (statusEl) {
      statusEl.className = 'pr-upload-status success';
      statusEl.innerHTML = cloudinaryOK()
        ? '<i class="fas fa-check-circle"></i> Enviado! A Luani vai ouvir sua voz no celular dela. 💜'
        : '<i class="fas fa-check-circle"></i> Salvo localmente. Configure o Cloudinary para sincronizar com o celular da Luani.';
    }
    if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-check"></i> Salvo!'; }

    playSound('save');
    showToast(cloudinaryOK() ? 'Voz enviada para a nuvem! 💜' : 'Voz salva localmente! 💜');
    updateRecordBtn();
    setNarrStatus('voz do Felipe ✅');

    setTimeout(() => closePageRecorder(), 2200);

  } catch (err) {
    console.error('Erro ao salvar:', err);

    // Sempre salva local como fallback
    try {
      const url = await blobToDataURL(blob);
      localStorage.setItem(`voice_${recStoryId}_${recPageIdx}`, url);
      saveAudioIndex(recStoryId, recPageIdx, url);
      invalidateVoiceCache(recStoryId, recPageIdx);
      updateRecordBtn();
    } catch {}

    if (statusEl) {
      statusEl.className = 'pr-upload-status error';
      statusEl.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Erro no Cloudinary: ${err.message}<br><small>Salvo localmente como backup. Configure o Cloudinary para sincronizar.</small>`;
    }
    if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-floppy-disk"></i> Salvo localmente'; }
    setTimeout(() => closePageRecorder(), 3000);
  }
}

async function deletePageVoice() {
  if (!confirm('Remover esta gravação?')) return;
  const voiceKey = `${recStoryId}_${recPageIdx}`;
  localStorage.removeItem(`voice_${recStoryId}_${recPageIdx}`);
  localStorage.setItem(`voice_removed_${voiceKey}`, '1');
  if (typeof deleteAudioIndex === 'function') deleteAudioIndex(recStoryId, recPageIdx);
  invalidateVoiceCache(recStoryId, recPageIdx);
  if (typeof deleteVoiceStorage === 'function' && typeof dbOnline !== 'undefined' && dbOnline) {
    try {
      await deleteVoiceStorage(recStoryId, recPageIdx);
      if (typeof unmarkPageRecorded === 'function') await unmarkPageRecorded(recStoryId, recPageIdx);
    } catch (err) {
      console.error('Erro ao remover áudio da nuvem:', err);
    }
  }
  const audioEl = document.getElementById('prAudioExist');
  if (audioEl) { audioEl.pause(); audioEl.removeAttribute('src'); audioEl.load(); }
  const existEl = document.getElementById('prExisting');
  if (existEl) existEl.style.display = 'none';
  updateRecordBtn();
  showToast('Gravação removida');
  playSound('click');
}

// ── Helpers ───────────────────────────────────────────────────────
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getBestMime() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg', 'audio/mp4'];
  for (const t of types) { try { if (MediaRecorder.isTypeSupported(t)) return t; } catch {} }
  return '';
}

// ── Timer ─────────────────────────────────────────────────────────
function startPRTimer() {
  prTimerSecs = 0;
  prTimerIv = setInterval(() => {
    prTimerSecs++;
    const m = Math.floor(prTimerSecs / 60);
    const s = String(prTimerSecs % 60).padStart(2, '0');
    const el = document.getElementById('prTimer');
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
}
function stopPRTimer() { clearInterval(prTimerIv); }

// ── Visualizador ──────────────────────────────────────────────────
function startPRViz(stream) {
  try {
    const ac  = new (window.AudioContext || window.webkitAudioContext)();
    const src = ac.createMediaStreamSource(stream);
    const an  = ac.createAnalyser();
    an.fftSize = 128;
    src.connect(an);
    const data = new Uint8Array(an.frequencyBinCount);
    const bars = document.querySelectorAll('#prBars span');
    const step = Math.max(1, Math.floor(data.length / bars.length));

    const draw = () => {
      prAnimId = requestAnimationFrame(draw);
      an.getByteFrequencyData(data);
      bars.forEach((b, i) => {
        const v = (data[i * step] || 0) / 255;
        b.style.height  = Math.max(4, v * 48) + 'px';
        b.style.opacity = String(0.35 + v * 0.65);
      });
    };
    draw();
  } catch {}
}

function stopPRViz() {
  if (prAnimId) { cancelAnimationFrame(prAnimId); prAnimId = null; }
  document.querySelectorAll('#prBars span').forEach(b => {
    b.style.height = '4px'; b.style.opacity = '0.3';
  });
}

// ── Legacy alias ──────────────────────────────────────────────────
function openVoiceRecorder()  { openPageRecorder(); }
function closeVoiceRecorder() { closePageRecorder(); }
