(() => {
  const section = document.querySelector('.care-section');
  if (!section || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('care-animate');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  section.querySelectorAll('[data-care-reveal]').forEach(element => observer.observe(element));
})();
