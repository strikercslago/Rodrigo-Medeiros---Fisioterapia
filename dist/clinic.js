(() => {
  document.querySelectorAll('.clinic-editorial').forEach(section => {
  const direction = section.dataset.direction === 'right' ? -1 : 1;
  const belt = section.querySelector('.clinic-belt');
  const track = section.querySelector('.clinic-track');
  const set = section.querySelector('.clinic-set');
  const pause = section.querySelector('.clinic-pause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // One full duplicate covers the viewport at the modular seam, in either direction.
  const copy = set.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  track.append(copy);
  let width = 0, offset = 0, pointer = null, lastX = 0;
  let resumeAt = 0, previous = 0, visible = false, paused = false;
  const render = () => {
    if (!width) return;
    offset = ((offset % width) + width) % width;
    track.style.transform = `translate3d(${-offset}px,0,0)`;
  };
  new ResizeObserver(() => {
    width = set.getBoundingClientRect().width;
    const required = Math.ceil(belt.clientWidth / width) + 1;
    while (track.children.length < required) {
      const extra = copy.cloneNode(true);
      extra.inert = true;
      track.append(extra);
    }
    render();
  }).observe(belt);
  section.classList.add('is-ready');
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      section.classList.add('is-visible');
      track.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    }
  }, { threshold: 0.05 }).observe(section);
  const frame = now => {
    const delta = Math.min((now - previous) / 1000, .05);
    previous = now;
    if (visible && !document.hidden && pointer === null && !paused && !reduced.matches && now > resumeAt) {
      offset += direction * 24 * delta * Math.min(1, (now - resumeAt) / 450);
      render();
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  belt.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || pointer !== null) return;
    pointer = event.pointerId;
    lastX = event.clientX;
    belt.setPointerCapture(pointer);
    belt.classList.add('is-dragging');
  });
  belt.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    offset -= event.clientX - lastX;
    lastX = event.clientX;
    render();
  });
  const release = event => {
    if (event.pointerId !== pointer) return;
    pointer = null;
    belt.classList.remove('is-dragging');
    resumeAt = performance.now() + 600;
  };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => belt.addEventListener(type, release));
  belt.addEventListener('dragstart', event => event.preventDefault());
  belt.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    offset += event.key === 'ArrowRight' ? 180 : -180;
    render();
    resumeAt = performance.now() + 800;
  });
  pause.addEventListener('click', () => {
    paused = !paused;
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Retomar movimento' : 'Pausar movimento';
    resumeAt = performance.now();
  });
  const motionPreference = () => { pause.hidden = reduced.matches; };
  reduced.addEventListener('change', motionPreference);
  motionPreference();
  });
})();
