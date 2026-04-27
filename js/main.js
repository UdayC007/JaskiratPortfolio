// Jaskirat — public site
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

document.addEventListener('DOMContentLoaded', () => {

  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', window.scrollY > 60));

  const burger = $('nav-burger');
  const navLinks = $('nav-links');
  if (burger) {
    burger.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('mobile-open')));
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = a.getAttribute('href');
      if (target.length < 2) return;
      const t = document.querySelector(target);
      if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 90, behavior: 'smooth' }); }
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  function watchReveals() { document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el)); }
  watchReveals();

  loadSite();
  loadProjects();

  async function loadSite() {
    try {
      const r = await fetch('data/site.json');
      const s = await r.json();
      const p = s.profile || {};
      const c = s.contact || {};

      const fullName = p.name || 'Jaskirat Singh';
      const parts = fullName.split(' ');
      const first = (parts[0] || 'JASKIRAT').toUpperCase();
      const last  = (parts.slice(1).join(' ') || 'SINGH').toUpperCase();

      if ($('hero-first')) $('hero-first').textContent = first;
      if ($('hero-last'))  { $('hero-last').textContent = last; $('hero-last').setAttribute('data-text', last); }
      if ($('hero-title')) $('hero-title').textContent = (p.title || 'UI/UX DESIGNER').toUpperCase();
      if ($('hero-year'))  $('hero-year').textContent = (p.year || '1ST').toUpperCase().replace('YEAR', '').trim();
      if ($('hero-college')) $('hero-college').textContent = (p.college || 'DIT UNIVERSITY').toUpperCase();
      if ($('hero-tagline') && p.tagline) $('hero-tagline').textContent = p.tagline;

      $('nav-name').textContent = (parts[0] || 'JASKIRAT').toUpperCase() + '//';
      $('footer-name').innerHTML = `// ${fullName.toUpperCase()} <span class="dot">●</span> ${new Date().getFullYear()}`;
      document.title = `${fullName} — ${p.title || 'Designer'}`;

      if ($('about-name'))    $('about-name').textContent = fullName;
      if ($('about-class'))   $('about-class').textContent = p.title || '';
      if ($('about-year'))    $('about-year').textContent = p.year || '';
      if ($('about-college')) $('about-college').textContent = p.college || '';
      if ($('about-bio'))     $('about-bio').textContent = p.bio || '—';
      if ($('personal-touch')) $('personal-touch').textContent = p.personalTouch || '—';
      if ($('goals-text'))     $('goals-text').textContent = p.goals || '—';

      // Photos
      const photos = s.photos || {};
      if (photos.hero) {
        const h = $('hero-portrait-photo');
        if (h) { h.innerHTML = `<img src="${esc(photos.hero)}" alt="">`; h.classList.add('has-photo'); }
      }
      if (photos.about) {
        const a = $('about-portrait');
        if (a) { a.innerHTML = `<img src="${esc(photos.about)}" alt="">`; a.classList.add('has-photo'); }
      }
      if (photos.brand) {
        document.querySelectorAll('.brand-mark').forEach(el => {
          el.innerHTML = `<img src="${esc(photos.brand)}" alt="">`;
          el.classList.add('has-photo');
        });
      }

      // Subjects
      const subs = s.subjects || [];
      const sg = $('subject-grid');
      if (sg) {
        sg.innerHTML = subs.length
          ? subs.map(sub => `
              <div class="subject-card reveal">
                ${sub.code ? `<div class="subject-code">${esc(sub.code)}</div>` : ''}
                <div class="subject-name">${esc(sub.name)}</div>
                <div class="subject-faculty ${sub.faculty ? '' : 'empty'}">${esc(sub.faculty) || 'Faculty TBD'}</div>
              </div>`).join('')
          : `<p class="empty-msg" style="grid-column:1/-1">// NO_SUBJECTS — ADD VIA /admin</p>`;
      }

      // Skills
      const skills = s.skills || [];
      const sk = $('skills-grid');
      if (sk) {
        sk.innerHTML = (skills.length ? skills : []).map(skn => `
          <div class="skill-card reveal">
            <div class="skill-rank">${esc(skn.rank || 'B')}</div>
            <div class="skill-name">${esc(skn.name)}</div>
            <div class="skill-bar"><div class="skill-bar-fill" style="--w:${Math.max(0, Math.min(100, skn.level || 0))}%"></div></div>
            <div class="skill-level">// ${Math.max(0, Math.min(100, skn.level || 0))} / 100</div>
          </div>`).join('') || '<p class="empty-msg" style="grid-column:1/-1">// STACK_EMPTY</p>';
      }

      // Comms
      const links = [];
      if (c.email)     links.push({ tag: '[01]', label: 'EMAIL',     value: c.email,                                 href: 'mailto:' + c.email });
      if (c.instagram) links.push({ tag: '[02]', label: 'INSTAGRAM', value: '@' + c.instagram,                       href: 'https://instagram.com/' + c.instagram });
      if (c.twitter)   links.push({ tag: '[03]', label: 'TWITTER',   value: '@' + c.twitter,                         href: 'https://twitter.com/' + c.twitter });
      if (c.linkedin)  links.push({ tag: '[04]', label: 'LINKEDIN',  value: c.linkedin.replace(/^https?:\/\//, ''),  href: c.linkedin.startsWith('http') ? c.linkedin : 'https://' + c.linkedin });
      const ml = $('msg-links');
      if (ml) ml.innerHTML = links.map(l => `
        <a href="${esc(l.href)}" target="_blank" rel="noopener" class="comm-link">
          <span class="ck-key">${esc(l.tag)}</span>
          <span class="ck-label">${esc(l.label)}</span>
          <span class="ck-value">${esc(l.value)}</span>
          <span class="ck-arrow">→</span>
        </a>`).join('') || '<p class="empty-msg">// CHANNEL_EMPTY — ADD VIA /admin</p>';

      watchReveals();
    } catch (e) { console.error('loadSite failed', e); }
  }

  async function loadProjects() {
    try {
      const r = await fetch('data/projects.json');
      const projects = await r.json();
      const grid = $('projects-grid');
      const empty = $('no-projects');
      if (!projects.length) { grid.style.display = 'none'; empty.style.display = ''; return; }
      grid.style.display = ''; empty.style.display = 'none';
      grid.innerHTML = projects.map(p => {
        const cover = p.images && p.images[0];
        const thumb = cover
          ? `<img src="${esc(cover)}" alt="${esc(p.title)}">`
          : `<div class="project-thumb-placeholder" style="background:${esc(p.color || '#00ffe1')}">${esc((p.title || '?').charAt(0))}</div>`;
        const tags = (p.tags || []).slice(0, 3).map(t => `<span class="project-tag">${esc(t)}</span>`).join('');
        const photos = (p.images || []).length;
        const photosBadge = photos > 1 ? `<span class="project-tag">${photos}_FRAMES</span>` : '';
        return `
          <a class="project-card reveal" href="project.html?id=${p.id}">
            <div class="project-thumb">${thumb}</div>
            <div class="project-body">
              <div class="project-tags">${tags}${photosBadge}</div>
              <h3 class="project-title">${esc(p.title)}</h3>
              <p class="project-desc">${esc((p.description || '').slice(0, 130))}${(p.description || '').length > 130 ? '…' : ''}</p>
              <span class="project-link">▶ READ_DATA</span>
            </div>
          </a>`;
      }).join('');
      watchReveals();
    } catch (e) {
      $('projects-grid').innerHTML = `<p class="empty-msg" style="color:var(--red)">// SIGNAL_LOST: ${esc(e.message)}</p>`;
    }
  }
});
