// Life in Moments: floating bubbles that open a photo gallery.
// To move or add a photo, edit the lists below (files live in assets/moments/).
(function () {
  const G = {
    travel:      { emoji: '🌏', title: 'Travel', photos: [['travel-1','At the Eiffel Tower in Paris'],['travel-2','In front of a large tile mural'],['travel-3','Tokyo Tower lit up at night'],['travel-4','At a glacier river in Norway']] },
    events:      { emoji: '🎫', title: 'Concerts', photos: [['events-1','Spotlights at a concert'],['events-2','A big stage show'],['events-3','Confetti falling at a concert'],['events-4','A performer on a purple-lit stage']] },
    music:       { emoji: '🎶', title: 'Music', photos: [['music-1','Playing a grand piano on stage'],['music-2','Dancing in a group performance'],['music-3','Playing piano as a child'],['music-4','A piano by a window at sunset']] },
    photography: { emoji: '📸', title: 'Photography', photos: [['photography-1','A street with Mount Fuji behind it'],['photography-2','A phone filming a pink sunset from a car'],['photography-3','Two trams by the sea'],['photography-4','A city skyline at sunset over ice']] },
    ocean:       { emoji: '🌊', title: 'Ocean', photos: [['ocean-1','A ferry and seagulls at sea'],['ocean-2','Paddle boards on a beach at dawn'],['ocean-3','The sea seen from a cliff path'],['ocean-4','Turquoise water on a beach']] }
  };
  const panel = document.getElementById('gallery');
  if (!panel) return;
  const row = document.getElementById('g-row'), title = document.getElementById('g-title'), emoji = document.getElementById('g-emoji');
  const bubbles = [...document.querySelectorAll('.bubble')];
  let opener = null;
  function open(key, btn) {
    const g = G[key]; if (!g) return;
    opener = btn; emoji.textContent = g.emoji; title.textContent = g.title; row.textContent = '';
    g.photos.forEach(([f, alt]) => {
      const fig = document.createElement('figure'); const img = document.createElement('img');
      img.src = 'assets/moments/' + f + '.jpg'; img.alt = alt; img.loading = 'lazy'; img.decoding = 'async';
      fig.appendChild(img); row.appendChild(fig);
    });
    bubbles.forEach(b => b.setAttribute('aria-expanded', String(b === btn)));
    panel.hidden = false; panel.classList.remove('in'); void panel.offsetWidth; panel.classList.add('in');
    panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }
  function close() {
    panel.hidden = true; bubbles.forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (opener) opener.focus();
  }
  bubbles.forEach(b => b.addEventListener('click', () => open(b.dataset.key, b)));
  panel.querySelector('.g-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
})();
