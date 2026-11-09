// ── Helpers ─────────────────────────────────────────────────
const getJson = url => fetch(`${url}?v=${Date.now()}`)
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ok = url => url && url !== '#';
const $ = id => document.getElementById(id);

const ICONS = {
  email:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>`,
  github:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.7a10.3 10.3 0 0 0-3.3 20.1c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.3 10.3 0 0 0 12 1.7Z"/></svg>`,
  scholar:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 8l11 6 9-4.9V16h2V8L12 2Zm0 13.5L5 11.7v3.1A7 7 0 0 0 12 19a7 7 0 0 0 7-4.2v-3.1l-7 3.8Z"/></svg>`,
  linkedin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 5.9V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9V9Z"/></svg>`,
  twitter:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2H21l-6.5 7.4L22 22h-6.3l-4.9-6.4L5.1 22H2.3l7-8L2 2h6.4l4.4 5.8L18.2 2Zm-1.1 18h1.7L7 3.8H5.2L17.1 20Z"/></svg>`,
  instagram:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  orcid:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8.3 7.6a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm.7 9.1H7.6V8.9H9v7.8Zm6.2-3.9c0 2.5-1.6 3.9-3.9 3.9h-2V8.9h2c2.4 0 3.9 1.5 3.9 3.9Zm-1.4 0c0-1.7-1-2.6-2.5-2.6h-.7v5.2h.7c1.4 0 2.5-.8 2.5-2.6Z"/></svg>`,
};

const SOCIAL = [
  ['email', 'Email'], ['scholar', 'Google Scholar'], ['github', 'GitHub'],
  ['linkedin', 'LinkedIn'], ['orcid', 'ORCID'], ['twitter', 'X / Twitter'], ['instagram', 'Instagram'],
];

// ── Sidebar ─────────────────────────────────────────────────
function renderSidebar(P) {
  const s = P.social || {};
  const items = SOCIAL.filter(([k]) => ok(s[k])).map(([k, label]) => {
    const href = k === 'email' ? `mailto:${s[k]}` : s[k];
    const text = k === 'email' ? s[k] : label;
    const ext = k === 'email' ? '' : ' target="_blank" rel="noopener"';
    return `<li>${ICONS[k] || ''}<a href="${esc(href)}"${ext}>${esc(text)}</a></li>`;
  }).join('');

  $('sidebar').innerHTML = `
    <img class="avatar" src="${esc(P.avatar)}" alt="Portrait of ${esc(P.name_en)}">
    <h1>${esc(P.name_en)}</h1>
    <div class="role">${esc(P.title)}<br>
      <a href="${esc(P.org_url || '#')}" target="_blank" rel="noopener">${esc(P.org)}</a>, ${esc(P.location || '')}</div>
    <ul>${items}</ul>
    ${P.cv_url ? `<a class="cv-btn" href="${esc(P.cv_url)}" target="_blank" rel="noopener">Curriculum Vitae (PDF)</a>` : ''}`;
}

// ── About ───────────────────────────────────────────────────
// `about` paragraphs are trusted HTML written by the site owner in profile.json.
function renderAbout(P) {
  const paras = (P.about || []).map(p => `<p>${p}</p>`).join('');
  const quote = P.quote ? `<p class="quote">${esc(P.quote)}</p>` : '';
  const chips = (P.interests || []).map(i => `<span>${esc(i)}</span>`).join('');
  $('about-body').innerHTML = `${paras}${quote}
    ${chips ? `<div class="interests-label">Research interests</div><div class="chips">${chips}</div>` : ''}`;
}

// ── News ────────────────────────────────────────────────────
function renderNews(news) {
  if (!$('news-list')) return;
  $('news-list').innerHTML = news.map(n => `
    <tr><td class="d">${esc(String(n.date).replace(/^(\w{3})\w*/, '$1'))}</td>
        <td><b>${esc(n.title)}.</b> ${esc(n.body || '')}</td></tr>`).join('');
}

// ── Publications ────────────────────────────────────────────
const LINK_KEYS = ['pdf', 'arxiv', 'code', 'project', 'slides', 'poster', 'video', 'bibtex'];

function pubYear(p) {
  if (p.year) return Number(p.year);
  const m = String(p.venue || '').match(/\b(20\d{2})\b/);
  return m ? Number(m[1]) : 0;
}

