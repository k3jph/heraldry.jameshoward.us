# Research and publication audit — 8 October 2026

**Status: substantial first expansion; NOT academically complete.**

This document records the project honestly for future collaborators and further assistant work. The standing objective is the [editorial mandate](EDITORIAL_MANDATE.md), tracked in the [open umbrella issue](https://github.com/k3jph/heraldry.jameshoward.us/issues/1) and the [research backlog](RESEARCH_BACKLOG.md).

## What exists in the repository

| Area | Current implementation | Qualification |
| --- | --- | --- |
| Introductory academy | 12 expanded Markdown readings, 17,402 words excluding source-note definitions; objectives, 36 starter questions, worked problems, documentary workshops, answer discussions, and a capstone rubric | First substantial teaching drafts, not yet the intended 5,000–8,000-word university chapters; specialist review pending |
| Guided presentations | 12 navigable browser presentations retaining concise introductory scripts | Linked to the expanded readings; optional device text-to-speech, **not** recorded video lectures or full-chapter narration |
| World research | 20 original English comparative chapters | Advanced teaching surveys, often based on few institutional sources; not peer reviewed monographs |
| Research atlas | 35 original-language source records in 18 languages | Includes primary legislation, official finding aids, expert associations and archive portals; **not every item is a primary historical witness** |
| Translation lab | 14 brief original excerpts and editorial English translations in 13 source languages | Short, attributed, source-linked passages; not authorized translations or specialist-reviewed critical editions |
| Graduate research | 6 graduate-method seminars | Serious methodology and assignments, but not a full graduate degree or supervised seminar series |
| Illustrated armorial | 16 original pedagogical designs | Teaching designs, not authenticated historic grants |
| Atelier | SVG vector design, basic blazon generation, hatching mode, PNG/SVG exports, URL sharing | Does not establish unique arms, legal eligibility or complete grammatical validity |
| Lexicon | 399 concise entries; 103 have 166 links into 11 official or institutional source records | Linked examples document usage or institutional context, **not** individually peer-reviewed definitions or comprehensive dated linguistic attestations; the other entries remain preliminary |
| Citation export | Per-record copy of BibTeX, RIS and CSL JSON; full-bibliography downloads | Original titles and access dates retained; publication dates must not be guessed |
| Deployment | GitHub Actions tests/checks/build; deploy to GitHub Pages | Until Settings → Pages → GitHub Actions is enabled, build can succeed and deployment can still fail |

## Specific scholarly limitations

1. **Historical artifacts:** An actual critical armorial museum needs rights-cleared photographic or manuscript images, page/folio/shelfmark references, and provenance. The currently illustrated gallery is original teaching art only. The Portuguese *Livro do Armeiro-Mor*, book 19, folio 87 is a promising object-level source link, but not a completed gallery entry.
2. **Translations:** Source-language fragments have been checked against the online institutional versions; their English interpretations are *model-assisted original editorial drafts* awaiting competent human/native-language review. A translation of a brief clause does not constitute a full translation of an entire document. Do not label the collection a critical multilingual edition yet.
3. **Breadth:** Major traditions and regions lack substantial content, including dedicated English, Welsh, Scottish and Irish studies, Switzerland, Austria, German regional archival studies, Denmark, Norway, Iceland, much of the Balkans, Slovakia, fuller Baltic coverage, the wider Americas and Africa, and comparative Asian emblematic practices. The Hungarian, Croatian and Slovenian chapters are present but remain preliminary surveys.
4. **Depth:** The original 12-unit scripts retain about 3,400 words of exposition. The Academy now renders separate expanded readings totaling 17,402 words by `chapterWordCount`, excluding source-note definitions and counting headings and table text. These are approximately 1,244–1,938 words per unit and remain well below the mature editorial target. Footnotes, worked problems, workshops, answer discussions, and a capstone are in place; deeper dated object readings, wider historical bibliography, meaningful extended assessment, and specialist review remain. Much elementary terminology is grounded in Fox-Davies (1909), read explicitly as a dated British manual; a broader comparative evidence base is still required.
5. **Source nature:** The current atlas mixes formal laws, institution descriptions, catalogs and scholarly associations. Every entry states its kind. A government *finding aid* cannot be treated as proof of the historical content of a manuscript that has not been consulted.
6. **Law:** Many sources are current consolidated statutes with amendment histories. A statement of what rules applied in 1998, 2015 or today must cite the applicable version, not merely the current URL.
7. **Rights and ethics:** No mass copying of national coats or archival photographs without reviewing the applicable reproduction rights. Do not republish personal identification numbers, private addresses, or sensitive details from modern armorial registration records.
8. **Quality review:** A green Astro build does not certify that every historical proposition, spelling, translation, bibliography link, or artistic reconstruction is correct. Regional subject-matter and language specialists must review before formal scholarly claims.

## Technical acceptance and pending release

**Foundation expansion validation (8 October 2026):** 25 Node tests passed; Astro reported zero errors and zero warnings, with three existing unused-import hints in the tincture page; production build generated 67 HTML pages. All twelve rendered Academy pages were checked for duplicate IDs, chapter and footnote fragment targets, existing internal routes, and rendered answer disclosures/source notes, with no failures. Screenshot-based desktop/mobile and interactive browser QA was not completed: no browser binary was available and the attempted Chromium download failed. The new prose and disclosures are statically rendered and do not depend on JavaScript. These checks do not constitute specialist review or live deployment verification.

The technical build pipeline runs `npm test`, `npm run check`, and `npm run build`. Each updated commit gets a GitHub Actions run; successful build and tests do not automatically mean Pages has been enabled for the repository. Its current `github-pages` deploy configuration requires the owner to select GitHub Actions in Settings → Pages.

Follow up with an actual phone and desktop browser QA pass, keyboard and screen-reader testing, automated accessibility scans, and tests of all SVG/PNG/download interactions after publication. JavaScript widgets should remain progressively enhanced and all educational text should be available without an account.

## Next editorial sprint — in priority order

1. Develop **all 12 foundation readings** from this first expansion toward 5,000–8,000-word chapters, with inspected object images, dated primary witnesses, wider historical bibliography, extended problem sets, and specialist review. Do not mistake the twelve delivered drafts for completion of this target.
2. Continue first-language **source verification** on the current 35 records: archived links, specific edition/folio locations, translated legal clauses and specialist uncertainty notes.
3. Build an **authenticated artifact cabinet**, beginning with rights-clear national-archive evidence from Portugal, France, Sweden and an actually dated civic grant; separate images from grants and later reproductions.
4. Add underrepresented regions from the backlog, with full primary-language reading before publishing sweeping conclusions.
5. Commission or solicit native-speaker and heraldic-law review where interpretation is consequential.
6. Develop graduate *source transcription*, *blazon comparison* and *critical edition* teaching tools, not merely more quiz questions.
7. Create genuine produced lecture recordings and accessible captions/transcripts; current slide/TTS presentations are placeholders for that richer modality.

## What the word 'done' means

Not a 404-free site, not a count of translations, not a checklist entirely ticked by one person. The mature goal requires **research-quality chapters, verifiable primary sources, geographical breadth, documented artifact provenance, reviewed translations and work a graduate student can cite**. This is an open-ended academic collection and should be revised as discoveries or corrections appear.

