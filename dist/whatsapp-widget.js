(() => {
  const section = document.querySelector('#cuidado');
  const contact = document.querySelector('#contato a.whatsapp');
  if (!section || !contact) return;
  const destination = new URL(contact.href);
  const options = [
    ['Dor nas costas ou no pescoço', 'Estou com dor nas costas ou no pescoço e gostaria de agendar uma avaliação.'],
    ['Dor persistente', 'Estou com uma dor persistente e gostaria de agendar uma avaliação.'],
    ['Tontura ou falta de equilíbrio', 'Tenho tontura ou dificuldade de equilíbrio e gostaria de agendar uma avaliação.'],
    ['Mandíbula, ATM ou bruxismo', 'Gostaria de agendar uma avaliação para queixas na mandíbula, ATM ou bruxismo.'],
    ['Reabilitação e movimento', 'Gostaria de conversar sobre reabilitação e melhora dos movimentos e agendar uma avaliação.'],
    ['Pilates e fortalecimento', 'Tenho interesse em Pilates e fortalecimento. Gostaria de saber como começar.'],
    ['Ainda não sei / outra necessidade', 'Gostaria de explicar o que estou sentindo e entender como funciona a avaliação com o Dr. Rodrigo.']
  ];
  const widget = document.createElement('aside');
  widget.className = 'wa-widget';
  widget.hidden = true;
  widget.setAttribute('aria-label', 'Contato rápido pelo WhatsApp');
  widget.innerHTML = `<section class="wa-panel" id="wa-panel" aria-labelledby="wa-title" hidden>
    <div class="wa-panel-header"><h2 id="wa-title">Como podemos ajudar?</h2><button class="wa-close" type="button" aria-label="Fechar opções de contato">×</button></div>
    <p>O que você precisa cuidar hoje?</p><div class="wa-options"></div>
    <small>Ao escolher, o WhatsApp abre com a mensagem pronta. Você pode editar antes de enviar.</small>
    </section><button class="wa-trigger" type="button" aria-expanded="false" aria-controls="wa-panel">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.3 7.9L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z"/><path d="M8 7.5c0 4 4.5 8 8 8l1-2-3-1-1 1c-1.5-.7-2.8-2-3.5-3.5l1-1-1-2.5Z"/></svg>
    <span>Chamar no WhatsApp</span></button>`;
  const list = widget.querySelector('.wa-options');
  options.forEach(([label, message]) => {
    const link = document.createElement('a');
    const url = new URL(destination);
    url.searchParams.set('text', `Olá! Vim pelo site da Clínica Dr. Rodrigo Medeiros. ${message}`);
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    link.append(arrow);
    list.append(link);
  });
  document.body.append(widget);
  const trigger = widget.querySelector('.wa-trigger');
  const panel = widget.querySelector('.wa-panel');
  const close = (restoreFocus = false) => {
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus({ preventScroll: true });
  };
  trigger.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) list.querySelector('a').focus({ preventScroll: true });
  });
  widget.querySelector('.wa-close').addEventListener('click', () => close(true));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(true); });
  document.addEventListener('click', e => { if (!widget.contains(e.target)) close(); });
  let pending = false;
  const update = () => {
    pending = false;
    const header = document.querySelector('.header');
    const passed = section.getBoundingClientRect().bottom <= (header?.getBoundingClientRect().bottom || 0);
    widget.hidden = !passed;
    if (!passed) close();
  };
  const schedule = () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  new ResizeObserver(schedule).observe(document.body);
  update();
})();
