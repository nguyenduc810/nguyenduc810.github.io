function safeJson(url, fallback) {
  return fetch(`${url}?v=${Date.now()}`).then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).catch(() => fallback);
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractYear(venue) {
  const m = String(venue || '').match(/\b(20\d{2})\b/);
  return m ? m[1] : '—';
}

// ── Social icon SVGs ────────────────────────────────────────
const ICONS = {
  email:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>`,
  github:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.7a10.3 10.3 0 0 0-3.3 20.1c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.3 10.3 0 0 0 12 1.7Z"/></svg>`,
  scholar:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 8l11 6 9-4.9V16h2V8L12 2Zm0 13.5L5 11.7v3.1A7 7 0 0 0 12 19a7 7 0 0 0 7-4.2v-3.1l-7 3.8Z"/></svg>`,
  linkedin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 5.9V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9V9Z"/></svg>`,
  twitter:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2H21l-6.5 7.4L22 22h-6.3l-4.9-6.4L5.1 22H2.3l7-8L2 2h6.4l4.4 5.8L18.2 2Zm-1.1 18h1.7L7 3.8H5.2L17.1 20Z"/></svg>`,
  instagram:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  orcid:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8.3 7.6a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm.7 9.1H7.6V8.9H9v7.8Zm6.2-3.9c0 2.5-1.6 3.9-3.9 3.9h-2V8.9h2c2.4 0 3.9 1.5 3.9 3.9Zm-1.4 0c0-1.7-1-2.6-2.5-2.6h-.7v5.2h.7c1.4 0 2.5-.8 2.5-2.6Z"/></svg>`,
};

const SOCIAL_LABELS = {
  email: 'Email', github: 'GitHub', scholar: 'Scholar',
  linkedin: 'LinkedIn', twitter: 'X / Twitter',
  instagram: 'Instagram', orcid: 'ORCID',
};

