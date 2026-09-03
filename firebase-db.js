// ================================================================
// FIREBASE — Realtime Database + Storage
//
// CONFIGURAÇÃO (faça isso uma vez):
//   1. Acesse https://console.firebase.google.com
//   2. Crie projeto → "luani-stories" (ou qualquer nome)
//   3. Realtime Database → Criar → modo teste
//   4. Storage → Começar → modo teste
//   5. Configurações do projeto → Seus apps → Web → Registrar app
//   6. Copie a firebaseConfig e cole abaixo
//   7. No Storage, vá em Rules e coloque:
//      rules_version = '2';
//      service firebase.storage {
//        match /b/{bucket}/o {
//          match /{allPaths=**} {
//            allow read: if true;
//            allow write: if true;
//          }
//        }
//      }
// ================================================================

const firebaseConfig = {
  apiKey:            "AIzaSyDemo_SUBSTITUA_PELA_SUA_CHAVE",
  authDomain:        "luani-stories.firebaseapp.com",
  databaseURL:       "https://luani-stories-default-rtdb.firebaseio.com",
  projectId:         "luani-stories",
  storageBucket:     "luani-stories.appspot.com",
  messagingSenderId: "000000000000",
  appId:             "1:000000000000:web:00000000000000000000"
};

// ── Init ─────────────────────────────────────────────────────────
let DB        = null;
let STORAGE   = null;
let dbOnline  = false;

try {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  DB      = firebase.database();
  STORAGE = firebase.storage();
  dbOnline = true;
  console.log('[Firebase] conectado');
} catch (e) {
  console.warn('[Firebase] não configurado:', e.message);
}

// ================================================================
// STORAGE — Áudios do Felipe
// Caminho: voices/{storyId}/{pageIndex}.webm
// ================================================================

// Faz upload de um Blob e retorna a URL pública
async function uploadVoice(storyId, pageIndex, blob) {
  if (!STORAGE) throw new Error('Firebase Storage não configurado');

  const ext  = blob.type.includes('ogg') ? 'ogg'
             : blob.type.includes('mp4') ? 'mp4'
             : 'webm';
  const path = `voices/${storyId}/${pageIndex}.${ext}`;
  const ref  = STORAGE.ref(path);

  await ref.put(blob, { contentType: blob.type });
  const url = await ref.getDownloadURL();
  return url;
}

// Busca a URL pública de um áudio (retorna null se não existir)
async function getVoiceURL(storyId, pageIndex) {
  if (!STORAGE) return null;

  const exts = ['webm', 'ogg', 'mp4'];
  for (const ext of exts) {
    try {
      const url = await STORAGE.ref(`voices/${storyId}/${pageIndex}.${ext}`).getDownloadURL();
      return url;
    } catch {}
  }
  return null;
}

// Deleta um áudio do storage
async function deleteVoiceStorage(storyId, pageIndex) {
  if (!STORAGE) return;
  const exts = ['webm', 'ogg', 'mp4'];
  for (const ext of exts) {
    try {
      await STORAGE.ref(`voices/${storyId}/${pageIndex}.${ext}`).delete();
    } catch {}
  }
}

// Lista quais páginas têm áudio gravado (salvo no DB como índice)
async function getRecordedPages(storyId) {
  if (!DB) return [];
  try {
    const snap = await DB.ref(`recorded/${storyId}`).once('value');
    const data = snap.val();
    if (!data) return [];
    return Object.keys(data).map(Number);
  } catch { return []; }
}

// Marca página como gravada no DB
function markPageRecorded(storyId, pageIndex, url) {
  if (!DB) return;
  DB.ref(`recorded/${storyId}/${pageIndex}`).set({ url, recordedAt: new Date().toISOString() });
}

// Remove marca de gravado
function unmarkPageRecorded(storyId, pageIndex) {
  if (!DB) return;
  DB.ref(`recorded/${storyId}/${pageIndex}`).remove();
}

// ================================================================
// PRESENÇA ONLINE
// ================================================================
function setUserPresence(isOnline) {
  if (!DB) return;
  const ref = DB.ref('presence/luani');
  const data = { online: isOnline, lastSeen: new Date().toISOString() };
  if (isOnline) {
    ref.set({ ...data, online: true });
    ref.onDisconnect().set({ ...data, online: false });
  } else {
    ref.set(data);
  }
}

