// ================================================================
// CLOUD STORAGE — Cloudinary (100% gratuito, sem cartão)
//
// COMO CONFIGURAR (5 minutos):
//
//   1. Acesse https://cloudinary.com e crie conta grátis
//      (pode usar Google ou email — SEM cartão de crédito)
//
//   2. No painel, vá em:
//      Settings (engrenagem) → Upload → Upload presets → Add upload preset
//      - Preset name: luani-voices
//      - Signing mode: UNSIGNED  ← muito importante
//      - Folder: voices
//      - Clique em Save
//
//   3. Copie seu Cloud Name no canto superior esquerdo do painel
//
//   4. Substitua os valores abaixo:
// ================================================================

const CLOUDINARY_CONFIG = {
  cloudName:    'sow77i00',   // ex: 'dxyz123abc'
  uploadPreset: 'luani-voices',     // nome do preset que você criou
};

// Detecta se está configurado
function cloudinaryOK() {
  return CLOUDINARY_CONFIG.cloudName !== 'SEU_CLOUD_NAME';
}

// ── Upload de áudio ───────────────────────────────────────────────
// Retorna a URL pública do arquivo no Cloudinary
async function cloudUploadAudio(blob, storyId, pageIndex) {
  if (!cloudinaryOK()) throw new Error('Cloudinary não configurado');

  const formData = new FormData();
  formData.append('file', blob, `voice_${storyId}_${pageIndex}.webm`);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('public_id', `voices/${storyId}/${pageIndex}`);
  formData.append('resource_type', 'video'); // Cloudinary usa "video" para áudio

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.secure_url; // URL pública permanente
}

// ── Busca URL pública de um áudio já gravado ──────────────────────
function cloudGetURL(storyId, pageIndex) {
  if (!cloudinaryOK()) return null;
  const { cloudName } = CLOUDINARY_CONFIG;
  // URL determinística — se o arquivo existe, este endereço funciona
  return `https://res.cloudinary.com/${cloudName}/video/upload/voices/${storyId}/${pageIndex}.webm`;
}

// ── Salvar registro local das URLs ────────────────────────────────
// Guarda no localStorage um índice de quais páginas têm áudio
function saveAudioIndex(storyId, pageIndex, url) {
  try {
    const idx = JSON.parse(localStorage.getItem('audio_index') || '{}');
    if (!idx[storyId]) idx[storyId] = {};
    idx[storyId][pageIndex] = url;
    localStorage.setItem('audio_index', JSON.stringify(idx));
  } catch {}
}

function getAudioIndex(storyId, pageIndex) {
  try {
    const idx = JSON.parse(localStorage.getItem('audio_index') || '{}');
    return idx[storyId]?.[pageIndex] || null;
  } catch { return null; }
}

function deleteAudioIndex(storyId, pageIndex) {
  try {
    const idx = JSON.parse(localStorage.getItem('audio_index') || '{}');
    if (idx[storyId]) delete idx[storyId][pageIndex];
    localStorage.setItem('audio_index', JSON.stringify(idx));
  } catch {}
}
