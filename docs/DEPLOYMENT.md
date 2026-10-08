# GitHub Pages deployment guide

The Heraldry Project uses **GitHub Pages**, built with Astro via GitHub Actions. Do not publish it through Vercel or Netlify.

## Canonical configuration

- Repo: `k3jph/heraldry.jameshoward.us` (private source).
- Production branch: `main`.
- Canonical website: `https://heraldry.jameshoward.us/`.
- Static build output: `dist/`.
- Workflow: `.github/workflows/ci.yml`.

## One-time setup

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions**.
3. In **Custom domain**, enter `heraldry.jameshoward.us` and save.
4. At the DNS provider for `jameshoward.us`, create the following record:

| Type | Host/name | Points to |
| --- | --- | --- |
| CNAME | `heraldry` | `k3jph.github.io` |

If using Cloudflare, prefer **DNS only** during initial domain verification and certificate provisioning. Avoid conflicting A/AAAA/CNAME records for the same hostname. Leave the apex domain and all other JHCU sites unchanged.

5. Enable **Enforce HTTPS** when GitHub finishes provisioning its TLS certificate.
6. Re-run the workflow manually in **Actions** if necessary.

**Important:** When using an Actions publishing workflow, the domain is controlled from the repository's Pages settings. GitHub ignores a `CNAME` file in the deployed artifact, so one is not required in `public/`.

**Private-source requirements:** GitHub Pages from private repositories requires a supported plan (for example, GitHub Team). A private *repository* does not automatically make its published Pages *website* private. The intended educational website is public; keep secret material out of the static project.

## Continuous delivery

On pull requests, the workflow installs, tests, checks TypeScript and builds without deploying. On pushes to `main`, it does the same and then uploads the build artifact and deploys it to Pages. Deployment depends on a successful build.

## Post-deployment checklist

- Check the TLS certificate and `https://heraldry.jameshoward.us/`.
- Open `/academy/`, `/atelier/`, `/decoder/`, `/tinctures/`, `/armorial/`, `/lexicon/`, `/practice/`, `/field-guide/`, `/resources/`.
- Check a deep lesson at `/academy/the-visual-language/` and lecture at `/lecture/the-visual-language/`.
- Check `/sitemap.xml`, `/robots.txt`, `/llms.txt`.
- Verify SVG/PNG export, clickable armorial examples, browser-only assessment completion, and responsive mobile layout.
- Confirm unknown pages display a helpful 404.

## Troubleshooting

If the deploy job reports that Pages is not enabled or not found, check Settings → Pages → Source. If GitHub refuses publication from a private repository, verify that the organization's GitHub plan supports private-source Pages (or explicitly elect to publish the repository publicly).

The project has no database or server-side processes. Do not introduce credential-bearing secrets into `dist/`.
