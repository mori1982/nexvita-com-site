/* NexVita — site institucional */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const body = document.body;
  const mobile = () => innerWidth <= 1000;
  requestAnimationFrame(() => setTimeout(() => body.classList.add('is-loaded'), 60));

  /* header */
  const top = document.querySelector('.top');
  if (body.dataset.hero === 'dark') top.classList.add('over-dark');
  let lastY = 0;
  function header() {
    const y = scrollY;
    top.classList.toggle('scrolled', y > 40);
    top.classList.toggle('hide', y > 600 && y > lastY + 4 && !body.classList.contains('menu-open'));
    if (y < lastY - 4 || y < 600) top.classList.remove('hide');
    lastY = y;
    const wa = document.querySelector('.wa-float');
    if (wa) wa.classList.toggle('on', y > innerHeight * 0.9);
  }

  /* mobile menu */
  const burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => {
      body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false');
    }));
    addEventListener('keydown', e => { if (e.key === 'Escape' && body.classList.contains('menu-open')) { body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); burger.focus(); } });
  }

  /* flowing contour lines */
  function flow(canvas) {
    const ctx = canvas.getContext('2d');
    const tone = canvas.dataset.tone || 'light';
    const lines = +(canvas.dataset.lines || 32);
    const amp = +(canvas.dataset.amp || 26);
    const color = tone === 'dark'
      ? p => `rgba(159,195,196,${0.05 + 0.22 * Math.sin(p * Math.PI)})`
      : p => `rgba(7,56,61,${0.045 + 0.13 * Math.sin(p * Math.PI)})`;
    let w = 0, h = 0, t = Math.random() * 10, visible = true, mx = 0.62, tx = 0.62;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size(); addEventListener('resize', size);
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(canvas);
    addEventListener('pointermove', e => { tx = e.clientX / innerWidth; }, { passive: true });
    const step = mobile() ? 12 : 8;
    const draw = () => {
      if (visible) {
        mx += (tx - mx) * 0.04;
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < lines; i++) {
          const p = i / (lines - 1);
          const base = h * (0.06 + p * 0.88);
          ctx.beginPath();
          for (let x = -10; x <= w + 10; x += step) {
            const k = x / w;
            const y = base
              + Math.sin(k * 5.2 + t * 0.6 + i * 0.21) * amp * (0.6 + p)
              + Math.sin(k * 11 - t * 0.35 + i * 0.07) * amp * 0.35
              + Math.exp(-Math.pow((k - mx) * 4, 2)) * amp * 0.9 * Math.sin(t + i * 0.3);
            x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = color(p); ctx.lineWidth = 1; ctx.stroke();
        }
        t += 0.008;
      }
      if (!reduce) requestAnimationFrame(draw);
    };
    draw();
  }
  document.querySelectorAll('canvas.flow').forEach(flow);

  /* scroll progress helper */
  const prog = el => { const r = el.getBoundingClientRect(); const total = r.height - innerHeight; return total <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / total)); };

  /* home: division of roles */
  const div = document.querySelector('.divisao');
  let divStory = null;
  if (div) {
    const adm = [...div.querySelectorAll('.medico .adm')];
    const rights = [...div.querySelectorAll('.nexvita .items li')];
    const sayL = div.querySelector('.medico .say'), sayR = div.querySelector('.nexvita .say');
    const meter = div.querySelector('.meter i'), ctas = div.querySelector('.nexvita .ctas');
    const L = JSON.parse(sayL.dataset.states), R = JSON.parse(sayR.dataset.states);
    divStory = () => {
      if (mobile() || reduce) {
        adm.forEach(a => a.classList.add('gone')); rights.forEach(r => r.classList.add('in'));
        ctas.classList.add('on'); sayL.textContent = L[2]; sayR.textContent = R[1]; return;
      }
      const p = prog(div);
      const n = Math.min(adm.length, Math.floor(p * (adm.length + 1.4)));
      adm.forEach((a, i) => a.classList.toggle('gone', i < n));
      rights.forEach((r, i) => r.classList.toggle('in', i < n));
      meter.style.width = (n / adm.length * 100) + '%';
      const done = n >= adm.length;
      ctas.classList.toggle('on', done);
      const l = n === 0 ? L[0] : done ? L[2] : L[1];
      const r = done ? R[1] : R[0];
      if (sayL.textContent !== l) sayL.textContent = l;
      if (sayR.textContent !== r) sayR.textContent = r;
    };
  }

  /* home: patient journey */
  const jor = document.querySelector('.jornada');
  let jorStory = null;
  if (jor) {
    const steps = [...jor.querySelectorAll('.step')];
    const line = jor.querySelector('line.prog');
    jorStory = () => {
      if (mobile() || reduce) { steps.forEach(s => s.classList.add('on')); line.style.strokeDashoffset = 0; return; }
      const q = prog(jor);
      line.style.strokeDashoffset = 1 - Math.min(1, q * 1.08);
      steps.forEach((s, i) => s.classList.toggle('on', q * 1.08 >= i / (steps.length - 1) - 0.02));
    };
  }

  /* como trabalhamos: process */
  const proc = document.querySelector('.processo');
  let procStory = null;
  if (proc) {
    const ps = [...proc.querySelectorAll('.pstep')];
    const nums = [...proc.querySelectorAll('.num span')];
    const dots = [...proc.querySelectorAll('.pdots i')];
    procStory = () => {
      if (mobile() || reduce) { ps.forEach(p => p.classList.add('on')); return; }
      const k = Math.min(ps.length - 1, Math.floor(prog(proc) * ps.length));
      ps.forEach((p, i) => p.classList.toggle('on', i === k));
      nums.forEach((n, i) => { n.classList.toggle('off', i < k); n.classList.toggle('next', i > k); });
      dots.forEach((d, i) => d.classList.toggle('on', i <= k));
    };
  }

  /* reveals */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
  }), { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv, .people figure, .clip').forEach(el => io.observe(el));

  /* parallax on wide images */
  const plx = [...document.querySelectorAll('[data-parallax]')];
  const parallax = () => {
    if (reduce) return;
    plx.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2 + r.height / 2);
      el.querySelector('.pl').style.setProperty('--py', (p * -r.height * 0.08).toFixed(1) + 'px');
    });
  };

  /* one open model at a time */
  document.querySelectorAll('[data-accordion]').forEach(group => {
    group.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
      if (d.open) group.querySelectorAll('details').forEach(o => { if (o !== d) o.open = false; });
    }));
  });

  /* attribution (UTM / click ids) kept for the session */
  try {
    const q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(k => {
      if (q.get(k)) sessionStorage.setItem('nv_' + k, q.get(k));
    });
    if (!sessionStorage.getItem('nv_landing')) sessionStorage.setItem('nv_landing', location.pathname);
  } catch (e) {}

  /* lead form */
  const form = document.querySelector('form.lead');
  if (form) {
    const status = form.querySelector('.status');
    const btn = form.querySelector('button[type=submit]');
    const pre = new URLSearchParams(location.search).get('assunto');
    if (pre && form.assunto) [...form.assunto.options].forEach(o => { if (o.value === pre) o.selected = true; });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.className = 'status'; status.textContent = '';
      if (form.website && form.website.value) return; // honeypot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      delete data.website;
      const attrib = {};
      try { for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); if (k.startsWith('nv_')) attrib[k.slice(3)] = sessionStorage.getItem(k); } } catch (err) {}
      const payload = Object.assign({
        _subject: `Site NexVita | ${data.assunto || 'Contato'} | ${data.nome || ''}`,
        _template: 'table', _captcha: 'false', _replyto: data.email,
        pagina: location.pathname
      }, data, attrib);
      btn.disabled = true; btn.textContent = 'Enviando';
      try {
        const r = await fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || 'falha');
        form.reset();
        status.className = 'status ok';
        status.textContent = 'Mensagem enviada. Respondemos em até um dia útil.';
        if (window.gtag) window.gtag('event', 'generate_lead', { form: 'contato' });
      } catch (err) {
        status.className = 'status err';
        status.textContent = 'Não foi possível enviar agora. Fale com a gente pelo WhatsApp ou escreva para contato@nexvita.com.';
      } finally { btn.disabled = false; btn.textContent = 'Enviar mensagem'; }
    });
  }

  // números que contam ao aparecer
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      const el = e.target, end = parseFloat(el.dataset.count);
      if (reduce || !end) { el.textContent = el.dataset.count; return; }
      const t0 = performance.now(), dur = 1400;
      const step = t => { const k = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - k, 3))); el.textContent = v; if (k < 1) requestAnimationFrame(step); };
      el.textContent = '0'; requestAnimationFrame(step);
    }), { threshold: .6 });
    counters.forEach(c => cio.observe(c));
  }

  // vídeo do YouTube só carrega no clique (privacidade e desempenho)
  document.querySelectorAll('.video[data-yt]').forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
    f.title = 'Depoimento de cliente da NexVita';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
    b.replaceChildren(f); b.removeAttribute('aria-label'); b.style.cursor = 'default';
    if (window.gtag) window.gtag('event', 'video_play', { video: b.dataset.yt });
  }));

  const tick = () => { header(); divStory && divStory(); jorStory && jorStory(); procStory && procStory(); parallax(); };
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { tick(); ticking = false; }); } }, { passive: true });
  addEventListener('resize', tick);
  tick();
})();
