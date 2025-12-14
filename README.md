# Recipe Book

Static recipe site built with Hugo (GitHub Pages compatible).

## Local dev
- Run `hugo server`

## Add a recipe
- Create a file in `content/recipes/` using `recipe-template.md` (or run `hugo new recipes/<slug>.md`)
- Optional hero image: add `static/images/<slug>.jpg`

## Migrate older recipes
If you still have legacy Markdown files in `static/recipes/*.md`, run:
- `node scripts/migrate-recipes.mjs`

## Deploy
GitHub Pages deploys via `.github/workflows/hugo.yml` (Settings → Pages → Source = GitHub Actions).

## “App-like” install (iOS)
- iOS will only launch as a standalone “app” (no URL bar/toolbars) when you use **Safari** → Share → **Add to Home Screen**.
- If you add it from **Chrome on iOS**, it will open in Chrome (tabbed, with toolbars). That behavior can’t be overridden by the site.
- For the best icon on iOS, add a 180×180 PNG at `static/apple-touch-icon.png`.