// ── Hero ────────────────────────────────────────────────────
function renderHero(profile) {
  const grid = document.getElementById('hero-grid');
  if (!grid) return;

  // Social links
  const socialHTML = Object.entries(profile.social || {})
    .filter(([, url]) => url && url !== '' && url !== '#')
    .map(([key, url]) => {
      const href = key === 'email' ? `mailto:${url}` : url;
      const label = SOCIAL_LABELS[key] || key;
      const icon = ICONS[key] || '';
      return `<a href="${esc(href)}" target="${key === 'email' ? '_self' : '_blank'}" rel="noopener">${icon} ${esc(label)}</a>`;
    }).join('');

  // Portrait: image or placeholder
  const avatarInner = profile.avatar
    ? `<img src="${esc(profile.avatar)}" alt="${esc(profile.name_en)}"
         onerror="this.parentNode.innerHTML=this.parentNode.innerHTML.replace(this.outerHTML,'<div class=\\'placeholder\\'><svg viewBox=\\'0 0 100 120\\' width=\\'120\\' fill=\\'#8FB0A0\\'><circle cx=\\'50\\' cy=\\'42\\' r=\\'22\\'/><path d=\\'M12 120 C12 88 30 74 50 74 C70 74 88 88 88 120 Z\\'/></svg></div>')">`
    : `<div class="placeholder">
         <svg viewBox="0 0 100 120" width="120" fill="#8FB0A0" aria-hidden="true">
           <circle cx="50" cy="42" r="22"/>
           <path d="M12 120 C12 88 30 74 50 74 C70 74 88 88 88 120 Z"/>
         </svg>
       </div>`;

  // CV button
  const cvBtn = profile.cv_url
    ? `<a class="btn" href="${esc(profile.cv_url)}" target="_blank" rel="noopener">Curriculum Vitae</a>`
    : '';

  // Education inline
  const eduHTML = (profile.education || []).map(e => {
    const supervisorHTML = (e.supervisors || []).filter(s => s.name)
      .map(s => s.url && s.url !== '' && s.url !== 'https://'
        ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`
        : esc(s.name)
      ).join(', ');
    const years = (e.years || '').replace(/–present/, '–now');
    return `<div class="edu-inline-item">
      <div class="edu-inline-deg">${esc(e.degree)}${years ? ` <span class="edu-inline-years">${esc(years)}</span>` : ''}</div>
      <div class="edu-inline-school">${esc(e.school)}${supervisorHTML ? ` · Advisor: ${supervisorHTML}` : ''}</div>
    </div>`;
  }).join('');

  grid.innerHTML = `
    <div class="hero-text">
      <p class="eyebrow reveal">${esc(profile.title || '')} · ${esc(profile.org || '')}</p>
      <h1 class="hero-name reveal">${esc(profile.name_en || '')}</h1>
      <div class="hero-about reveal">
        <p>${esc(profile.bio || '')}</p>
      </div>
      ${eduHTML ? `<div class="edu-inline reveal">${eduHTML}</div>` : ''}
      <div class="hero-links reveal">
        ${cvBtn}
      </div>
    </div>

    <div class="portrait reveal">
      <svg class="hero-svg" viewBox="0 0 300 300" fill="none" aria-hidden="true">
        <g stroke="#C9D3CC" stroke-width="1">
          <line x1="40" y1="20" x2="40" y2="260"/>
          <line x1="40" y1="260" x2="280" y2="260"/>
        </g>
        <g fill="#C4CDC6">
          <circle cx="120" cy="180" r="3.4"/><circle cx="150" cy="150" r="3.4"/>
          <circle cx="95" cy="220" r="3.4"/><circle cx="185" cy="120" r="3.4"/>
          <circle cx="170" cy="185" r="3.4"/><circle cx="110" cy="150" r="3.4"/>
        </g>
        <path d="M55 235 Q70 120 130 95 Q200 62 255 55" stroke="#2E6B57" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <g fill="#2E6B57">
          <circle cx="55" cy="235" r="4.6"/><circle cx="90" cy="150" r="4.6"/>
          <circle cx="130" cy="95" r="4.6"/><circle cx="190" cy="68" r="4.6"/>
          <circle cx="255" cy="55" r="4.6"/>
        </g>
      </svg>

      <div class="portrait-frame">${avatarInner}</div>

      <div class="portrait-contact">${socialHTML}</div>
    </div>`;

  // Update page title and nav brand
  if (profile.name_en) {
    document.title = `${profile.name_en} — Researcher`;
    const brand = document.getElementById('nav-brand');
    if (brand) {
      const parts = profile.name_en.split(' ');
      const last = parts[parts.length - 1];
      brand.innerHTML = `${esc(last)}<span class="dot">.</span>`;
    }
  }

  // Apply bg image if set
  if (profile.bg) {
    document.querySelector('header.hero').style.backgroundImage = `url('${profile.bg}')`;
    document.querySelector('header.hero').style.backgroundSize = 'cover';
    document.querySelector('header.hero').style.backgroundPosition = 'center 65%';
  }
}

// ── Publications ────────────────────────────────────────────
const PUB_CATEGORIES = [
  { key: 'journal',    label: 'Journal Papers' },
  { key: 'conference', label: 'Conference Papers' },
  { key: 'preprint',   label: 'Preprints' },
];

function renderPubEntry(p) {
  const authorsHTML = (p.authors || []).map(a =>
    a.is_me ? `<b>${esc(a.name)}</b>` : esc(a.name)
  ).join(', ');

  const year = extractYear(p.venue);
  const venueName = (p.venue || '').replace(/·?\s*\d{4}.*/, '').replace(/ - .*/, '').trim();
  const venueDisplay = [venueName, p.status].filter(Boolean).join(' · ');

  const linkKeys = ['pdf', 'arxiv', 'code', 'bibtex', 'project', 'slides', 'poster', 'video'];
  const linksHTML = linkKeys
    .filter(k => p.links && p.links[k] && p.links[k] !== '#' && p.links[k] !== '')
    .map(k => `<a href="${esc(p.links[k])}" target="_blank" rel="noopener">${k.toUpperCase()}</a>`)
    .join('');

  const isPdf = p.thumbnail && p.thumbnail.toLowerCase().endsWith('.pdf');
  const thumbHTML = p.thumbnail && !isPdf
    ? `<div class="pub-thumb-wrap"><img src="${esc(p.thumbnail)}" alt="${esc(p.title)}" loading="lazy" onerror="this.parentNode.style.display='none'"></div>`
    : '';

  return `
    <div class="pub reveal">
      <div class="pub-year">${esc(year)}</div>
      <div>
        <p class="pub-title">${esc(p.title)}</p>
        <p class="pub-meta">${authorsHTML}</p>
        ${venueDisplay ? `<span class="venue">${esc(venueDisplay)}</span>` : ''}
        ${thumbHTML}
        ${linksHTML ? `<div class="pub-links">${linksHTML}</div>` : ''}
      </div>
    </div>`;
}

function renderPublications(pubs) {
  const list = document.getElementById('pub-list');
  if (!list) return;

  if (!pubs.length) {
    list.innerHTML = `<p style="color:var(--ink-faint);font-family:'JetBrains Mono',monospace;font-size:14px;">No publications yet.</p>`;
    return;
  }

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
  grouped['other'].forEach(p => { html += renderPubEntry(p); });

  list.innerHTML = html;
}

// ── News ────────────────────────────────────────────────────
function renderNews(news) {
  const list = document.getElementById('news-list');
  if (!list) return;

  list.innerHTML = news.map(n => `
    <div class="news-item reveal">
      <span class="news-date">${esc(n.date)}</span>
      <span class="news-body"><strong>${esc(n.title)}</strong> ${esc(n.body || '')}</span>
    </div>`).join('');
}

// ── Education ────────────────────────────────────────────────
function renderEducation(profile) {
  const list = document.getElementById('edu-list');
  if (!list) return;

  list.innerHTML = (profile.education || []).map(e => {
    const supervisorHTML = (e.supervisors || []).filter(s => s.name)
      .map(s => s.url && s.url !== '' && s.url !== 'https://'
        ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`
        : esc(s.name)
      ).join(', ');

    const yearsShort = (e.years || '').replace(/–present/, '–now');

    return `
      <div class="edu-item reveal">
        <div class="edu-years">${esc(yearsShort)}</div>
        <div>
          <div class="edu-deg">${esc(e.degree)}</div>
          <div class="edu-school">${esc(e.school)}</div>
          ${supervisorHTML ? `<div class="edu-supervisor">Supervisor: ${supervisorHTML}</div>` : ''}
        </div>
      </div>`;
  }).join('');
}

// ── Footer ──────────────────────────────────────────────────
function renderFooter(profile) {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = `<div class="wrap">© ${year} ${esc(profile.name_en || 'Researcher')} · built with care</div>`;
}

// ── Scroll reveal ───────────────────────────────────────────
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 5) * 60}ms`;
    io.observe(el);
  });
}

// ── Local file warning ──────────────────────────────────────
function showLocalWarning() {
  const b = document.createElement('div');
  b.style.cssText = 'background:#5a2d00;color:#ffd580;font-family:monospace;font-size:13px;padding:10px 28px;text-align:center;';
  b.innerHTML = `⚠ Open via a local server: <code>python3 -m http.server 8000</code> → <code>http://localhost:8000</code>`;
  document.body.prepend(b);
}

// ── Bootstrap ───────────────────────────────────────────────
async function init() {
  if (location.protocol === 'file:') { showLocalWarning(); return; }

  const [profile, pubs, news] = await Promise.all([
    safeJson('data/profile.json', {}),
    safeJson('data/publications.json', []),
    safeJson('data/news.json', []),
  ]);

  renderHero(profile);
  renderPublications(pubs);
  renderNews(news);
  renderEducation(profile);
  renderFooter(profile);
  initScrollReveal();
}

init();
