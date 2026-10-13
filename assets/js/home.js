// Homepage enhancements. The page is fully usable without this file.
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) Gentle cursor-follow for the sparkles in the hero
  const stage = document.querySelector('.stage');
  const sparks = document.querySelectorAll('.spark');
  if (stage && sparks.length && !reduce && matchMedia('(pointer: fine)').matches) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      sparks.forEach((s, i) => { const k = i ? -26 : 34; s.style.transform = `translate(${x * k}px, ${y * k}px) rotate(${x * 40}deg)`; });
    });
  }

  // 2) Horizontal timeline: arrow buttons scroll one card at a time
  const sc = document.querySelector('.tl-scroll');
  const prev = document.querySelector('.tl-prev'), next = document.querySelector('.tl-next');
  if (sc && prev && next) {
    const items = [...sc.querySelectorAll('.tl-item')];
    const pad = () => parseFloat(getComputedStyle(sc).scrollPaddingLeft) || 0;
    const target = (dir) => {
      const here = sc.scrollLeft, snaps = items.map(i => Math.max(0, i.offsetLeft - pad()));
      return dir > 0 ? (snaps.find(x => x > here + 8) ?? sc.scrollWidth) : ([...snaps].reverse().find(x => x < here - 8) ?? 0);
    };
    const go = (dir) => sc.scrollTo({ left: target(dir), behavior: reduce ? 'auto' : 'smooth' });
    const update = () => { prev.disabled = sc.scrollLeft < 4; next.disabled = sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 4; };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    sc.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update); update();
  }
})();
