// ================================================================
// MAIN — Init, cards, saved, toast, admin
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderNossasHistorias();
  renderStoryCards();
  renderSavedStories();
  initReveal();
  getAIStoriesDB(() => {
    renderStoryCards();
    renderSavedStories();
  });
});

// ----------------------------------------------------------------
// PARTICLES
// ----------------------------------------------------------------
function createParticles() {
  const c = document.getElementById('particles');
  const colors = ['#a855f7','#e879f9','#818cf8','#c084fc','#fde68a','#f0abfc'];
  for (let i = 0; i < 55; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = Math.random() * 3 + 1;
    const cl = colors[i % colors.length];
    Object.assign(p.style, {
      width: sz + 'px', height: sz + 'px',
      left: (Math.random() * 100) + '%',
      animationDelay: (Math.random() * 20) + 's',
      animationDuration: (Math.random() * 12 + 8) + 's',
      background: cl,
      boxShadow: `0 0 ${sz * 4}px ${cl}`
    });
    c.appendChild(p);
  }
}

// ----------------------------------------------------------------
// RENDER NOSSAS HISTÓRIAS (seção especial no topo)
// ----------------------------------------------------------------
function renderNossasHistorias() {
  const grid = document.getElementById('nossaGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const nossas = STORIES.filter(s => s.tag === 'Nossa História');
  nossas.forEach((s, i) => {
    const card = makeCard(s, false);
    card.style.animationDelay = (i * 0.1) + 's';
    grid.appendChild(card);
  });
}

// ----------------------------------------------------------------
// RENDER STORY CARDS (só clássicos e originais)
// ----------------------------------------------------------------
function renderStoryCards() {
  const grid = document.getElementById('storiesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const outros = STORIES.filter(s => s.tag !== 'Nossa História');
  const generated = getSavedLocalStories().filter(s => s.isAI || s.tag === 'Criada pela IA');
  [...outros, ...generated].forEach((s, i) => {
    const card = makeCard(s, false);
    card.style.animationDelay = (i * 0.06) + 's';
    grid.appendChild(card);
  });
}

function renderSavedStories() {
  const section = document.getElementById('savedSection');
  if (section) section.style.display = 'none';
}

function makeCard(s, isSaved) {
  const card = document.createElement('div');
  const isSpecial = s.tag === 'Nossa História';
  const isAlt     = s.tag === 'Original Felipe' || s.tag === 'Criada pela IA';
  card.className  = 'story-card' + (isSpecial ? ' nossa-historia' : '');

  const tagCls  = isSpecial ? 'sc-tag special' : isAlt ? 'sc-tag alt' : 'sc-tag';
  const tagIcon = s.tag === 'Criada pela IA'   ? 'fa-wand-magic-sparkles'
                : s.tag === 'Original Felipe'  ? 'fa-pen-nib'
                : s.tag === 'Nossa História'   ? 'fa-heart'
                : 'fa-crown';

  card.innerHTML = `
    <div class="sc-glow"></div>
    <div class="${tagCls}">
      <i class="fas ${tagIcon}"></i> ${s.tag}
      ${s.createdAt ? `<span class="sc-date">${s.createdAt}</span>` : ''}
    </div>
    <div class="sc-img-wrap">
      <img src="${s.cover}" alt="${s.title}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
      <div class="sc-img-fb" style="background:${s.coverBg||'#1a0533'};display:none">
        <i class="fas fa-book"></i>
      </div>
    </div>
    <div class="sc-body">
      <div class="sc-title">${s.title}</div>
      <div class="sc-desc">${s.desc}</div>
      <div class="sc-meta">
        <span><i class="fas fa-clock"></i> ${s.time}</span>
        <span><i class="fas fa-moon"></i> ${s.mood}</span>
      </div>
      <button class="sc-btn"><i class="fas fa-book-open"></i> Abrir e ouvir</button>
      ${isSaved ? `<button class="sc-del"><i class="fas fa-trash"></i></button>` : ''}
    </div>
  `;

  card.querySelector('.sc-btn').addEventListener('click', e => {
    e.stopPropagation();
    playSound('click');
    openReader(s, !!s.isAI);
  });

  if (isSaved) {
    card.querySelector('.sc-del').addEventListener('click', e => {
      e.stopPropagation();
      playSound('click');
      deleteSavedStoryDB(s.id);
      renderSavedStories();
      showToast('Removida!');
    });
  }

  // Mouse glow
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });

  return card;
}

// ----------------------------------------------------------------
// SCROLL REVEAL
// ----------------------------------------------------------------
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('.story-card, .message-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
    obs.observe(el);
  });
}

// ----------------------------------------------------------------
// ADMIN PANEL
// ----------------------------------------------------------------
let adminOpen = false;
function toggleAdminPanel() {
  adminOpen = !adminOpen;
  const panel = document.getElementById('adminPanel');
  panel.classList.toggle('open', adminOpen);
  if (adminOpen) { loadAdminData(); playSound('click'); }
}

async function deleteAdminAIStory(id, story) {
  if (!checkPin()) return;
  if (!confirm(`Apagar a história “${story.title || 'Sem título'}”?`)) return;

  await deleteSavedStoryDB(id, story);
  renderStoryCards();
  renderSavedStories();
  loadAdminData();
  showToast('História apagada do feed.');
}

// ----------------------------------------------------------------
// TOAST
// ----------------------------------------------------------------
function showToast(msg, ms = 2800) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = 'toast show';
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), ms);
}

// ----------------------------------------------------------------
// SMOOTH SCROLL
// ----------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});
