# Lexicon editorial method and research trail

**Status: expanded first pass; individual specialist verification remains pending.**

The 399-entry lexicon provides original concise explanations for teaching and orientation. It is not yet a critical historical dictionary: entry inclusion does not prove a term was used in a given jurisdiction or century.

## Starting reference works

- [The Greaves Canadian Heraldic Dictionary](https://www.heraldry.ca/content/pp_dictionary.php), Royal Heraldry Society of Canada — Canadian usage and nontraditional charges.
- [A Complete Guide to Heraldry](https://www.gutenberg.org/ebooks/41617), Arthur Charles Fox-Davies (1909) — period British terminology, **not** current law.
- [Canadian Senate heraldry glossary](https://sencanada.ca/media/362397/com_bro_heraldy-symbols_2018-07-10_e_final_web.pdf) — public educational definitions.
- [College of Arms Foundation, Language of Heraldry](https://www.coafus.org/language-of-heraldry) — English blazonry and distinction between design and formal description.
- [Frick Collection glossary](https://www.frick.org/scher_glossary) — objects, artistic terms and visual description.
- [Canadian Heraldic Authority public register](https://www.gg.ca/en/heraldry/public-register) — contemporary official grant language, to be cited by individual entry.
- [SCA College of Arms glossary](https://heraldry.sca.org/coagloss.html) — a distinct modern SCA system, **not** universal historical law.
- Internal [world source atlas](../src/data/world-sources.json) and [comparative chapters](../src/content/traditions/) — source-language vocabulary and working translations.

Entries are independently phrased summaries; the references provide a research trail, **not a claim that all 399 definitions were individually verified or peer reviewed**.

## Scholarly development backlog

1. Record per-entry sources with exact pages, folios, statute sections or stable institutional records.
2. Distinguish historical, antiquarian, modern official, professional and SCA-specific senses.
3. Add region, century, original orthography, transliteration, language codes and specialist review states.
4. Link terms to dated original examples and rights-cleared illustrations.
5. Expand from this preliminary selection toward a substantial multilingual historical dictionary without sacrificing accuracy.

A shared English gloss does not imply that different armorial traditions have identical legal rules.

## Learning mode

The browser-only flashcard experience at `/lexicon/study/` uses the same glossary records. The 'review again' stack cycles through missed terms until the learner marks each one understood. There are no accounts, saved scores, external study providers or new analytics calls.

## Documentary examples: first tranche (October 2026)

The new `src/data/lexicon-sources.json` identifies eleven institutional sources, including seven dated Canadian grants or registrations, an English College of Arms grant and guidance, an association statute from Germany, and an archival guide from France. These are source descriptions, not third-party images licensed for republication.

`src/data/lexicon-attestations.json` links **103 of the 399 headwords** to **166 source/document pairs**. Each link has a named institutional document, a human-readable location within it, a declared relationship and an editorial note:

- `recorded-usage`: the expression is used in a published blazon or accompanying recorded field (including inflected or plural forms). A modern registration may reproduce much older arms; **the register date is not the date of invention of the word**.
- `institutional-explanation`: a competent institution explains the term or a related administrative practice in a guide.
- `institutional-context`: an institutional record illustrates the *concept* without necessarily using the English dictionary headword.

The links are **documentary pointers**, not endorsements of every part of our glossary definitions, not historical first-use claims, and not a substitute for independent subject review. Future work must add exact manuscript witnesses, quoted original-language fragments under responsible rights limits, historical senses, dating evidence, and citations with per-entry editorial review.

The website exposes these links under their matching headwords and permits a `sources=1` search filter. The remaining 296 definitions remain unsourced introductory explanations; this distinction should stay visible rather than appearing to certify the entire lexicon.
