# nguyenduc810.github.io

Personal academic website hosted on GitHub Pages.

## Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

> Opening `index.html` directly in a browser will not work — the browser blocks `fetch()` on the `file://` protocol.

---

## How to update content

All content lives in the `data/` directory. You never need to touch `index.html`.

### Change your profile info, bio, social links

Edit **`data/profile.json`**:

```json
{
  "name_en": "Your Name",
  "name_cn": "阮德进",
  "title": "AI / ML Researcher",
  "org": "VinUniversity",
  "bio": "Your bio here...",
  "cv_url": "assets/files/cv.pdf",
  "avatar": "assets/images/avatar.jpg",
  "email": "you@vinuni.edu.vn",
  "social": {
    "email": "you@vinuni.edu.vn",
    "twitter": "https://x.com/yourhandle",
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "scholar": "https://scholar.google.com/citations?user=XXXX",
    "orcid": "https://orcid.org/0000-0000-0000-0000"
  }
}
```

- Leave any social link **empty `""`** to hide it.
- `cv_url` — set to the path of your CV PDF, or `""` to hide the button.

### Change your avatar photo

1. Drop your photo into `assets/images/` (any filename, e.g. `photo.jpg`)
2. Update `"avatar": "assets/images/photo.jpg"` in `data/profile.json`

Or simply replace `assets/images/avatar.jpg` directly (keep the filename).

### Change the header background

Open `assets/css/style.css` and add one line inside the `header` block:

```css
header {
  /* existing styles... */
  background-image: url('../images/bg.jpg');
  background-size: cover;
  background-position: center;
}
```

### Add a publication

Open **`data/publications.json`** and append an object:

```json
{
  "id": 3,
  "title": "Your paper title",
  "authors": [
    {"name": "Your Name", "is_me": true},
    {"name": "Co-author A"}
  ],
  "venue": "Conference Name · 2026",
  "status": "Under review",
  "links": {
    "pdf": "https://...",
    "arxiv": "https://arxiv.org/abs/...",
    "code": "https://github.com/...",
    "bibtex": ""
  }
}
```

- Set `"is_me": true` on your name to bold it.
- Any link that is `""` or missing will be hidden automatically.
- Supported link keys: `pdf`, `arxiv`, `code`, `bibtex`, `project`, `slides`, `poster`, `video`.

### Add a news item

Open **`data/news.json`** and **prepend** (add at the top):

```json
{
  "date": "Jun 2026",
  "title": "Short headline.",
  "body": "Longer description that appears in the news section."
}
```

The ticker strip at the top of the page auto-updates from this file too.

---

## File structure

```
index.html              Static shell — do not edit for content changes
assets/
  css/style.css         All styles
  js/main.js            Renders content from JSON + theme + animations
  images/
    avatar.jpg          Replace with your photo
data/
  profile.json          Personal info, social links, education
  publications.json     Paper entries
  news.json             News items (newest first)
```

## Deploy

Push to `main` — GitHub Pages publishes automatically.
