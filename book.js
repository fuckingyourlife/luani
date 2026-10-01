// ================================================================
// BOOK ENGINE — Abordagem simples e funcional
//
// Estrutura: um único "page-display" div que troca o conteúdo
// com animação CSS flip. Sem folhas empilhadas, sem z-index hell.
// A animação de virada é visual (CSS keyframes) mas o CONTEÚDO
// é trocado diretamente no DOM — garantindo que a página certa
// aparece sempre.
// ================================================================

let currentStory = null;
let currentPage  = 0;   // 0 = cover
let totalPages   = 0;
let isTurning    = false;
let isAIStory    = false;

// ----------------------------------------------------------------
// OPEN
// ----------------------------------------------------------------
function openReader(story, fromAI = false) {
  currentStory = story;
  isAIStory    = fromAI;
  currentPage  = 0;
  totalPages   = story.pages.length;
  isTurning    = false;

  narratorStop();
  playSound('open');

  // Mark as read
  markStoryRead(story.id, story.title);

  // Save button visibility
  const sb = document.getElementById('saveBtn');
  if (sb) {
    const alreadySaved = getSavedLocalStories().some(saved => saved.id === story.id);
    sb.style.display = fromAI && !alreadySaved ? 'flex' : 'none';
  }

  document.getElementById('rdrTitle').textContent = story.title;

  renderPage(0, 'none');
  buildTOC();
  buildDots();
  updateNav();

  document.getElementById('readerOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ----------------------------------------------------------------
// CLOSE
// ----------------------------------------------------------------
function closeReader() {
  narratorStop();
  document.getElementById('readerOverlay').classList.remove('active');
  document.getElementById('tocPanel').classList.remove('open');
  document.body.style.overflow = '';
  playSound('click');
}

// ----------------------------------------------------------------
// RENDER PAGE — puts HTML into the display div, plays flip anim
// dir: 'none' | 'forward' | 'backward'
// ----------------------------------------------------------------
function renderPage(pageIndex, dir) {
  const display = document.getElementById('pageDisplay');
  const spine   = document.getElementById('bookSpine');

  // Build HTML for this page
  const html = pageIndex === 0
    ? buildCoverHTML()
    : buildContentHTML(pageIndex - 1);

  if (dir === 'none') {
    display.innerHTML = html;
    return;
  }

  // Add exit animation class to current content
  const exitClass = dir === 'forward' ? 'flip-exit-fwd' : 'flip-exit-bwd';
  const enterClass = dir === 'forward' ? 'flip-enter-fwd' : 'flip-enter-bwd';

  display.classList.add(exitClass);

  setTimeout(() => {
    display.innerHTML = html;
    display.classList.remove(exitClass);
    display.classList.add(enterClass);

    // Spine color pulse
    spine.classList.add('spine-active');
    setTimeout(() => {
      display.classList.remove(enterClass);
      spine.classList.remove('spine-active');
    }, 350);
  }, 180);
}

// ----------------------------------------------------------------
// COVER HTML
// ----------------------------------------------------------------
function buildCoverHTML() {
  const s = currentStory;
  const isSpecial = s.tag === 'Nossa História';
  const isAI      = s.tag === 'Criada pela IA';
  const isOrig    = s.tag === 'Original Felipe';

  const tagIcon = isSpecial ? 'fa-heart'
                : isAI      ? 'fa-wand-magic-sparkles'
                : isOrig    ? 'fa-pen-nib'
                : 'fa-crown';

  const stars = isSpecial
    ? '♥ ♥ ♥ ♥ ♥'
    : '★ ★ ★ ★ ★';

  const sub = isSpecial
    ? 'uma história real de Felipe & Luani 💜'
    : 'narrado com amor pelo Felipe';

  const extraClass = isSpecial ? ' nossa' : '';

  return `
    <div class="pg-cover${extraClass}" style="background:${s.coverBg||'#1a0533'}">
      <img src="${s.cover}" alt="${s.title}" class="pg-cover-img"
           onerror="this.style.display='none'"/>
      <div class="pg-cover-overlay">
        <div class="pg-cover-tag"><i class="fas ${tagIcon}"></i> ${s.tag||'Clássico'}</div>
        <h2 class="pg-cover-title">${s.title}</h2>
        <p class="pg-cover-sub">${sub}</p>
        <div class="pg-cover-stars">${stars}</div>
        <p class="pg-cover-hint"><i class="fas fa-chevron-right"></i> Toque para começar</p>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------
// CONTENT PAGE HTML
// ----------------------------------------------------------------
function buildContentHTML(idx) {
  const page = currentStory.pages[idx];
  if (!page) return '<div class="pg-end"><p>Fim da história 🌙</p></div>';

  const paragraphs = page.text.trim().split('\n\n')
    .map(p => `<p>${p.trim()}</p>`).join('');

  return `
    <div class="pg-content">
      <div class="pg-header">
        <span class="pg-story-name">${currentStory.title}</span>
        <span class="pg-num">${idx + 1} / ${totalPages}</span>
      </div>
      ${page.img ? `
        <div class="pg-img-wrap">
          <img src="${page.img}" alt="${page.title}" class="pg-img"
               onerror="this.parentElement.style.display='none'"/>
          ${page.imgCredit ? `<span class="pg-img-credit">${page.imgCredit}</span>` : ''}
        </div>
      ` : ''}
      <h3 class="pg-chapter">${page.title}</h3>
      <div class="pg-text">${paragraphs}</div>
      <div class="pg-footer">· · ·</div>
    </div>
  `;
}

// ----------------------------------------------------------------
// NAVIGATION
// ----------------------------------------------------------------
function nextPage() {
  if (isTurning) return;
  if (currentPage >= totalPages) return;
  isTurning = true;
  narratorStop();
  playSound('page');

  currentPage++;
  renderPage(currentPage, 'forward');
  updateNav();
  buildDots();

  setTimeout(() => {
    isTurning = false;
    if (currentPage > 0) startNarrator();
  }, 400);
}

function prevPage() {
  if (isTurning) return;
  if (currentPage <= 0) return;
  isTurning = true;
  narratorStop();
  playSound('page');

  currentPage--;
  renderPage(currentPage, 'backward');
  updateNav();
  buildDots();

  setTimeout(() => { isTurning = false; }, 400);
}

function goToPage(idx) {
  if (idx === currentPage) { toggleTOC(); return; }
  narratorStop();
  const dir = idx > currentPage ? 'forward' : 'backward';
  currentPage = idx;
  renderPage(currentPage, dir);
  updateNav();
  buildDots();
  buildTOC();
  toggleTOC();
  setTimeout(() => { if (currentPage > 0) startNarrator(); }, 400);
}

function updateNav() {
  document.getElementById('prevBtn').disabled = currentPage <= 0;
  document.getElementById('nextBtn').disabled = currentPage >= totalPages;
  document.getElementById('pageLabel').textContent =
    currentPage === 0 ? 'Capa' : `${currentPage} / ${totalPages}`;
  // Atualiza ícone do mic (gravado ou não)
  updateRecordBtn();
  // Atualiza label do modal de gravação se estiver aberto
  const lbl = document.getElementById('prPageLabel');
  if (lbl && currentStory) {
    lbl.textContent = currentPage === 0
      ? `Capa — ${currentStory.title}`
      : `Página ${currentPage} de ${totalPages} — ${currentStory.pages[currentPage-1]?.title || ''}`;
  }
}

// ----------------------------------------------------------------
// TOC
// ----------------------------------------------------------------
function buildTOC() {
  const list = document.getElementById('tocList');
  list.innerHTML = '';

  const addItem = (num, label, idx) => {
    const d = document.createElement('div');
    d.className = 'toc-item' + (currentPage === idx ? ' active' : '');
    d.innerHTML = `<span class="toc-n">${num}</span><span>${label}</span>`;
    d.onclick = () => goToPage(idx);
    list.appendChild(d);
  };

  addItem('◉', 'Capa', 0);
  currentStory.pages.forEach((p, i) => addItem(i + 1, p.title, i + 1));
}

function toggleTOC() {
  document.getElementById('tocPanel').classList.toggle('open');
}

// ----------------------------------------------------------------
// PAGE DOTS
// ----------------------------------------------------------------
function buildDots() {
  const wrap = document.getElementById('pdots');
  const max = Math.min(totalPages + 1, 9);
  wrap.innerHTML = '';
  for (let i = 0; i < max; i++) {
    const d = document.createElement('span');
    d.className = 'pdot' + (i === Math.min(currentPage, max - 1) ? ' active' : '');
    wrap.appendChild(d);
  }
}

// ----------------------------------------------------------------
// SAVE
// ----------------------------------------------------------------
function saveCurrentStory() {
  if (!currentStory) return;
  saveAIStoryDB(currentStory);
  playSound('save');
  showToast('História salva! 📚');
  renderStoryCards();
  renderSavedStories();

  const sb = document.getElementById('saveBtn');
  if (sb) sb.innerHTML = '<i class="fas fa-bookmark" style="color:#fbbf24"></i>';
}

// ----------------------------------------------------------------
// SWIPE
// ----------------------------------------------------------------
let _tx = 0;
document.getElementById('bookScene').addEventListener('touchstart', e => {
  _tx = e.changedTouches[0].clientX;
}, { passive: true });
document.getElementById('bookScene').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - _tx;
  if (Math.abs(dx) > 50) {
    if (dx < 0) nextPage();
    else prevPage();
  }
}, { passive: true });

// Keyboard
document.addEventListener('keydown', e => {
  if (!document.getElementById('readerOverlay').classList.contains('active')) return;
  if (e.key === 'ArrowRight') nextPage();
  if (e.key === 'ArrowLeft') prevPage();
  if (e.key === 'Escape') closeReader();
});

// Click outside TOC
document.getElementById('bookScene').addEventListener('click', () => {
  const toc = document.getElementById('tocPanel');
  if (toc.classList.contains('open')) toc.classList.remove('open');
});
