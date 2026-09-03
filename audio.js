// ================================================================
// SOUND ENGINE — Web Audio API (sem arquivos externos)
// ================================================================
const SFX = (() => {
  let ctx = null;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ruído de papel
  function page() {
    try {
      const c = ac();
      const dur = 0.32;
      const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
      const d   = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.04)) * 0.5;
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const f = c.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 0.7;
      const g = c.createGain();
      g.gain.setValueAtTime(0.55, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      src.connect(f); f.connect(g); g.connect(c.destination);
      src.start();
    } catch {}
  }

  // toque suave de botão
  function click() {
    try {
      const c = ac();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(520, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(180, c.currentTime + 0.07);
      g.gain.setValueAtTime(0.12, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.09);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.1);
    } catch {}
  }

  // acorde mágico
  function magic() {
    try {
      const c = ac();
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = 'sine'; o.frequency.value = freq;
        const t = c.currentTime + i * 0.07;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.10, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        o.connect(g); g.connect(c.destination);
        o.start(t); o.stop(t + 0.3);
      });
    } catch {}
  }

  // acorde de save
  function save() {
    try {
      const c = ac();
      [440, 554, 659].forEach((freq, i) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = 'triangle'; o.frequency.value = freq;
        const t = c.currentTime + i * 0.09;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.13, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        o.connect(g); g.connect(c.destination);
        o.start(t); o.stop(t + 0.36);
      });
    } catch {}
  }

  // abertura de livro (batida suave)
  function open() {
    try {
      const c = ac();
      [0, 0.06, 0.14].forEach((t, i) => {
        const b = c.createBuffer(1, c.sampleRate * 0.14, c.sampleRate);
        const d = b.getChannelData(0);
        for (let j = 0; j < d.length; j++) {
          d[j] = (Math.random() * 2 - 1) * Math.exp(-j / (c.sampleRate * 0.03)) * (0.35 - i * 0.08);
        }
        const s = c.createBufferSource(); s.buffer = b;
        const g = c.createGain(); g.gain.value = 0.45;
        s.connect(g); g.connect(c.destination);
        s.start(c.currentTime + t);
      });
    } catch {}
  }

  // sino do narrador
  function narr() {
    try {
      const c = ac();
      [261, 329, 392].forEach((freq, i) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = 'sine'; o.frequency.value = freq;
        const t = c.currentTime + i * 0.09;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.07, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        o.connect(g); g.connect(c.destination);
        o.start(t); o.stop(t + 0.44);
      });
    } catch {}
  }

  return { page, click, magic, save, open, narr };
})();

function playSound(type) {
  switch (type) {
    case 'page':   SFX.page();   break;
    case 'click':  SFX.click();  break;
    case 'magic':  SFX.magic();  break;
    case 'save':   SFX.save();   break;
    case 'open':   SFX.open();   break;
    case 'narr':   SFX.narr();   break;
  }
}
