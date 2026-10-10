# Repair recheck cleanup — 10 October 2026

Claude reviewed remote commit `2bfc6cd1aff2ddcfb7f21ee93a448f3ddb8ddf3a` in Chromium and recommended **Ready for limited public beta with nonblocking follow-ups**. The report and evidence supplied by James confirmed the three original blockers were fixed. This follow-up addresses the recovery-layer findings and the small public-link and accessibility cleanup James authorized, followed by his requested squash merge.

## Changes

- **N-01:** Successful own saves notify the open recovery panel. Selection permits a shared version advanced by this page's own save, while rejecting an unseen external change. Restoring an older copy still archives current work.
- **N-02:** Recovery entries update in place by storage key, retaining preview expansion and keyboard focus. Events for other records are ignored. Focus returns to the panel summary if its focused entry is removed.
- **N-03:** Every stored copy is listed, including duplicates previously hidden by raw-text deduplication. Old copies can be deleted after downloading and a second confirmation. The shared draft and the current page's safety copy are protected; changed previews refuse deletion. Capacity can be freed without clearing all site data, and the quota message explains this route.
- **N-04:** Storage exceptions during recovery consistently provide export advice instead of exposing a raw browser exception or disguising a quota failure as a conflict.
- **N-05:** Bounded previews begin with entered fields, including both manuscript readings, rather than catalogue boilerplate. Full exports remain intact.
- **N-06:** Object recovery JSON includes ordered object identifiers, accession records, source links, rights, notes and the source-aware report. Filenames identify the witness or ordered pair, timestamp and copy.
- **F10:** The private-repository link is replaced by an on-site editorial policy, included in the sitemap. The coverage note acknowledges the existing Hungarian, Baltic and Finnish chapters.
- **F12 and accessibility residuals:** Light-card numerals and Atelier assessment text receive darker colors. The skip-link outline is light against the header. The entered-text difference has a named, keyboard-focusable region role.
- **F13:** The exact-comparison explanation notes that visibly identical Unicode encodings can still differ; original text is unchanged.
- **F14:** Markdown tables get their own named, keyboard-focusable scroll wrapper. The whole chapter no longer becomes a horizontal scroller.
- Remove three existing unused-import hints.

## Preservation and retention choice

Recovery history is **managed explicitly**, not automatically discarded. Deleting a branch immediately after a successful shared write can remove the only surviving copy when another browser process interleaves its check and write. Arbitrary retention limits can similarly discard an unresolved version. The separate-copy guarantee remains in place.

Users should close other editing tabs, download and check the copies they need, and confirm deletion of old copies. Current-page and canonical records cannot be deleted through these controls. The preview comparison is a guard, not an atomic transaction: localStorage still has no compare-and-swap operation. No claim is made that deleting a copy actively being edited in another tab is race-free.

## Validation

93 automated tests pass, including the existing forced interleaving tests, corruption preservation, legacy exports, Decoder transitions, and controller workflows. Added tests cover quota recovery by deletion in all three tools, protected and changed-copy deletion, own-save refresh, unseen external changes, in-place focus and preview retention, recovery storage failures, both-reading previews, and object export context and filenames.

Astro check passes with zero errors, warnings or hints. The production build generates 83 HTML pages. Generated HTML checks verify the public policy link, sitemap coverage, scroll wrappers, the named difference region and all 26 editorial notices. Palette calculations verify the changed colors.

The new UI checks use DOM adapters, not a browser engine. Claude's Chromium screenshots and browser findings apply to the preceding repair commit. This workspace still lacks a usable local browser binary; these final changes have not received a fresh real-browser or screen-reader pass.

## Remaining work

The optional composition preference F15 is unchanged. Other nonblocking items outside this cleanup remain: F09 rose seeding, F16 completion language, F17 entitlement wording, F18 dependency/workflow maintenance, F19 social and 404 metadata, and F20 source-label and specialist-verification work. Cross-browser, assistive-technology, DNS, HTTPS and actual public deployment checks remain distinct tasks.

Repository merge is authorized by James. Public-site configuration remains his next step; no visibility, Pages, custom-domain or DNS setting is changed by this cleanup.
