# Adversarial review repair pass

Reviewed baseline: `3540311fc25c2906ef0dace18f84402102298ebb`.

Public release remains on hold. These changes implement the agreed repair scope; this note does not claim that the entire adversarial review has been closed.

| Finding | Change | Verification and remaining checks |
|---|---|---|
| F01 | Per-bend fields retain the first tincture in chief and put the second in base. | Rasterized Or/Azure and Argent/Gules SVGs have the correct sampled colours. Existing ordinary and charge placement tests still pass. Recheck Atelier and Decoder screenshots. |
| F02 | All three research tools preserve separate drafts for each open page, detect stale saved versions, and offer preview, download, and explicit recovery. Unreadable originals remain intact until an explicit replacement, which archives the original. | Regression tests cover stale tabs, deliberately interleaved writes, malformed JSON, invalid schemas, quota failure, version changes after preview, storage events, exports, and restoration. Repeat real-browser two-tab journeys, including closing and reopening both pages. |
| F03 | Hero children can shrink within the grid; the phone heading has a smaller minimum size. Eyebrows can wrap long text. | Static build passes. Fresh 320/375/390 px screenshots and 200% zoom checks remain required. |
| F04 | The vertical-line example identifies Gules rather than Azure. | The corrected paragraph agrees with the site's hatching key. |
| F05 | Article link styling excludes buttons; dark field-panel eyebrows retain their light colour. | Colour calculations: tradition buttons 15.28:1; dark-panel eyebrow 9.90:1. Recheck computed styles and axe in the browser. |
| F06 | Failed decoding clears the shield and canonical output, hides the edit link, and disables copying. Incomplete “on a” constructions are declined. | The actual Decoder script is exercised by a regression test that moves from valid to invalid to valid input. |
| F07 | The German excerpt now uses the source's “in der Deutschen Wappenrolle”. | Checked against HEROLD's linked § 13(I). The English remains an editorial translation. |
| F08 | The Romanian locator specifies the second sentence; the translation retains black-and-white representation as the subject. | Correction follows the review's verified original. Independent Romanian specialist review remains outstanding, as already labelled. |
| F11 | Menu and Back to top use their visible text as their accessible names. | Built markup inspected; rerun browser accessibility checks. |
| F12 | Light-background focus outlines and sidebar numerals use darker gold; dark sections retain light focus outlines. | Focus ratios 5.31:1 on paper and 4.52:1 on the introductory gradient; sidebar numerals 4.85:1. Recheck focus visibility in the browser. |
| F21 | All 26 original editorial status notes use semantic asides with notice styling. | All 26 asides occur in the generated HTML. Genuine source quotations retain their quotation markup. |

## Draft preservation design

The original storage keys and portable export formats remain compatible. A separate browser-storage record keeps each open page's latest draft before the shared saved record is changed. A stale shared version pauses autosave. Explicit recovery archives the previous saved record and current working draft before loading a selected version.

`localStorage` has no atomic compare-and-swap operation. A narrow race can still determine which version occupies the shared key; both writers' separate recovery copies survive that interleaving. Storage events disclose the conflicting saved version, and Draft recovery exposes the copies after reload. The interleaving is deliberately forced in regression tests for each tool. Recovery copies are not automatically purged; quota failure leaves the previous shared draft untouched and reports that the current page must be exported.

## Checks run

- `npm test`: 81 passing tests.
- `npm run check`: zero errors and warnings; three existing unused-import hints in `tinctures.astro`.
- `npm run build`: 82 HTML pages generated.
- `git diff --check`: passes.
- SVG raster samples, corrected contrast calculations, and generated editorial-aside counts: pass.

The local environment has no installed Chromium. Its attempted official browser download failed; the cloud browser cannot reach this workspace's localhost server. No fresh browser screenshots, axe run, Safari/Firefox test, or physical-device test is claimed for this pass.

## Independent recheck before release

Review this repair commit rather than the original baseline. Re-run the review evidence's F01–F08 and F21 journeys, including all three research notebooks for F02. Check phone widths, zoom, keyboard focus, recovery controls, and import/export behavior. The remaining minor findings and unverified risks in the original report still need explicit triage; no universal restriction on saltire or bordure charge counts has been introduced.

Do not publish, enable Pages, change repository visibility, configure DNS, or merge into a deployment branch as part of the recheck.
