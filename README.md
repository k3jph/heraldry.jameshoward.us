# The Heraldry Project

**The language of arms, opened to everyone.** An independent, interactive school of heraldry at [heraldryproject.org](https://heraldryproject.org/).

Built with [Astro](https://astro.build/) and published using **GitHub Pages**.

## Learn, draw, research

- **Academy:** 12 expanded self-paced readings in `src/content/foundation/`, covering visual identity, tinctures, geometry, charges, blazon, cadency, marshalling, institutions and documentary research. Footnotes, chapter navigation, worked problems, answer discussions, and a capstone are rendered as static HTML. First teaching drafts await specialist review and further expansion.
- **Guided lectures:** 12 shorter introductory presentations with readable scripts and optional browser-native narration, linked to the expanded chapters.
- **Atelier:** Design original vector shields using field divisions, tinctures, ordinaries and charges. Switch to engraved hatching, view an introductory blazon, export SVG or PNG, and share a design by URL.
- **Blazon decoder:** Write a supported simple blazon to generate an illustration; the parser declines unsupported constructions rather than guessing.
- **Tincture laboratory:** View heraldic colours, historical monochrome hatching, and a 49-cell contrast matrix.
- **Teaching armorial:** 16 original examples, deliberately distinguished from authentic registered grants, each directly editable in the Atelier.
- **Practice:** A ten-round shield-reading challenge.
- **Lexicon:** Search 399 heraldic, comparative and archival terms, with accent-insensitive queries, subject and source-linked filters, permanent links, and 166 documentary pointers for 103 terms; a browser-only recall deck at `/lexicon/study/`.
- **Field guide and resources:** Annotated historical chronology, myths, comparison of jurisdictions, and links to the original heraldic authorities.

## Editorial commitments

1. **Accuracy before folklore.** Shared surnames do not establish the right to a coat of arms. A crest is not the shield or the entire achievement.
2. **Show, don't just tell.** Where possible, a learner can manipulate the relevant ideas.
3. **Teach the difference between rules and customs.** Heraldic practices, law and entitlements differ by jurisdiction.
4. **Original illustrations.** The pedagogical shields are original teaching designs, not purported grants.
5. **Local progress and optional measurement.** Exercise progress and research drafts stay in the visitor's browser. Google Analytics loads only after consent; the shared JHCU banner and footer Cookie Settings manage that choice. See the [privacy and cookie notice](https://heraldryproject.org/privacy-and-cookie-notice/).
6. **Accessibility and openness.** Semantic pages, keyboard operability, reduced-motion support, reading transcripts, and printable lessons.

## Development

Requires Node.js 22+.

```sh
npm install
npm run dev
npm run dev:reset  # only after stopping the running dev server, if generated content becomes stale
npm test
npm run check
npm run build
npm run preview
```

**Local development and Astro's content cache:** `npm run dev` clears stale generated `.astro/`, `node_modules/.astro/` and Vite cache files before starting; Astro regenerates them automatically. If Vite reports `.astro/content-assets.mjs` missing, stop the dev server and restart `npm run dev`. Do not run `astro build` and `astro dev` simultaneously in the same checkout: both write generated manifests. Use another Git worktree for a parallel build. `npm run dev:reset` regenerates content/types without launching a server.

Output is `dist/`. The GitHub Actions workflow `.github/workflows/ci.yml` validates PRs and, when enabled, builds and deploys `main` to **GitHub Pages**. See [Deployment](docs/DEPLOYMENT.md).

## Independence and limitations

This is not a heraldic authority and does not issue grants, certify eligibility, determine uniqueness, or award accredited university credit. The automated blazon and contrast tools intentionally cover only an introductory subset of heraldry. Consult the College of Arms, Court of the Lord Lyon, Canadian Heraldic Authority, or other competent institution for jurisdiction-specific questions.

Created by **James P. Howard, II** — [jameshoward.us](https://jameshoward.us/).

## Open-ended academic mission

Read [Editorial Mandate](docs/EDITORIAL_MANDATE.md) and [International Research Backlog](docs/RESEARCH_BACKLOG.md). The twelve original lessons are the **introductory foundation**, not the finish line. The site also contains an active international comparative research program in `src/content/traditions/` and a source ledger in `src/data/world-sources.json`. Original-language notes are **English research synopses**, not wholesale translations of copyrighted works. Expand these until the regional and graduate research standards in the mandate are met.

### Graduate research series

The six graduate-methods seminars in `src/content/seminars/` cover archival source criticism, multilingual translation, comparative institutional history, digital-humanities data modeling, visual/material evidence, and a publishable capstone. These are substantive research methods readings with original-language sources and advanced written assignments, not accredited coursework.

### Parallel primary texts

The original-language exercises at `/translation-lab/` present a growing set of source-checked short excerpts from actual documents in multiple non-English languages. Every extract has a precise source locator, original text, a cautious English translation, terminology, historical/legal commentary, and a graduate follow-up exercise. Full texts are linked rather than copied wholesale.

