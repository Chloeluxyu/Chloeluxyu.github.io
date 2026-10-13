// Mobile menu: adds a toggle button to the main nav. The links work without this file.
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const list = nav.querySelector('ul');
  if (!list) return;
  list.id = list.id || 'site-menu';
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'nav-toggle'; btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', list.id); btn.setAttribute('aria-label', 'Open menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.insertBefore(btn, list);
  nav.classList.add('has-js');
  const set = (open) => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); set(!nav.classList.contains('open')); });
  list.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); } });
  matchMedia('(min-width: 761px)').addEventListener('change', (m) => { if (m.matches) set(false); });
})();
