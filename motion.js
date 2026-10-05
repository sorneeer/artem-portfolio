(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const label = document.body.dataset.page || 'ARTIOM';
  const cover = document.createElement('div');
  cover.className = 'page-cover';
  const cursor = document.createElement('span');
  cursor.className = 'cursor-dot';
  document.body.prepend(cover);
  document.body.append(cursor);

  if (!document.body.hasAttribute('data-no-intro')) {
    const intro = document.createElement('div');
    intro.className = 'page-intro';
    intro.dataset.label = label;
    intro.innerHTML = `<span class="page-intro__word">${label}</span><span class="page-intro__dot"></span>`;
    document.body.prepend(intro);
    window.setTimeout(() => intro.remove(), 2300);
  }

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || link.hasAttribute('download') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      cover.classList.add('is-active');
      window.setTimeout(() => { window.location.href = href; }, 680);
    });
  });

  const revealItems = document.querySelectorAll('[data-reveal], .project-image, .case-visual');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14 });
  revealItems.forEach((item) => observer.observe(item));

  if (matchMedia('(pointer:fine)').matches && !reducedMotion) {
    window.addEventListener('pointermove', (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add('is-visible');
    });
    document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    document.querySelectorAll('a,button').forEach((item) => {
      item.addEventListener('pointerenter', () => cursor.classList.add('is-large'));
      item.addEventListener('pointerleave', () => cursor.classList.remove('is-large'));
    });

    document.querySelectorAll('.project-frame').forEach((frame) => {
      frame.addEventListener('pointermove', (event) => {
        const rect = frame.getBoundingClientRect();
        frame.style.setProperty('--spot-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        frame.style.setProperty('--spot-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
      frame.addEventListener('pointerenter', () => cursor.classList.add('is-project'));
      frame.addEventListener('pointerleave', () => {
        cursor.classList.remove('is-project');
        frame.style.setProperty('--spot-x', '50%');
        frame.style.setProperty('--spot-y', '50%');
      });
    });

    document.querySelectorAll('header > a.rounded-full, #home a.rounded-full, #contact a.rounded-full, .case-site-link').forEach((item) => {
      item.classList.add('magnetic');
      item.addEventListener('pointermove', (event) => {
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * .16;
        const y = (event.clientY - rect.top - rect.height / 2) * .2;
        item.style.setProperty('--magnetic-x', `${x}px`);
        item.style.setProperty('--magnetic-y', `${y}px`);
      });
      item.addEventListener('pointerleave', () => {
        item.style.setProperty('--magnetic-x', '0px');
        item.style.setProperty('--magnetic-y', '0px');
      });
    });
  }

  const parallax = document.querySelectorAll('[data-parallax]');
  let ticking = false;
  const updateParallax = () => {
    parallax.forEach((item) => {
      const rect = item.parentElement.getBoundingClientRect();
      const offset = Math.max(-1, Math.min(1, (innerHeight / 2 - (rect.top + rect.height / 2)) / innerHeight));
      item.style.transform = `translate3d(0, ${offset * 5}%, 0) scale(1.03)`;
    });
    ticking = false;
  };
  if (!reducedMotion) {
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }, { passive: true });
    updateParallax();
  }
})();
