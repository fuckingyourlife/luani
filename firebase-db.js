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
  const savedStory = { ...story, savedAt: new Date().toISOString(), isAI: true };
  try {
    const saved = getSavedLocalStories().filter(s => s.id !== story.id);
    saved.push(savedStory);
    localStorage.setItem('luani_ai_stories', JSON.stringify(saved));
    const deleted = JSON.parse(localStorage.getItem('luani_ai_story_deletions') || '[]')
      .filter(deletedId => deletedId !== story.id);
    localStorage.setItem('luani_ai_story_deletions', JSON.stringify(deleted));
  } catch {}
  if (!DB) return;
  DB.ref(`ai_stories/${story.id}`).set(savedStory)
    .then(() => DB.ref(`ai_story_deletions/${story.id}`).remove())
    .catch(err => console.warn('[Firebase] não foi possível sincronizar a história:', err));
}

function getAIStoriesDB(cb) {
  const deliver = (remote = {}, remoteDeleted = {}) => {
    const local = getSavedLocalStories();
    const localDeleted = (() => {
      try { return JSON.parse(localStorage.getItem('luani_ai_story_deletions') || '[]'); }
      catch { return []; }
    })();
    const merged = {};
    local.forEach(story => { if (story?.id) merged[story.id] = story; });
    Object.entries(remote || {}).forEach(([id, story]) => {
      const prior = merged[id] || {};
      const cover = story.cover || prior.cover || '';
      const remotePages = Array.isArray(story.pages) ? story.pages : Object.values(story.pages || {});
      merged[id] = {
        ...prior,
        ...story,
        id,
        cover,
        coverBg: story.coverBg || prior.coverBg || '#150830',
        tag: story.tag || 'Criada pela IA',
        desc: story.desc || prior.desc || 'Uma história especial criada pela IA.',
        time: story.time || prior.time || `~${remotePages.length * 2} min`,
        mood: story.mood || prior.mood || 'Especial',
        isAI: true,
        pages: remotePages.length
          ? remotePages.map(page => ({ ...page, img: page.img || cover, text: page.text || '' }))
          : prior.pages || [],
        createdAt: story.createdAt || prior.createdAt || ''
      };
    });

    const deletedIds = new Set([...localDeleted, ...Object.keys(remoteDeleted || {})].map(String));
    deletedIds.forEach(id => delete merged[id]);
    const entries = Object.values(merged);
    try { localStorage.setItem('luani_ai_stories', JSON.stringify(entries)); } catch {}
    const result = {};
    entries.forEach(story => { result[story.id] = story; });
    cb(result);
  };

  if (DB) {
    Promise.all([
      DB.ref('ai_stories').once('value'),
      DB.ref('ai_story_deletions').once('value')
    ]).then(([storiesSnap, deletedSnap]) => {
      deliver(storiesSnap.val() || {}, deletedSnap.val() || {});
    }).catch(() => deliver());
    return;
  }
  deliver();
}

function getSavedLocalStories() {
  try {
    const arr = JSON.parse(localStorage.getItem('luani_ai_stories') || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

async function deleteSavedStoryDB(id, story = null) {
  id = String(id);
  const stored = getSavedLocalStories().find(item => String(item.id) === id);
  const storyToDelete = story || stored || {};
  const pageCount = Array.isArray(storyToDelete.pages) ? storyToDelete.pages.length : 0;
  try {
    localStorage.setItem('luani_ai_stories', JSON.stringify(
      getSavedLocalStories().filter(item => String(item.id) !== id)
    ));
    const deleted = JSON.parse(localStorage.getItem('luani_ai_story_deletions') || '[]');
    if (!deleted.map(String).includes(id)) deleted.push(id);
    localStorage.setItem('luani_ai_story_deletions', JSON.stringify(deleted));
  } catch {}

  const cleanup = [];
  if (DB) {
    cleanup.push(DB.ref(`ai_stories/${id}`).remove());
    cleanup.push(DB.ref(`ai_story_deletions/${id}`).set({ deletedAt: new Date().toISOString() }));
    cleanup.push(DB.ref(`recorded/${id}`).remove());
  }
  for (let pageIndex = 0; pageIndex <= pageCount; pageIndex++) {
    localStorage.removeItem(`voice_${id}_${pageIndex}`);
    localStorage.setItem(`voice_removed_${id}_${pageIndex}`, '1');
    if (typeof deleteAudioIndex === 'function') deleteAudioIndex(id, pageIndex);
    if (typeof invalidateVoiceCache === 'function') invalidateVoiceCache(id, pageIndex);
    if (typeof deleteVoiceStorage === 'function') cleanup.push(deleteVoiceStorage(id, pageIndex));
  }
  await Promise.allSettled(cleanup);
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
    el.replaceChildren();
    if (!entries.length) { el.textContent = 'Nenhuma ainda'; return; }
    entries.forEach(([id, story]) => {
      const item = document.createElement('div');
      item.className = 'ap-item ap-story-item';
      const title = document.createElement('span');
      title.className = 'ap-story-title';
      const icon = document.createElement('i');
      icon.className = 'fas fa-wand-magic-sparkles';
      const name = document.createElement('strong');
      name.textContent = story.title || 'Sem título';
      title.append(icon, name);
      const remove = document.createElement('button');
      remove.className = 'ap-delete';
      remove.type = 'button';
      remove.title = 'Apagar história';
      remove.setAttribute('aria-label', `Apagar ${story.title || 'história'}`);
      remove.innerHTML = '<i class="fas fa-trash"></i>';
      remove.addEventListener('click', () => deleteAdminAIStory(id, story));
      item.append(title, remove);
      el.appendChild(item);
    });
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
