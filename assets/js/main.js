// Social icon SVG paths keyed by platform
const SOCIAL_ICONS = {
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M16 8.5v4.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.6 7.2M16 12a4 4 0 1 0-4 4"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2H21l-6.5 7.4L22 22h-6.3l-4.9-6.4L5.1 22H2.3l7-8L2 2h6.4l4.4 5.8L18.2 2Zm-1.1 18h1.7L7 3.8H5.2L17.1 20Z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.7a10.3 10.3 0 0 0-3.3 20.1c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.3 10.3 0 0 0 12 1.7Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 5.9V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9V9Z"/></svg>`,
  scholar: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 8l11 6 9-4.9V16h2V8L12 2Zm0 13.5L5 11.7v3.1A7 7 0 0 0 12 19a7 7 0 0 0 7-4.2v-3.1l-7 3.8Z"/></svg>`,
  orcid: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8.3 7.6a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm.7 9.1H7.6V8.9H9v7.8Zm6.2-3.9c0 2.5-1.6 3.9-3.9 3.9h-2V8.9h2c2.4 0 3.9 1.5 3.9 3.9Zm-1.4 0c0-1.7-1-2.6-2.5-2.6h-.7v5.2h.7c1.4 0 2.5-.8 2.5-2.6Z"/></svg>`,
};

const CAP_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 8l11 5 9-4.1V15h2V8L12 3ZM5 13.2V16c0 1.7 3.1 3 7 3s7-1.3 7-3v-2.8l-7 3.2-7-3.2Z"/></svg>`;