function listenPresence(callback) {
  if (!DB) { callback(false, null); return; }
  DB.ref('presence/luani').on('value', snap => {
    const d = snap.val();
    callback(d?.online === true, d?.lastSeen);
  });
}

// ================================================================
// HISTÓRIAS LIDAS
// ================================================================
function markStoryRead(storyId, storyTitle) {
  // localStorage
  try {
    const r = JSON.parse(localStorage.getItem('luani_read') || '{}');
    r[storyId] = { title: storyTitle, readAt: new Date().toISOString(), count: (r[storyId]?.count || 0) + 1 };
    localStorage.setItem('luani_read', JSON.stringify(r));
  } catch {}
  // Firebase
  if (!DB) return;
  DB.ref(`read/${storyId}`).transaction(c => ({
    title: storyTitle,
    readAt: c?.readAt || new Date().toISOString(),
    lastReadAt: new Date().toISOString(),
    count: (c?.count || 0) + 1
  }));
}

function getReadStories(cb) {
  if (DB) { DB.ref('read').once('value', s => cb(s.val() || {})); return; }
  try { cb(JSON.parse(localStorage.getItem('luani_read') || '{}')); } catch { cb({}); }
}

// ================================================================
// HISTÓRIAS GERADAS PELA IA
// ================================================================
function saveAIStoryDB(story) {
  try {
    const saved = JSON.parse(localStorage.getItem('luani_ai_stories') || '[]');
    if (!saved.find(s => s.id === story.id)) {
      saved.push({ ...story, savedAt: new Date().toISOString() });
      localStorage.setItem('luani_ai_stories', JSON.stringify(saved));
    }
  } catch {}
  if (!DB) return;
  DB.ref(`ai_stories/${story.id}`).set({
    id: story.id, title: story.title, desc: story.desc, tag: story.tag,
    savedAt: new Date().toISOString(),
    pages: story.pages.map(p => ({ title: p.title, text: p.text }))
  });
}

function getAIStoriesDB(cb) {
  if (DB) { DB.ref('ai_stories').once('value', s => cb(s.val() || {})); return; }
  try {
    const arr = JSON.parse(localStorage.getItem('luani_ai_stories') || '[]');
    const obj = {}; arr.forEach(s => obj[s.id] = s);
    cb(obj);
  } catch { cb({}); }
}

function getSavedLocalStories() {
  try { return JSON.parse(localStorage.getItem('luani_ai_stories') || '[]'); } catch { return []; }
}

function deleteSavedStoryDB(id) {
  try {
    let arr = getSavedLocalStories().filter(s => s.id !== id);
    localStorage.setItem('luani_ai_stories', JSON.stringify(arr));
  } catch {}
  if (DB) DB.ref(`ai_stories/${id}`).remove();
}

// ================================================================
// ADMIN PANEL — atualiza dados
// ================================================================
function loadAdminData() {
  listenPresence((online, lastSeen) => {
    const dot = document.getElementById('apDot');
    const txt = document.getElementById('apOnlineText');
    const ls  = document.getElementById('apLastSeen');
    if (dot) dot.className = 'ap-status-dot ' + (online ? 'online' : 'offline');
    if (txt) txt.textContent = online ? '🟢 Luani está online agora!' : '🔴 Offline';
    if (ls && lastSeen) ls.textContent = new Date(lastSeen).toLocaleString('pt-BR');
  });

  getReadStories(data => {
    const el = document.getElementById('apReadList');
    if (!el) return;
    const entries = Object.entries(data);
    el.innerHTML = entries.length
      ? entries.map(([,d]) => `<div class="ap-item"><i class="fas fa-book"></i> <strong>${d.title}</strong> — ${d.count}x lida</div>`).join('')
      : 'Nenhuma ainda';
  });

  getAIStoriesDB(data => {
    const el = document.getElementById('apGenList');
    if (!el) return;
    const entries = Object.entries(data);
    el.innerHTML = entries.length
      ? entries.map(([,d]) => `<div class="ap-item"><i class="fas fa-wand-magic-sparkles"></i> <strong>${d.title}</strong></div>`).join('')
      : 'Nenhuma ainda';
  });
}

// ================================================================
// INIT PRESENCE
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  setUserPresence(true);
  window.addEventListener('beforeunload', () => setUserPresence(false));
  setInterval(() => setUserPresence(true), 120000);
});
