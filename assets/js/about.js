// Interests board: tap an interest to open a photo carousel.
// To add or swap photos, edit the lists below (files live in assets/interests/).
(function () {
  const G = {
    nature:        { title: 'Nature',        n: 5,  alt: 'Out in nature' },
    'hello-kitty': { title: 'Hello Kitty',   n: 7,  alt: 'Hello Kitty and cosy moments' },
    building:      { title: 'Building stuff', alt: 'Building a prototype', projects: [
      { name: 'BoogieBot, a study-break robot', files: [16,17,12,8,5],
        desc: 'A disco-dressed robot that demonstrates exercises during study breaks. In a study with 22 students, those who saw it move reported being more active (4.0 vs 2.8 out of 5) and rated the experience higher. The sample was small, so we treat it as a signal, not proof. My part: I wrote the code, found and 3D-printed the robot body, moderated most sessions and analysed the UEQ-S results.' },
      { name: 'Social tamagotchi', files: [19,20,21,1,22,23],
        desc: 'A tamagotchi-like pendant: you set your interests, and when you pass someone with the same ones it sounds and notifies you, so you can start a conversation at university social events.' },
      { name: 'IKEA VAPPEBY redesign', files: [15,2,4,6,9,13],
        desc: 'A circular redesign of the IKEA VAPPEBY speaker, so it is easier to repair, maintain and recycle.' }
    ] },
    matcha:        { title: 'Matcha',        n: 9,  alt: 'Matcha and café moments' },
    music:         { title: 'Music',         n: 6,  alt: 'Playing and watching music' },
    'take-photo':  { title: 'Taking photos', n: 6,  alt: 'Photos I took' },
    fashion:       { title: 'Fashion',       n: 9,  alt: 'Fashion and thrifting' },
    dogs:          { title: 'Dogs',          n: 8,  alt: 'Dogs I met' },
    enfj:          { title: 'ENFJ-A',        n: 3,  alt: 'Out and about' },
    ocean:         { title: 'Ocean',         n: 6,  alt: 'By the water' }
  };
  // Slots that are videos, not photos: 'key-n' -> assets/interests/key-n.mp4 (the .jpg is the poster frame).
  const VIDEOS = new Set(['building-17']);
  const panel = document.getElementById('carousel');
  if (!panel) return;
  const track = document.getElementById('c-track'), title = document.getElementById('c-title'), count = document.getElementById('c-count');
  const shuffle = document.getElementById('c-shuffle'), desc = document.getElementById('c-desc');
  const prev = panel.querySelector('.c-prev'), next = panel.querySelector('.c-next');
  const btns = [...document.querySelectorAll('.int[data-key]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opener = null;

  const slides = () => [...track.children];
  const current = () => {
    const c = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bd = 1e9;
    slides().forEach((f, i) => { const d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - c); if (d < bd) { bd = d; best = i; } });
    return best;
  };
  const update = () => {
    const i = current(), n = slides().length;
    count.textContent = (i + 1) + ' / ' + n;
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  const go = (dir) => {
    const s = slides(), i = Math.max(0, Math.min(s.length - 1, current() + dir)), f = s[i];
    track.scrollTo({ left: f.offsetLeft - (track.clientWidth - f.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  };

  let lastProject = -1;
  function open(key, btn, auto) {
    const g = G[key]; if (!g) return;
    opener = btn; track.textContent = '';
    let files, caption = '', blurb = '';
    const multi = !!g.projects;
    if (multi) {
      // one random project per visit, never the same one twice in a row
      let i; do { i = Math.floor(Math.random() * g.projects.length); } while (i === lastProject && g.projects.length > 1);
      lastProject = i; const p = g.projects[i];
      files = p.files; caption = p.name; blurb = p.desc || ''; title.textContent = g.title + ': ' + p.name;
    } else {
      files = Array.from({ length: g.n }, (_, i) => i + 1); title.textContent = g.title;
    }
    desc.textContent = blurb; desc.hidden = !blurb;
    panel.classList.toggle('multi', multi); shuffle.hidden = !multi; shuffle.dataset.key = key;
    files.forEach((n, i) => {
      const fig = document.createElement('figure'), base = 'assets/interests/' + key + '-' + n;
      const label = (caption || g.alt) + ', ' + (VIDEOS.has(key + '-' + n) ? 'video' : 'photo') + ' ' + (i + 1) + ' of ' + files.length;
      if (VIDEOS.has(key + '-' + n)) {
        const v = document.createElement('video');
        v.src = base + '.mp4'; v.poster = base + '.jpg'; v.controls = true; v.muted = true; v.loop = true;
        v.playsInline = true; v.preload = 'metadata'; v.setAttribute('aria-label', label);
        v.addEventListener('loadedmetadata', () => { update(); });
        v.addEventListener('play', () => fig.classList.add('playing'));
        v.addEventListener('pause', () => fig.classList.remove('playing'));
        v.addEventListener('ended', () => fig.classList.remove('playing'));
        fig.classList.add('is-video'); fig.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = base + '.jpg'; img.alt = label;
        img.loading = i > 3 ? 'lazy' : 'eager'; img.decoding = 'async';
        img.addEventListener('load', () => { if (img.naturalHeight < 450) img.style.height = Math.min(400, img.naturalHeight * 2) + 'px'; update(); });
        fig.appendChild(img);
      }
      track.appendChild(fig);
    });
    track.scrollLeft = 0;
    btns.forEach(b => b.setAttribute('aria-expanded', String(b === btn)));
    panel.hidden = false; panel.classList.remove('in'); void panel.offsetWidth; panel.classList.add('in');
    update();
    if (!auto) panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }
  function pauseAll() { track.querySelectorAll('video').forEach(v => v.pause()); }
  function close() {
    pauseAll();
    const wasAuto = !opener || opener.dataset.auto === '1';
    panel.hidden = true; btns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (opener && !wasAuto) opener.focus();
  }
  btns.forEach(b => b.addEventListener('click', () => { delete b.dataset.auto; open(b.dataset.key, b); }));
  // Recruiters first: land on a random 'building stuff' project, without scrolling or stealing focus.
  const first = btns.find(b => b.dataset.key === 'building');
  if (first) { first.dataset.auto = '1'; open('building', first, true); }
  shuffle.addEventListener('click', () => open(shuffle.dataset.key, opener));
  // The badge behind the photo: open a random interest (never the one already showing).
  const surprise = document.querySelector('.surprise');
  if (surprise) surprise.addEventListener('click', () => {
    const pool = btns.filter(b => b !== opener || panel.hidden);
    const b = pool[Math.floor(Math.random() * pool.length)];
    if (b) b.click();
  });
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', update, { passive: true });
  track.addEventListener('load', update, true);
  window.addEventListener('resize', update);
  panel.querySelector('.c-close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (panel.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
})();
