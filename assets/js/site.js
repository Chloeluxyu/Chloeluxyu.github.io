// Chloe Lu portfolio – small enhancements. The pages work without this file.

// 1) Scene videos: play only while visible (saves battery and bandwidth).
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const videos = document.querySelectorAll('.scene video');
  if (!videos.length || reduce || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
    });
  }, { threshold: 0.35 });
  videos.forEach((v) => io.observe(v));
})();

// 2) Full demo video: set data-src on #demo to a YouTube or Vimeo EMBED url, e.g.
//    https://www.youtube.com/embed/VIDEO_ID   or   https://player.vimeo.com/video/VIDEO_ID
(function () {
  const slot = document.getElementById('demo');
  if (!slot) return;
  const src = (slot.getAttribute('data-src') || '').trim();
  if (!src) return;
  const frame = document.createElement('iframe');
  frame.src = src;
  frame.title = 'Frame Yourself in Time: the full user process';
  frame.loading = 'lazy';
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  slot.textContent = '';
  slot.appendChild(frame);
})();