function safeJson(url, fallback) {
  return fetch(`${url}?v=${Date.now()}`).then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).catch(() => fallback);
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Render: Hero ───────────────────────────────────────────────────────────
function renderHero(profile) {
  const grid = document.getElementById('hero-grid');
  if (!grid) return;

  // Social links — skip empty/placeholder entries
  const socialHTML = Object.entries(profile.social || {})
    .filter(([, url]) => url && url !== '#' && url !== '')
    .map(([key, url]) => {
      const icon = SOCIAL_ICONS[key] || '';
      const href = key === 'email' ? `mailto:${url}` : url;
      const title = key.charAt(0).toUpperCase() + key.slice(1);
      return `<a href="${esc(href)}" title="${esc(title)}" target="${key === 'email' ? '_self' : '_blank'}" rel="noopener">${icon}</a>`;
    }).join('');

  // Education rows
  const eduHTML = (profile.education || []).map(e => {
    const supervisorHTML = (e.supervisors || []).filter(s => s.name).map(s =>
      s.url && s.url !== 'https://' && s.url !== ''
        ? `<a href="${esc(s.url)}" target="_blank" rel="noopener" class="supervisor-link">${esc(s.name)}</a>`
        : `<span>${esc(s.name)}</span>`
    ).join(', ');

    return `
    <div class="edu-item">
      <span class="cap">${CAP_SVG}</span>
      <div>
        <div class="deg">${esc(e.degree)}</div>
        <div class="school">${esc(e.school)}${e.years ? ' · ' + esc(e.years) : ''}</div>
        ${supervisorHTML ? `<div class="supervisor">Supervisor: ${supervisorHTML}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  // Interests list
  const interestsHTML = (profile.interests || [])
    .map(i => `<li>${esc(i)}</li>`).join('');

  // Avatar: try image, fallback to placeholder div
  const avatarHTML = profile.avatar
    ? `<img src="${esc(profile.avatar)}" alt="${esc(profile.name_en)}"
         onerror="this.parentNode.innerHTML=buildAvatarPlaceholder()">`
    : buildAvatarPlaceholder();

  grid.innerHTML = `
    <aside class="side">
      <div class="avatar">${avatarHTML}</div>
      <div class="name-en">${esc(profile.name_en || '')}</div>
      ${profile.name_cn ? `<div class="name-cn">${esc(profile.name_cn)}</div>` : ''}
      <div class="title-role">${esc(profile.title || '')}</div>
      <div class="org">${esc(profile.org || '')}</div>
      <div class="socials">${socialHTML}</div>
    </aside>

    <div class="main">
      <h2>About Me</h2>
      <p class="lead">${esc(profile.bio || '')}</p>
      ${profile.cv_url && profile.cv_url !== '#'
        ? `<a class="cv-btn" href="${esc(profile.cv_url)}" download>
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
             Download CV
           </a>`
        : ''}

      <div class="two-col">
        <div class="col">
          <h3>Interests</h3>
          <ul>${interestsHTML}</ul>
        </div>
        <div class="col" id="edu">
          <h3>Education</h3>
          ${eduHTML}
        </div>
      </div>
    </div>`;

  // Apply header background image
  if (profile.bg && profile.bg !== '') {
    const headerEl = document.querySelector('header');
    if (headerEl) {
      headerEl.style.backgroundImage = `url('${profile.bg}')`;
      headerEl.style.backgroundSize = 'cover';
      headerEl.style.backgroundPosition = 'center';
    }
  }

  // Update page title and brand
  if (profile.name_en) {
    document.title = `${profile.name_en} · ${profile.title || 'Researcher'}`;
    const brand = document.querySelector('.brand');
    if (brand) brand.textContent = profile.name_en;
  }
}

// Exposed on window so onerror inline can call it
window.buildAvatarPlaceholder = function () {
  return `<span>your<br>photo</span><div class="badge">☕</div>`;
};

// ─── Render: Ticker ─────────────────────────────────────────────────────────
function renderTicker(news) {
  const track = document.getElementById('ticker-track');
  if (!track) return;

  const items = news.slice(0, 8);
  const itemsHTML = items.map(n =>
    `<span class="item"><span class="dot">${esc(n.date)}</span> ${esc(n.title)} ${esc(n.body ? n.body.slice(0, 60) + (n.body.length > 60 ? '…' : '') : '')}</span>`
  ).join('');

  // Two copies for seamless loop
  track.innerHTML = `<span class="seg">${itemsHTML}</span><span class="seg" aria-hidden="true">${itemsHTML}</span>`;
  // Scale animation duration with item count so speed stays consistent
  track.style.animationDuration = `${items.length * 7}s`;
}

// ─── Render: Publications ────────────────────────────────────────────────────
const PUB_CATEGORIES = [
  { key: 'journal',    label: 'Journal Papers' },
  { key: 'conference', label: 'Conference Papers' },
  { key: 'preprint',   label: 'Preprints' },
];

function renderPubEntry(p) {
  const authorsHTML = (p.authors || []).map(a =>
    a.is_me ? `<b>${esc(a.name)}</b>` : esc(a.name)
  ).join(', ');

  const venue = [p.venue, p.status].filter(Boolean).join(' · ');

  const linkKeys = ['pdf', 'arxiv', 'code', 'bibtex', 'project', 'slides', 'poster', 'video'];
  const linksHTML = linkKeys
    .filter(k => p.links && p.links[k] && p.links[k] !== '#' && p.links[k] !== '')
    .map(k => `<a href="${esc(p.links[k])}" target="_blank" rel="noopener">${k}</a>`)
    .join('');

  return `
    <div class="pub">
      <div class="idx">·</div>
      <div>
        <div class="ptitle">${esc(p.title)}</div>
        <div class="authors">${authorsHTML}</div>
        ${venue ? `<div class="venue">${esc(venue)}</div>` : ''}
        ${linksHTML ? `<div class="plinks">${linksHTML}</div>` : ''}
      </div>
    </div>`;
}

function renderPublications(pubs) {
  const list = document.getElementById('pub-list');
  if (!list) return;

  if (!pubs.length) {
    list.innerHTML = `<div class="pub"><div class="idx">[ ]</div><div><div class="ptitle" style="color:var(--text-dim);font-style:italic">No publications yet — add entries to data/publications.json</div></div></div>`;
    return;
  }

  // Papers with no type go to a catch-all at the end
  const grouped = {};
  PUB_CATEGORIES.forEach(c => { grouped[c.key] = []; });
  grouped['other'] = [];

  pubs.forEach(p => {
    const key = PUB_CATEGORIES.find(c => c.key === p.type) ? p.type : 'other';
    grouped[key].push(p);
  });

  let html = '';

  PUB_CATEGORIES.forEach(cat => {
    const items = grouped[cat.key];
    if (!items.length) return;
    html += `<div class="pub-category-head">${esc(cat.label)}</div>`;
    items.forEach(p => { html += renderPubEntry(p); });
  });

  if (grouped['other'].length) {
    grouped['other'].forEach(p => { html += renderPubEntry(p); });
  }

  list.innerHTML = html;
}

// ─── Render: News ───────────────────────────────────────────────────────────
function renderNews(news) {
  const list = document.getElementById('news-list');
  if (!list) return;

  if (!news.length) {
    list.innerHTML = `<div class="news-row"><span class="date">—</span><span class="body">No news yet — add entries to data/news.json</span></div>`;
    return;
  }

  list.innerHTML = news.map(n => `
    <div class="news-row">
      <span class="date">${esc(n.date)}</span>
      <span class="body"><b>${esc(n.title)}</b> ${esc(n.body || '')}</span>
    </div>`).join('');
}

// ─── Render: Footer ─────────────────────────────────────────────────────────
function renderFooter(profile) {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="wrap">
      <span>© ${year} ${esc(profile.name_en || 'Your Name')}</span>
      <span>Built with HTML &amp; CSS · Hosted on GitHub Pages</span>
    </div>`;
}

// ─── Scroll reveal ──────────────────────────────────────────────────────────
function initScrollReveal() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ─── Theme toggle ───────────────────────────────────────────────────────────
function initThemeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById('themeBtn');
  if (!btn) return;

  // Restore saved preference
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;

  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
}

// ─── Local-file protocol warning ────────────────────────────────────────────
function showLocalWarning() {
  const banner = document.createElement('div');
  banner.className = 'local-warning';
  banner.innerHTML = `
    ⚠ You opened this file directly. <code>fetch()</code> is blocked by the browser on <code>file://</code>.
    Run a local server: <code>python3 -m http.server 8000</code> then open
    <code>http://localhost:8000</code>`;
  document.body.prepend(banner);
}

// ─── Bootstrap ──────────────────────────────────────────────────────────────
async function init() {
  initThemeToggle();

  if (location.protocol === 'file:') {
    showLocalWarning();
    return;
  }

  const [profile, pubs, news] = await Promise.all([
    safeJson('data/profile.json', {}),
    safeJson('data/publications.json', []),
    safeJson('data/news.json', []),
  ]);

  renderHero(profile);
  renderTicker(news);
  renderPublications(pubs);
  renderNews(news);
  renderFooter(profile);
  initScrollReveal();
}

init();
