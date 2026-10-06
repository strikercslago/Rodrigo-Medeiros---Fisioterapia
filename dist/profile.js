(() => {
  const section = document.querySelector('.profile-section');
  if (!section || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('profile-enter');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  section.querySelectorAll('[data-profile-reveal]').forEach(element => observer.observe(element));
})();
