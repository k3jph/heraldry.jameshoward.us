# Research and publication audit — 8 October 2026

**Status: substantial first expansion; NOT academically complete.**

This document records the project honestly for future collaborators and further assistant work. The standing objective is the [editorial mandate](EDITORIAL_MANDATE.md), tracked in the [open umbrella issue](https://github.com/k3jph/heraldry.jameshoward.us/issues/1) and the [research backlog](RESEARCH_BACKLOG.md).

## What exists in the repository

| Area | Current implementation | Qualification |
| --- | --- | --- |
| Introductory academy | 12 foundation lessons with objectives, 36 questions, examples and brief exercises | Short preliminary texts; not yet full university-level chapters |
| Guided presentations | 12 navigable browser presentations | Optional device text-to-speech, **not** recorded video lectures |
| World research | 17 original English comparative chapters | Advanced teaching surveys, often based on few institutional sources; not peer reviewed monographs |
| Research atlas | 27 original-language source records in 15 languages and 17 regional clusters | Includes primary legislation, official finding aids, expert associations and archive portals; **not every item is a primary historical witness** |
| Translation lab | 11 brief original excerpts and editorial English translations in 10 languages | Short, attributed, source-linked passages; not authorized translations or specialist-reviewed critical editions |
| Graduate research | 6 graduate-method seminars | Serious methodology and assignments, but not a full graduate degree or supervised seminar series |
| Illustrated armorial | 16 original pedagogical designs | Teaching designs, not authenticated historic grants |
| Atelier | SVG vector design, basic blazon generation, hatching mode, PNG/SVG exports, URL sharing | Does not establish unique arms, legal eligibility or complete grammatical validity |
| Lexicon | 367 concise entries across 11 categories | International working translations, art, legal and manuscript terminology; specialist review and dated attestations still needed |
| Citation export | Per-record copy of BibTeX, RIS and CSL JSON; full-bibliography downloads | Original titles and access dates retained; publication dates must not be guessed |
| Deployment | GitHub Actions tests/checks/build; deploy to GitHub Pages | Until Settings → Pages → GitHub Actions is enabled, build can succeed and deployment can still fail |

## Specific scholarly limitations

1. **Historical artifacts:** An actual critical armorial museum needs rights-cleared photographic or manuscript images, page/folio/shelfmark references, and provenance. The currently illustrated gallery is original teaching art only. The Portuguese *Livro do Armeiro-Mor*, book 19, folio 87 is a promising object-level source link, but not a completed gallery entry.
2. **Translations:** Source-language fragments have been checked against the online institutional versions; their English interpretations are *model-assisted original editorial drafts* awaiting competent human/native-language review. A translation of a brief clause does not constitute a full translation of an entire document. Do not label the collection a critical multilingual edition yet.
3. **Breadth:** Major traditions and regions lack substantial content, including Switzerland, Austria, German regional archival studies, Denmark, Norway, Iceland, the Balkans, Hungary, Slovakia, a fuller account of the Baltic states, the wider Americas and Africa, and comparative Asian emblematic practices.
4. **Depth:** The original 12-unit Academy is very short: about 3,400 words of substantive exposition across all units. Each needs extensive development, primary object examples, real source citations embedded in the prose, problem sets, detailed answers, and actual scripts for video.
5. **Source nature:** The current atlas mixes formal laws, institution descriptions, catalogs and scholarly associations. Every entry states its kind. A government *finding aid* cannot be treated as proof of the historical content of a manuscript that has not been consulted.
6. **Law:** Many sources are current consolidated statutes with amendment histories. A statement of what rules applied in 1998, 2015 or today must cite the applicable version, not merely the current URL.
7. **Rights and ethics:** No mass copying of national coats or archival photographs without reviewing the applicable reproduction rights. Do not republish personal identification numbers, private addresses, or sensitive details from modern armorial registration records.
8. **Quality review:** A green Astro build does not certify that every historical proposition, spelling, translation, bibliography link, or artistic reconstruction is correct. Regional subject-matter and language specialists must review before formal scholarly claims.

## Technical acceptance and pending release

The technical build pipeline runs `npm test`, `npm run check`, and `npm run build`. Each updated commit gets a GitHub Actions run; successful build and tests do not automatically mean Pages has been enabled for the repository. Its current `github-pages` deploy configuration requires the owner to select GitHub Actions in Settings → Pages.

Follow up with an actual phone and desktop browser QA pass, keyboard and screen-reader testing, automated accessibility scans, and tests of all SVG/PNG/download interactions after publication. JavaScript widgets should remain progressively enhanced and all educational text should be available without an account.

## Next editorial sprint — in priority order

1. Expand **all 12 foundation lessons** into chapter-length original material with genuinely sourced historical examples and deeper exercises.
2. Continue first-language **source verification** on the current 27 records: archived links, specific edition/folio locations, translated legal clauses and specialist uncertainty notes.
3. Build an **authenticated artifact cabinet**, beginning with rights-clear national-archive evidence from Portugal, France, Sweden and an actually dated civic grant; separate images from grants and later reproductions.
4. Add underrepresented regions from the backlog, with full primary-language reading before publishing sweeping conclusions.
5. Commission or solicit native-speaker and heraldic-law review where interpretation is consequential.
6. Develop graduate *source transcription*, *blazon comparison* and *critical edition* teaching tools, not merely more quiz questions.
7. Create genuine produced lecture recordings and accessible captions/transcripts; current slide/TTS presentations are placeholders for that richer modality.

## What the word 'done' means

Not a 404-free site, not a count of translations, not a checklist entirely ticked by one person. The mature goal requires **research-quality chapters, verifiable primary sources, geographical breadth, documented artifact provenance, reviewed translations and work a graduate student can cite**. This is an open-ended academic collection and should be revised as discoveries or corrections appear.
