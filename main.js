(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let lang = 'ko';
  try { lang = localStorage.getItem('lang') || 'ko'; } catch (e) {}
  let ghRepos = [];

  // { ko, en } 이면 현재 언어로, 문자열이면 그대로
  const L = v => (v && typeof v === 'object' && !Array.isArray(v)) ? (v[lang] ?? v.ko) : v;
  const projects = () => SITE.companies.flatMap(c => c.projects.map(p => ({ ...p, company: c })));

  /* ---------- 렌더링 ---------- */
  function render() {
    const ui = SITE.ui[lang], h = SITE.hero;
    document.documentElement.lang = lang;
    $('#langBtn').textContent = lang === 'ko' ? '$ EN' : '$ KO';
    document.querySelectorAll('[data-ui]').forEach(el => { el.textContent = ui[el.dataset.ui]; });

    $('#kicker').textContent = L(h.kicker);
    $('#h1').textContent = L(h.h1);
    $('#heroName').textContent = $('#footName').textContent = L(h.name);
    $('#heroRole').textContent = L(h.role);
    $('#facts').innerHTML = h.facts.map(f =>
      `<li><span class="k">${esc(L(f.k))}</span><span class="v">${esc(L(f.v))}</span></li>`).join('');

    $('#timeline').innerHTML = SITE.career.map(c => `
      <li class="reveal">
        <span class="period">${esc(L(c.period))}</span>
        <div><b>${esc(L(c.org))}</b><p>${esc(L(c.desc))}</p></div>
      </li>`).join('');

    $('#skills').innerHTML = SITE.skills.map(([g, items]) =>
      `<div class="reveal"><dt>${esc(g)}</dt><dd>${items.map(s => `<span>${esc(s)}</span>`).join('')}</dd></div>`).join('');

    $('#companies').innerHTML = SITE.companies.map(c => `
      <div class="company">
        <div class="company-head reveal">
          <img src="${esc(c.img)}" alt="${esc(c.robot)}" loading="lazy">
          <div>
            <span class="robot">${esc(c.robot)}</span>
            <h3>${esc(c.name)}</h3>
            <p>${esc(L(c.role))}</p>
            <span class="period">${esc(L(c.period))}</span>
          </div>
        </div>
        <div class="grid">${c.projects.map(p => `
          <button class="card reveal" data-no="${esc(p.no)}">
            <div class="card-top"><span class="idx">${esc(p.no)}</span><span class="arrow">+</span></div>
            <h4>${esc(L(p.title))}</h4>
            <span class="sub">${esc(p.sub)}${p.date ? ` · ${esc(p.date)}` : ''}</span>
            <p>${esc(L(p.overview))}</p>
            <div class="tags">${p.stack.map(x => `<span>${esc(x)}</span>`).join('')}</div>
          </button>`).join('')}
        </div>
      </div>`).join('');

    $('#ghRepos').innerHTML = ghRepos.length ? `
      <div class="label gh-label">${esc(ui.ghTitle)}</div>
      <div class="grid">${ghRepos.map(r => `
        <a class="card reveal" href="${esc(r.html_url)}" target="_blank" rel="noopener">
          <div class="card-top"><span class="idx">github</span><span class="arrow">↗</span></div>
          <h4>${esc(r.name)}</h4>
          <p>${esc(r.description || '')}</p>
          <div class="tags">${[r.language, r.stargazers_count ? `★ ${r.stargazers_count}` : ''].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('')}</div>
        </a>`).join('')}
      </div>` : '';

    $('#contactRow').innerHTML = `
      <a class="contact-item" href="mailto:${esc(SITE.email)}"><span class="lbl">email</span>${esc(SITE.email)}</a>
      <a class="contact-item" href="https://github.com/${esc(SITE.github)}" target="_blank" rel="noopener"><span class="lbl">github</span>github.com/${esc(SITE.github)}</a>`;

    typeTerminal(SITE.terminal.map(([cmd, res]) => [cmd, L(res)]));
    observeReveal();
  }

  /* ---------- 프로젝트 상세 (모달) ---------- */
  const modal = $('#modal');
  function openProject(no) {
    const p = projects().find(x => x.no === no);
    if (!p) return;
    const ui = SITE.ui[lang];
    $('#modalBody').innerHTML = `
      <button class="modal-close" aria-label="Close">✕</button>
      <div class="kicker">${esc(p.no)} · ${esc(p.company.name)}</div>
      <h3>${esc(L(p.title))}</h3>
      <span class="sub">${esc(p.sub)}${p.date ? ` · ${esc(p.date)}` : ''}</span>
      <div class="label">${esc(ui.overview)}</div>
      <p>${esc(L(p.overview))}</p>
      <div class="label">${esc(ui.roles)}</div>
      <ul class="roles">${L(p.roles).map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      <div class="tags">${p.stack.map(x => `<span>${esc(x)}</span>`).join('')}</div>`;
    modal.showModal();
  }
  $('#companies').addEventListener('click', e => {
    const card = e.target.closest('.card[data-no]');
    if (card) openProject(card.dataset.no);
  });
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('.modal-close')) modal.close();
  });

  /* ---------- 터미널 타이핑 ---------- */
  let typeTimer;
  function typeTerminal(lines) {
    clearTimeout(typeTimer);
    const out = $('#termOut');
    const full = lines.map(([cmd, res]) => [`$ ${cmd}`, res]);
    let li = 0, ci = 0, html = '';
    const step = () => {
      if (li >= full.length) { out.innerHTML = html + '<span class="sig">$</span> <span class="cursor">_</span>'; return; }
      const [cmd, res] = full[li];
      if (ci <= cmd.length) {
        out.innerHTML = html + `<span class="sig">${esc(cmd.slice(0, ci))}</span><span class="cursor">_</span>`;
        ci++;
        typeTimer = setTimeout(step, 35);
      } else {
        html += `<span class="sig">${esc(cmd)}</span>\n<span class="t-dim">${esc(res)}</span>\n`;
        li++; ci = 0;
        typeTimer = setTimeout(step, 250);
      }
    };
    step();
  }

  /* ---------- 스크롤 등장 효과 ---------- */
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 })
    : null;
  function observeReveal() {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  }

  /* ---------- GitHub ---------- */
  function initGithub() {
    $('#ghBtn').href = `https://github.com/${SITE.github}`;
    $('#mailBtn').href = `mailto:${SITE.email}`;
    if (!SITE.autoGithubRepos) return;
    fetch(`https://api.github.com/users/${SITE.github}/repos?per_page=100&sort=updated`)
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        ghRepos = (Array.isArray(list) ? list : []).filter(r => !r.fork && r.name !== `${SITE.github}.github.io`);
        if (ghRepos.length) render();
      })
      .catch(() => {});
  }

  /* ---------- 배경 파티클 ---------- */
  function initBg() {
    const c = $('#bg'), ctx = c.getContext('2d');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let w, h, pts;
    const resize = () => {
      w = c.width = innerWidth * devicePixelRatio;
      h = c.height = innerHeight * devicePixelRatio;
      const n = Math.min(60, Math.floor(innerWidth * innerHeight / 26000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
    };
    resize(); addEventListener('resize', resize);
    const D = 140 * devicePixelRatio;
    (function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
          if (d < D) {
            ctx.strokeStyle = `rgba(255,138,61,${(1 - d / D) * .15})`;
            ctx.lineWidth = devicePixelRatio;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(255,138,61,.5)';
        ctx.fillRect(pts[i].x - devicePixelRatio, pts[i].y - devicePixelRatio, 2 * devicePixelRatio, 2 * devicePixelRatio);
      }
      requestAnimationFrame(frame);
    })();
  }

  /* ---------- 이벤트 ---------- */
  $('#langBtn').onclick = () => {
    lang = lang === 'ko' ? 'en' : 'ko';
    try { localStorage.setItem('lang', lang); } catch (e) {}
    render();
  };
  $('#burger').onclick = () => document.body.classList.toggle('menu-open');
  document.querySelectorAll('#navLinks a').forEach(a => a.onclick = () => document.body.classList.remove('menu-open'));

  // 현재 섹션 하이라이트
  const navIo = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) document.querySelectorAll('#navLinks a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  if (navIo) document.querySelectorAll('main section').forEach(s => navIo.observe(s));

  $('#year').textContent = new Date().getFullYear();
  initGithub();
  initBg();
  render();
})();
