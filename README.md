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