function renderPub(p) {
  const authors = (p.authors || []).map(a =>
    a.is_me ? `<span class="me">${esc(a.name)}</span>` : esc(a.name)).join(', ');
  const venue = p.type === 'preprint'
    ? 'arXiv preprint'
    : String(p.venue || '').replace(/\s*·\s*\d{4}.*$/, '').replace(/\s*\([^)]*\)\s*$/, '');
  const links = LINK_KEYS.filter(k => ok(p.links?.[k]))
    .map(k => `<a href="${esc(p.links[k])}" target="_blank" rel="noopener">${k === 'bibtex' ? 'bib' : k}</a>`).join('');
  const thumb = p.thumbnail && !/\.pdf$/i.test(p.thumbnail)
    ? `<img class="thumb" src="${esc(p.thumbnail)}" alt="" loading="lazy" onerror="this.remove()">` : '';

  return `
    <article class="pub">
      <div class="media"><span class="badge ${esc(p.type)}">${esc(p.abbr || '')}</span>${thumb}</div>
      <div>
        <div class="pt">${esc(p.title)}</div>
        <div class="au">${authors}</div>
        <div class="ve">${esc(venue)}, ${pubYear(p) || ''}${p.status ? ` · <span class="st">${esc(p.status)}</span>` : ''}</div>
        ${links ? `<div class="btns">${links}</div>` : ''}
      </div>
    </article>`;
}

function renderPublications(pubs) {
  const published = pubs.filter(p => p.type !== 'preprint').sort((a, b) => pubYear(b) - pubYear(a));
  const preprints = pubs.filter(p => p.type === 'preprint').sort((a, b) => pubYear(b) - pubYear(a));
  const years = [...new Set(published.map(pubYear))];

  let html = '';
  years.forEach(y => {
    html += `<div class="yr">${y}</div>${published.filter(p => pubYear(p) === y).map(renderPub).join('')}`;
  });
  if (preprints.length) html += `<div class="yr">Preprints</div>${preprints.map(renderPub).join('')}`;
  $('pub-list').innerHTML = html || '<p class="note">No publications yet.</p>';
}

// ── Experience & Education ─────────────────────────────────
// `points` are trusted HTML written by the site owner in profile.json.
function renderExperience(P) {
  $('exp-list').innerHTML = (P.experience || []).map(e => `
    <div class="row">
      <div class="y">${esc(e.years)}</div>
      <div>
        <div class="h">${esc(e.role)}</div>
        <div class="s">${esc(e.org)}${e.advisors ? ` · Advisor: ${esc(e.advisors)}` : ''}</div>
        ${e.points?.length ? `<ul>${e.points.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`).join('');
}

function renderEducation(P) {
  $('edu-list').innerHTML = (P.education || []).map(e => {
    const sup = (e.supervisors || []).map(s => ok(s.url)
      ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : esc(s.name)).join(', ');
    return `
      <div class="row">
        <div class="y">${esc(e.years || '')}</div>
        <div>
          <div class="h">${esc(e.degree)}</div>
          <div class="s">${esc(e.school)}${sup ? ` · Advisor: ${sup}` : ''}</div>
        </div>
      </div>`;
  }).join('');
}

// ── Extras: thumbnail lightbox, active nav link, footer ────
function initLightbox() {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = '<img alt="">';
  document.body.appendChild(box);
  document.addEventListener('click', e => {
    if (e.target.classList.contains('thumb') || e.target.classList.contains('zoomable')) {
      box.querySelector('img').src = e.target.src;
      box.classList.toggle('wide', e.target.classList.contains('zoomable'));
      box.classList.add('open');
    } else if (box.contains(e.target)) box.classList.remove('open');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') box.classList.remove('open'); });
}

function initActiveNav() {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section').forEach(s => io.observe(s));
}

function renderFooter(P) {
  const d = new Date(document.lastModified);
  const updated = isNaN(d) ? '' : ` · Last updated ${d.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
  $('site-footer').textContent = `© ${new Date().getFullYear()} ${P.name_en || ''}${updated}`;
}

// ── Bootstrap ───────────────────────────────────────────────
async function init() {
  if (location.protocol === 'file:') {
    document.body.insertAdjacentHTML('afterbegin',
      '<div style="background:#5a2d00;color:#ffd580;font:13px monospace;padding:10px;text-align:center">' +
      'Open via a local server: <code>python3 -m http.server 8000</code> → http://localhost:8000</div>');
    return;
  }
  const [P, pubs, news] = await Promise.all([
    getJson('data/profile.json').catch(() => ({})),
    getJson('data/publications.json').catch(() => []),
    getJson('data/news.json').catch(() => []),
  ]);
  renderSidebar(P);
  renderAbout(P);
  renderNews(news);
  renderPublications(pubs);
  renderExperience(P);
  renderEducation(P);
  renderFooter(P);
  initLightbox();
  initActiveNav();
}

init();
