# Wikimedia Commons illustration policy

The Heraldry Project should illustrate its teaching with actual historical witnesses and carefully chosen modern renderings, rather than substituting invented diagrams for every example. Commons is a major repository for this work. **A file being on Wikimedia Commons is not a substitute for reading the individual file description and licence.**

## What belongs in the illustrated collection

An illustration should establish a **particular visual point**. Examples include a German `Helmzier` echoing a shield, a Scottish achievement with supporters, an Aragonese dragon crest showing an exception to a regional generalization, or a separately published illustration of a motto. A good caption says what is visible, identifies whether the artwork is historic or modern, and avoids inferring hereditary entitlement from display.

Priority in research: (1) a securely catalogued historic object and its Commons image; (2) a scan of a dated armorial work with named engraver or illustrator; (3) a modern freely licensed rendition of historically recorded arms; (4) a schematic component useful only for learning the vocabulary. **Do not present the last three as photographs of the original medieval objects.**

## Metadata required for every file

The dataset `src/data/commons-examples.json` requires a unique ID, exact original Commons filename, encoded and linked source-page URL, the depicted subject, named creator or credited source, date of the file, work type, source history, a truthful alt description, a comparative explanatory caption, permitted licence and linked legal text, a note on changes, editorial rights caveat, and intended regions/chapters. Every displayed image must show its visible credit beside the illustration: author, original source file, licence link, and changes if any.

We prefer **Creative Commons BY/SA or verifiably public-domain** illustrations, with the actual version selected and its requirements observed. CC0 / public-domain tags are not universal statements of armorial rights; public-domain work should still receive source and artist credit. For scans, separately consider the underlying artist's death date, publication date, and image reproduction claims. For derivative SVGs, the Commons source page and history may name earlier contributors and must be preserved.

If a file's licence, creator, copyright status, source or attribution chain cannot be established, **do not reproduce it yet**. Link to the object's institutional catalogue instead. Especially scrutinize a current uploader's claim of `PD-old` for an image the uploader appears to have drawn recently; that tag alone may be insufficient.

## Rights that are not copyright

Heraldic grants, official insignia, trademarks, royal arms and other arms may have jurisdiction-specific restrictions **independent of copyright in the illustration**. Our educational display with a clearly identified caption cannot confer a right to bear the design. Scottish royal arms are an obvious case: the Commons pages themselves warn of armorial restrictions. Likewise do not confuse an institutional grant, badge use by adherents, ownership of a photograph, or a free-use licence.

Creative Commons ShareAlike may govern adaptations of the licensed work, not automatically unrelated textual content on the same webpage. Treat crops, color shifts, composite charts and graphic overlays as potential modifications requiring notification, licence analysis and, if applicable, release of the adapted art under ShareAlike. Browser scaling inside an uncropped `object-fit:contain` image is noted as an unchanged rendering.

## Current delivery and editorial gates

The first 12 examples are externally served through the Commons `Special:FilePath` redirect, with `referrerpolicy=no-referrer`. They are not locally hosted copies, so they depend on Commons availability and Wikimedia's bandwidth and service behavior. The cited individual file pages remain the durable identification references. **Do not download SVGs and in-line untrusted SVG XML into the site's own DOM.** Render them as normal image elements only.

Automated checks verify manifest structure, rights URL schemes, chapter/region keys, uniqueness and caption data. They **cannot** establish that a source-page licence has not changed, that remote image delivery is online, that a modern heraldic illustration reproduces a period design faithfully, or that a depicted armiger was entitled to use the external ornaments. The editorial pass should periodically re-open the Commons description pages, check whether the file was superseded or deleted, and compare image and caption directly before approving publication.

New illustrations of colonial, Indigenous, ecclesiastical or other culturally sensitive identifiers require attention to the bearer, appropriate cultural context and community or institutional sources in addition to copyright status. Do not treat permissive licensing as sufficient evidence of appropriate interpretation.
