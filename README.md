# pixelthesprite.github.io

Mike's personal portfolio: a small, 90s-style home for side projects, some hand-built and some AI-assisted.

Live site: https://pixelthesprite.github.io

Plain HTML, CSS and JavaScript with no build step.

| File | What it is |
|---|---|
| `index.html` | Home: welcome message and cat photo carousel |
| `about.html`, `projects.html`, `contact.html` | The other pages in the toolbar |
| `assets/css/style.css` | All styles; colors are variables at the top (with dark-mode versions) |
| `assets/js/carousel.js` | The photo carousel |
| `assets/data/photos.json` | The carousel's photos, Instagram links and descriptions |
| `.github/workflows/deploy.yml` | Publishes the site on every push to `main` |

The toolbar and footer are copied into each page. When you change one (say, adding a toolbar link), update all four pages. In each page's toolbar, `aria-current="page"` marks that page's own link so it shows as selected.

To preview locally, use the `test-harness` folder next to this repo (`.\preview.ps1`).

`README.md`, `ROADMAP.md` and anything starting with a dot are not published.
