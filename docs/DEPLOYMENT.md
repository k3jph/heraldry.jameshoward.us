# GitHub Pages deployment guide

The Heraldry Project uses **GitHub Pages**, built with Astro via GitHub Actions. Do not publish it through Vercel or Netlify.

## Canonical configuration

- Repo: `k3jph/heraldry.jameshoward.us` (private source).
- Production branch: `main`.
- Canonical website: `https://heraldryproject.org/`.
- Static build output: `dist/`.
- Workflow: `.github/workflows/ci.yml`.

## One-time setup

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions**.
3. In **Custom domain**, enter `heraldryproject.org` and save.
4. After registering `heraldryproject.org`, configure **apex** DNS records for GitHub Pages:

| Type | Host/name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME (optional) | `www` | `k3jph.github.io` |

At Cloudflare, start with **DNS only** until TLS and domain verification work. Avoid conflicting records for the same hostname. **Do not change DNS for `jameshoward.us`** merely because this repository keeps its old name.

5. Enable **Enforce HTTPS** when GitHub finishes provisioning its TLS certificate.
6. Re-run the workflow manually in **Actions** if necessary.

**Important:** When using an Actions publishing workflow, the domain is controlled from the repository's Pages settings. GitHub ignores a `CNAME` file in the deployed artifact, so one is not required in `public/`.

**Private-source requirements:** GitHub Pages from private repositories requires a supported plan (for example, GitHub Team). A private *repository* does not automatically make its published Pages *website* private. The intended educational website is public; keep secret material out of the static project.

## Continuous delivery

On pull requests, the workflow installs, tests, checks TypeScript and builds without deploying. On pushes to `main`, it does the same and then uploads the build artifact and deploys it to Pages. Deployment depends on a successful build.

## Post-deployment checklist

- Check the TLS certificate and `https://heraldryproject.org/`.
- Open `/academy/`, `/atelier/`, `/decoder/`, `/tinctures/`, `/armorial/`, `/lexicon/`, `/practice/`, `/field-guide/`, `/resources/`.
- Check a deep lesson at `/academy/the-visual-language/` and lecture at `/lecture/the-visual-language/`.
- Check `/sitemap.xml`, `/robots.txt`, `/llms.txt`.
- Verify SVG/PNG export, clickable armorial examples, browser-only assessment completion, and responsive mobile layout.
- Confirm unknown pages display a helpful 404.

## Development cache and local preview

Astro 5 creates transient content-layer manifests such as `.astro/content-assets.mjs` and `node_modules/.astro/data-store.json`. The local `npm run dev` script clears stale generated content and Vite caches before launch. If Vite continues resolving an obsolete manifest after rapid content changes, stop and restart development. Do not run `astro build` concurrently with the development server from the same checkout; use a separate worktree for parallel builds.

## Troubleshooting

If the deploy job reports that Pages is not enabled or not found, check Settings → Pages → Source. If GitHub refuses publication from a private repository, verify that the organization's GitHub plan supports private-source Pages (or explicitly elect to publish the repository publicly).

The project has no database or server-side processes. Do not introduce credential-bearing secrets into `dist/`.
