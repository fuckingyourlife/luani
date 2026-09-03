// ================================================================
// AI STORY GENERATOR — Pollinations AI (gratuito, sem chave)
// ================================================================

let aiTheme  = 'fantasia e magia';
let aiLength = 'media';

document.addEventListener('DOMContentLoaded', () => {
  // Theme chips
  document.querySelectorAll('#themeChips .chip').forEach(c => {
    c.addEventListener('click', () => {
      document.querySelectorAll('#themeChips .chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      aiTheme = c.dataset.v;
      playSound('click');
    });
  });

  // Length buttons
  document.querySelectorAll('.len-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.len-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      aiLength = b.dataset.v;
      playSound('click');
    });
  });
});

// ----------------------------------------------------------------
// OPEN / CLOSE
// ----------------------------------------------------------------
function openAIGenerator() {
  document.getElementById('aiModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  showAIForm();
}
function closeAIGenerator() {
  document.getElementById('aiModal').classList.remove('active');
  document.body.style.overflow = '';
  showAIForm();
}
document.getElementById('aiModal').addEventListener('click', function(e) {
  if (e.target === this) closeAIGenerator();
});

function showAIForm() {
  document.getElementById('aiForm').style.display = 'block';
  document.getElementById('aiLoading').style.display = 'none';
}
function showAILoading() {
  document.getElementById('aiForm').style.display = 'none';
  document.getElementById('aiLoading').style.display = 'flex';
}

// ----------------------------------------------------------------
// GENERATE
// ----------------------------------------------------------------
async function generateStory() {
  const protag = (document.getElementById('aiProtag').value.trim() || 'Luani');
  const extra  = document.getElementById('aiExtra').value.trim();
  const pages  = aiLength === 'curta' ? 4 : aiLength === 'media' ? 7 : 10;

  showAILoading();
  playSound('magic');

  const msgs = [
    'Escrevendo sua história...',
    'Criando personagens especiais...',
    'Tecendo a magia das palavras...',
    'Quase pronta, aguarda...',
    'Adicionando o toque do Felipe...'
  ];
  let mi = 0;
  const itv = setInterval(() => {
    document.getElementById('loadTxt').textContent = msgs[mi++ % msgs.length];
  }, 2200);

  try {
    const story = await callPollinationsAI(protag, aiTheme, extra, pages);
    clearInterval(itv);
    closeAIGenerator();
    setTimeout(() => { playSound('magic'); openReader(story, true); }, 200);
  } catch (err) {
    clearInterval(itv);
    console.warn('AI API error, using fallback:', err.message);
    const story = buildFallbackStory(protag, aiTheme, extra, pages);
    closeAIGenerator();
    setTimeout(() => { playSound('magic'); openReader(story, true); }, 200);
  }
}

// ----------------------------------------------------------------
// CALL POLLINATIONS
// ----------------------------------------------------------------
async function callPollinationsAI(protag, theme, extra, pageCount) {
  const prompt = `Você é Felipe, um contador de histórias romântico e poético. Crie uma história de ninar em português brasileiro para a Luani, sua ex-namorada que você ainda ama muito.

Dados:
- Protagonista: ${protag}
- Tema: ${theme}
${extra ? `- Elemento especial: ${extra}` : ''}
- Quantidade de páginas/capítulos: ${pageCount}
- Tom: suave, poético, que convide ao sono
- Última página: mensagem carinhosa do Felipe para a Luani

RESPONDA APENAS com JSON válido, sem markdown, sem explicações:
{"title":"...","desc":"...","pages":[{"title":"...","text":"..."},{"title":"...","text":"..."}]}`;

  const res = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'Você responde SOMENTE com JSON válido, sem texto adicional.' },
        { role: 'user', content: prompt }
      ],
      model: 'openai',
      seed: Math.floor(Math.random() * 99999),
      jsonMode: true
    })
  });

  if (!res.ok) throw new Error('HTTP ' + res.status);
  const text = await res.text();

  let data;
  try { data = JSON.parse(text); }
  catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('No JSON in response');
    data = JSON.parse(m[0]);
  }

  return formatAIStory(data, theme);
}

