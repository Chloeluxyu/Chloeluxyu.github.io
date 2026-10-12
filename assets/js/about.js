// Life in Moments: floating bubbles that open a photo gallery.
// To move or add a photo, edit the lists below (files live in assets/moments/).
(function () {
  const G = {
    travel:      { emoji: '🌏', title: 'Travel', photos: [['travel-tokyo','Tokyo Tower at night'],['travel-mural','In front of a tile mural'],['travel-glacier','A glacier river in Norway'],['travel-waterfall','A waterfall in the Norwegian mountains'],['travel-fuji','A street with Mount Fuji behind it']] },
    events:      { emoji: '🎫', title: 'Events', photos: [['events-concert','At a concert'],['events-market','At a vintage market']] },
    music:       { emoji: '🎶', title: 'Music', photos: [['music-kid','Playing piano as a child'],['music-sunset','A piano at sunset'],['music-window','A piano by the window']] },
    photography: { emoji: '📸', title: 'Photography', photos: [['photo-street','A street in Stockholm'],['photo-roses','Paper roses in a window'],['photo-yellow','Golden hour portrait'],['photo-crosswalk','A crosswalk in Stockholm']] },
    ocean:       { emoji: '🌊', title: 'Ocean', photos: [['ocean-boards','Paddle boards at sunrise'],['ocean-cactus','A cliff above the sea'],['ocean-lake','Swans on a lake'],['ocean-beach','A beach in Barcelona']] }
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
