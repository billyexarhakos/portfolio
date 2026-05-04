# IDE-style Personal Website (CS PhD)

A personal website that looks like an in-IDE AI coding assistant: file explorer + editor tabs + editor surface + assistant chat + terminal + status bar.

## Develop

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Edit your content

All placeholder content lives in:

- `src/content/siteData.ts`

Replace the TODOs there (name, affiliation, research themes, publications, links, etc.).

## Static export (works with GitHub Pages / Netlify / S3)

Build output is written to `out/`:

```bash
npm run build
```

### GitHub Pages base path

If your site is served from a subpath (e.g. `https://user.github.io/repo/`), set:

```bash
NEXT_PUBLIC_BASE_PATH=/repo npm run build
```

and deploy the `out/` directory.
