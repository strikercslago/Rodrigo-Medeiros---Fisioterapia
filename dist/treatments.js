(() => {
  const section = document.querySelector('.tx-section');
  const dialog = section.querySelector('#treatment-dialog');
  const cards = section.querySelectorAll('[data-treatment]');
  cards.forEach(card => card.addEventListener('click', () => {
    const treatment = treatments[Number(card.dataset.treatment)];
    dialog.querySelector('#tx-detail-title').textContent = card.querySelector('.tx-card-title').textContent;
    dialog.querySelector('#tx-detail-subtitle').textContent = treatment[1];
    dialog.querySelector('#tx-detail-text').textContent = treatment[2];
    dialog.showModal();
  }));
  dialog.querySelector('.tx-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('a').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
      entry.target.style.animationDelay = `${index * 60}ms`;
      entry.target.classList.add('tx-reveal');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  cards.forEach(card => observer.observe(card));
})();
