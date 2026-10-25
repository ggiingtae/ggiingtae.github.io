(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let lang = 'ko';
  try { lang = localStorage.getItem('lang') || 'ko'; } catch (e) {}
  let ghRepos = [];

  /* ---------- 렌더링 ---------- */
  function render() {
    const t = SITE[lang];
    document.documentElement.lang = lang;
    $('#langBtn').textContent = lang === 'ko' ? '$ EN' : '$ KO';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t[el.dataset.i18n];
      if (typeof v === 'string') el.textContent = v;
    });

    $('#facts').innerHTML = t.facts.map(([k, v]) =>
      `<li><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></li>`).join('');

    // 프로젝트: 직접 적은 것 + GitHub 자동
    const manual = SITE.projects.map(p => ({
      title: p.title, desc: p[lang] || p.ko || p.en, tags: p.tags || [], link: p.link,
    }));
    const auto = ghRepos.map(r => ({
      title: r.name, desc: r.description || '', link: r.html_url,
      tags: [r.language, r.stargazers_count ? `★ ${r.stargazers_count}` : ''].filter(Boolean),
    }));
    $('#projGrid').innerHTML = [...manual, ...auto].map((p, i) => {
      const tag = p.link ? 'a' : 'div';
      const href = p.link ? ` href="${esc(p.link)}" target="_blank" rel="noopener"` : '';
      return `<${tag} class="card reveal"${href}>
        <div class="card-top"><span class="idx">${String(i + 1).padStart(2, '0')}</span>${p.link ? '<span class="arrow">↗</span>' : ''}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="tags">${p.tags.map(x => `<span>${esc(x)}</span>`).join('')}</div>
      </${tag}>`;
    }).join('');
    $('#ghNote').textContent = ghRepos.length ? t.ghLoaded(ghRepos.length) : '';

    $('#timeline').innerHTML = SITE.career.map(c => `
      <li class="reveal">
        <span class="period">${esc(lang === 'en' ? c.en_period || c.period : c.period)}</span>
        <div><b>${esc(c.org)}</b><p>${esc(c[lang] || c.ko)}</p></div>
      </li>`).join('');

    $('#skills').innerHTML = SITE.skills.map(s => `<span>${esc(s)}</span>`).join('');

    $('#contactRow').innerHTML = `
      <a class="contact-item" href="mailto:${esc(SITE.email)}"><span class="lbl">email</span>${esc(SITE.email)}</a>
      <a class="contact-item" href="https://github.com/${esc(SITE.github)}" target="_blank" rel="noopener"><span class="lbl">github</span>github.com/${esc(SITE.github)}</a>`;

    typeTerminal(t.terminal);
    observeReveal();
  }

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
    const av = $('#avatar');
    av.src = `https://github.com/${SITE.github}.png?size=160`;
    av.onerror = () => { av.replaceWith(Object.assign(document.createElement('div'), { className: 'avatar-fallback', textContent: 'KT' })); };

    if (!SITE.autoGithubRepos) return;
    fetch(`https://api.github.com/users/${SITE.github}/repos?per_page=100&sort=updated`)
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        ghRepos = (Array.isArray(list) ? list : []).filter(r => !r.fork && r.name !== `${SITE.github}.github.io`);
        if (ghRepos.length) render();
      })
      .catch(() => {});
  }

  /* ---------- 배경 파티클 (그리드 노드) ---------- */
  function initBg() {
    const c = $('#bg'), ctx = c.getContext('2d');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let w, h, pts;
    const resize = () => {
      w = c.width = innerWidth * devicePixelRatio;
      h = c.height = innerHeight * devicePixelRatio;
      const n = Math.min(70, Math.floor(innerWidth * innerHeight / 22000));
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
            ctx.strokeStyle = `rgba(255,138,61,${(1 - d / D) * .18})`;
            ctx.lineWidth = devicePixelRatio;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(255,138,61,.55)';
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
