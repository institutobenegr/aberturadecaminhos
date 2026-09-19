(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  revealItems.forEach((item) => {
    const delay = Number(item.dataset.delay || 0);
    item.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  root.classList.add('motion-ready');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -35px' });

    revealItems.forEach((item) => observer.observe(item));
  }

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.page-progress span');
  let ticking = false;

  const updatePageState = () => {
    const scrollTop = window.scrollY;
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    if (header) header.classList.toggle('is-scrolled', scrollTop > 18);
    if (progress) progress.style.width = `${Math.min((scrollTop / scrollable) * 100, 100)}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updatePageState);
  }, { passive: true });

  updatePageState();

  const tiltCard = document.querySelector('[data-tilt]');
  const precisePointer = window.matchMedia('(pointer: fine)').matches;

  if (tiltCard && precisePointer && !reducedMotion) {
    tiltCard.addEventListener('pointermove', (event) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tiltCard.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });

    tiltCard.addEventListener('pointerleave', () => {
      tiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  }

  const questions = [...document.querySelectorAll('.faq-list details')];
  questions.forEach((question) => {
    question.addEventListener('toggle', () => {
      if (!question.open) return;
      questions.forEach((item) => {
        if (item !== question) item.open = false;
      });
    });
  });
})();
