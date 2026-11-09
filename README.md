# System Design Pro

Open-source, beginner-to-advanced interactive system design curriculum using **Next.js App Router**, **MDX**, **Tailwind CSS**, and **Motion** with Java/Spring Boot production notes.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000. To validate the GitHub Pages static export:

```bash
npm run build
```

The output appears in `out/`. **Do not use `next start` with `output: export`**. Preview the `out` directory with a static file server if necessary.

## What changed

- Replaced `app/[[...slug]]` with `app/[...slug]` and added dedicated `app/page.tsx`. Empty catch-all slug values no longer block static export.
- `generateStaticParams()` discovers all `.mdx` files in `content` at build time.
- Added grouped lesson cards and multiple curriculum modules.
- Added an interactive round-robin traffic simulator and retained the consistent-hashing demo.

## Add a lesson

1. Create `content/03-caching/new-topic.mdx`.
2. Start the file with `# New Topic`.
3. Add Markdown or supported registered React components.
4. Run `npm run build` to generate its static route. The homepage lists it automatically.

## GitHub Pages

Create a GitHub repository, commit the project, and set **Settings → Pages → Source: GitHub Actions**. The included workflow sets `GITHUB_PAGES=true`, so Next.js derives the project repository basePath from `GITHUB_REPOSITORY`.

## Important notes

- React components used directly inside MDX must be registered in `app/[...slug]/page.tsx`.
- All lesson routes are compiled at build time. No dynamic server features on GitHub Pages.
- The example simulations teach intuition, not benchmark production implementations.
- The starter is MIT licensed. Contributions and corrections are welcome.

## Interactive labs (all 23 lessons)

Every lesson embeds `ConceptLab` with a topic-specific real-world scenario, four-stage interactive walkthrough, autoplay/pause/previous/reset controls, and Java/Spring Boot tradeoffs. Existing dedicated Consistent Hashing and Traffic Simulator animations remain available.

**Important when upgrading an existing local directory:** remove the legacy `app/[[...slug]]` folder; only `app/[...slug]` and `app/page.tsx` should remain.

```powershell
Remove-Item -LiteralPath 'app/[[...slug]]' -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm install
npm run build
```


### Concept illustrations

Every lesson includes an original, lightweight SVG concept illustration under `public/illustrations/`. The MDX `<ConceptIllustration>` component handles the GitHub Pages base path. These visuals are intentionally simplified teaching diagrams, not exact production architectures. No external image service or API key is required.


## Premium concept artwork (first 10)

Ten high-resolution generated PNG artworks are stored under `public/concept-art/` and automatically loaded by `ConceptHero` and `ConceptIllustration`. They replace the older SVGs in both the top lesson hero and the visual overview for: Internet, DNS, HTTP/HTTPS, Load Balancing, Consistent Hashing, Cache Aside, SQL vs NoSQL, Kafka, Rate Limiting and CAP. All 23 lessons retain MDX explanations and simulations. The remaining 13 still use the existing SVGs. The artwork is decorative/explanatory rather than the authoritative source of algorithmic behavior; interactive components supply the dynamic behavior.


## Premium concept artwork

All 23 lessons now use locally hosted high-resolution PNGs in `public/concept-art/`. The same artwork appears in the lesson hero and visual overview. Original SVGs remain in `public/illustrations/` as fallbacks.
