// Project pages: highlight the current section in the section bar, and a back-to-top button.
(function () {
  const bar = document.querySelector('.chapters');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const links = bar ? [...bar.querySelectorAll('a[href^="#"]')] : [];
  const targets = links.map(a => document.getElementById(a.getAttribute('href').slice(1)));

  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY;
    // current section = the last one whose top has passed just under the sticky bar
    let cur = 0;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= 110) cur = i; });
    if (y < 80) cur = 0;
    links.forEach((a, i) => {
      const on = i === cur;
      if (a.classList.contains('on') !== on) a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    const inner = bar && bar.querySelector('.chapters-in'), act = links[cur];
    if (inner && act && inner.scrollWidth > inner.clientWidth) {
      const want = act.offsetLeft - (inner.clientWidth - act.offsetWidth) / 2;
      if (Math.abs(inner.scrollLeft - want) > 40) inner.scrollTo({ left: want, behavior: reduce ? 'auto' : 'smooth' });
    }
    if (top) top.classList.toggle('show', y > 700);
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  const top = document.createElement('button');
  top.type = 'button'; top.className = 'to-top'; top.setAttribute('aria-label', 'Back to the top');
  top.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  document.body.appendChild(top);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// Phones: long secondary blocks (marked data-collapse) fold up behind a "Show more" button.
(function () {
  const mq = matchMedia('(max-width: 720px)');
  function setup() {
    if (!mq.matches) return;
    document.querySelectorAll('[data-collapse]:not([data-collapse-ready])').forEach((el, i) => {
      if (el.scrollHeight < 560) return;
      el.setAttribute('data-collapse-ready', '1');
      const box = document.createElement('div'); box.className = 'collapsible is-collapsed';
      const body = document.createElement('div'); body.className = 'collapsible-body'; body.id = 'collapse-' + i;
      el.parentNode.insertBefore(box, el); body.appendChild(el); box.appendChild(body);
      const label = el.getAttribute('data-collapse') || 'Show more';
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'collapse-btn';
      btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', body.id);
      btn.innerHTML = '<span>' + label + '</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      btn.addEventListener('click', () => {
        const open = box.classList.toggle('is-collapsed') === false;
        btn.setAttribute('aria-expanded', String(open));
        btn.firstChild.textContent = open ? 'Show less' : label;
        btn.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
        if (!open) box.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
      box.appendChild(btn);
    });
  }
  window.addEventListener('load', setup);
  if (document.readyState === 'complete') setup();
})();