// ----------------------------------------------------------------
// FORMAT
// ----------------------------------------------------------------
function formatAIStory(data, theme) {
  const themeImgs = {
    'fantasia e magia':             'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/400px-Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    'aventura na floresta':         'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Dragon_Slayer_by_Howard_Pyle.jpg/400px-Dragon_Slayer_by_Howard_Pyle.jpg',
    'amor e romance suave':         'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Edmund_Blair_Leighton_-_The_Accolade.jpg/400px-Edmund_Blair_Leighton_-_The_Accolade.jpg',
    'mistério e segredos':          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Gustave_Dore_Sleeping_Beauty.jpg/400px-Gustave_Dore_Sleeping_Beauty.jpg',
    'viagem pelo espaço estrelado': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/400px-Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    'animais falantes na floresta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Little_Red_Riding_Hood_Rackham.jpg/400px-Little_Red_Riding_Hood_Rackham.jpg',
    'sereia e fundo do oceano':     'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Andersen_Mermaid_Vilhelm_Pedersen.jpg/400px-Andersen_Mermaid_Vilhelm_Pedersen.jpg',
    'castelo encantado e magia':    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Sleeping_beauty.jpg/400px-Sleeping_beauty.jpg',
    'fadas e duendes':              'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Sleeping_Beauty_good_fairy.jpg/400px-Sleeping_Beauty_good_fairy.jpg',
    'viagem no tempo':              'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Starry_Night_Over_the_Rhone.jpg/400px-Starry_Night_Over_the_Rhone.jpg'
  };
  const img = themeImgs[theme] || themeImgs['fantasia e magia'];

  return {
    id: 'ai_' + Date.now(),
    title: data.title || 'História Mágica',
    cover: img,
    coverBg: '#150830',
    tag: 'Criada pela IA',
    desc: data.desc || 'Uma história especial criada pelo Felipe IA para a Luani.',
    time: `~${Math.ceil((data.pages || []).length * 1.5)} min`,
    mood: 'Especial',
    pages: (data.pages || []).map(p => ({
      title: p.title || 'Capítulo',
      img,
      text: p.text || ''
    })),
    isAI: true,
    createdAt: new Date().toLocaleDateString('pt-BR')
  };
}

// ----------------------------------------------------------------
// FALLBACK local
// ----------------------------------------------------------------
function buildFallbackStory(protag, theme, extra, count) {
  const img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/400px-Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg';
  const el  = extra ? ` Havia algo especial naquele dia: ${extra}.` : '';

  const pages = [
    {
      title: 'O Começo da Jornada',
      img,
      text: `Era uma vez ${protag}, uma jovem de coração tão puro que as estrelas piscavam mais rápido quando ela olhava para o céu.\n\nNum mundo onde a magia existia nas coisas pequenas — no orvalho da manhã, no sussurro do vento, no sorriso dado sem razão — ela acordou numa manhã especial.${el}`
    },
    {
      title: 'A Descoberta',
      img,
      text: `${protag} descobriu que possuía um dom raro: cada coisa que ela tocava com amor se tornava um pouco mais bela. Flores floriam mais rápido. Pássaros cantavam mais suave.\n\nE ela aprendeu que a magia não estava no dom. Estava no amor que ela colocava em cada gesto.`
    },
    {
      title: 'O Encontro',
      img,
      text: `No meio do caminho, ela encontrou alguém que também procurava. Não um lugar — mas uma sensação de pertencer.\n\nE quando os dois se olharam, ambos sentiram que a jornada havia valido cada passo.`
    },
    {
      title: 'A Volta',
      img,
      text: `${protag} voltou diferente. Não mais agitada. Mais inteira.\n\nE aprendeu a coisa mais importante: a magia que procurava lá fora existia dentro dela o tempo todo.\n\nBoa noite, Luani. Eu te amo muito. Dorme bem.\n— Felipe 🌙`
    }
  ].slice(0, count);

  return {
    id: 'ai_' + Date.now(),
    title: `${protag} e o Mundo Mágico`,
    cover: img, coverBg: '#150830',
    tag: 'Criada pela IA',
    desc: `Uma história de ${theme} criada especialmente para a Luani.`,
    time: `~${count * 2} min`, mood: 'Especial',
    pages, isAI: true,
    createdAt: new Date().toLocaleDateString('pt-BR')
  };
}
