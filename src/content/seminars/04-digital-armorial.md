---
title: "Seminar IV · The computable armorial"
description: "Design a reproducible multilingual armorial database rather than a surname-to-picture directory."
order: 4
focus: "Digital humanities and scholarly data"
sourceIds: ["fr-bnf-armorial","se-riksregister","cz-rekos","pl-herbarze"]
level: "Graduate methods"
---

## The data model is already an historical argument

Suppose we put hundreds of shields into a database with three columns: family name, design, and URL. A search now returns a convincing picture beside a familiar name. What relationship did we record? Perhaps a manuscript attributes the design to one named person; perhaps the URL points only to a later illustration. The three columns give us nowhere to distinguish those possibilities or to record a disputed attribution. The apparent simplicity of the model has made a historical decision before the researcher has examined the evidence.

To represent heraldic history, the software must distinguish the abstract *design*, the particular *witness* in which the design is depicted or described, the *bearer* associated with it, the *claim* concerning that association, and the *institution* or compiler behind the source. A researcher may have a good reason to identify the same composition in three different manuscripts while refusing to conclude that all three documents independently prove one modern family's descent.

Consider the [BnF's Armorial général](https://gallica.bnf.fr/selections/fr/html/histoire/ressources-genealogiques-noblesse). Its source series include text and painted blazons. A student should not count a written registration and an illustration of that registration as two separate instances of an independently created coat. Nor can one assume a later image reflects the exact colour and artistic form used when the record was first entered.

Polish heraldry introduces another complexity: a named *herb* may be associated with multiple families. The record model should permit one design to have multiple attributed bearers, with separately sourced links and potentially incompatible claims. A relational system that enforces a unique surname per coat is a historical theory disguised as a database constraint.

## Records, witnesses, and uncertainty

A scholarly implementation should separate at least eight record types:

| Record | Minimum fields and responsibilities |
|---|---|
| Source | Author/institution, original title, language, date, edition, permanent link |
| Witness | Physical item, collection, folio or entry, medium, creation date, condition |
| Bearer | Identified person or institution, name variants, temporal context |
| Blazon | Original-language transcription, editor, uncertain readings, source locator |
| Design | Structured field, divisions, charges, tinctures and variant annotations |
| Claim | Evidence connecting bearer, design, time, place, and kind of use or right |
| Image | Author/photographer, derivative status, licence and source record |
| Translation | Original passage and version, translator, translation method, review and rights |

This is a minimum model, not a guarantee that historical information fits neatly into distinct compartments. A medieval seal without a caption may show an identifiable device but have an uncertain bearer. An official register might name a bearer but not provide an unambiguous image. The database must permit missing information without inventing it.

Every attribution should allow an explicit evidence type, confidence assessment and description of alternative hypotheses. Instead of the unqualified statement that a coat 'belongs' to someone, the application could say that a named manuscript **attributes** certain arms to a particular bearer at a known date.

## Language and identity reconciliation

An original text might employ a seventeenth-century spelling; a nineteenth-century catalogue may normalize the name differently; an English essay might translate a title. Those forms should be preserved as linked variants, not overwritten with one modern string. The transformation process must be auditable.

This is particularly important across borders. Similar-looking coats may reflect deliberate adoption, dynastic association, independent artistic selection, or later confusion. Semantic similarity is evidence for forming hypotheses, not an entitlement engine. A visual search algorithm cannot decide which explanation is true by comparing pixels.

International identifiers should preserve a source's own archival address. Where the archive offers an enduring record ID, that identifier deserves precedence over a local database key. The digital project can issue its own stable citation URL, but must not suggest that it created the original archival record.

## Error and selection bias

Searchable databases are valuable precisely because they allow systematic research. They also introduce biases. The [Czech REKOS](https://www.rekos.psp.cz/) warns that historical records continue to be added. The [Swedish Riksarkivet register](https://sok.riksarkivet.se/heraldisktregister/) serves a defined set of public armorial records. Neither is a complete census of all historical heraldic use by every individual.

A sample should distinguish missing historical records from undigitized records, absent source language, and incomplete modern metadata. A model trained only on tidy modern municipal artwork may perform badly when presented with medieval seals, faded bookplates or historical hatching. Evaluation must include images and transcription errors representative of the actual research problem.

## Reproducible corpus assignment

Using at least two original-language source collections, build a schema for twenty armorial witnesses. Record institution, source locator, bearer attribution, observed design, blazon, original language, uncertainty, rights and the basis for connecting each witness to another. Supply a data dictionary and a short evaluation of missingness.

**Graduate submission:** an open repository containing the schema and a sample dataset wherever rights permit, tests against invalid and ambiguous inputs, and a 1,500-word methods paper. It must explain why the model does not mistake a surname, picture or private registration for a legal grant.

### Required source gateways

- [BnF / Gallica, Armorial général](https://gallica.bnf.fr/selections/fr/html/histoire/ressources-genealogiques-noblesse)
- [Riksarkivet, heraldic register](https://sok.riksarkivet.se/heraldisktregister/)
- [Czech Parliament, REKOS](https://www.rekos.psp.cz/)
- [Polish historical armorial bibliography](https://szlachta.org/baza-wiedzy-o-szlachcie/zrodla/herbarze/)


<aside class="editorial-notice" aria-label="Editorial note">
<p><strong>Research status:</strong> Original teaching material, not a reviewed critical edition. Verify claims in cited sources. No academic credit is awarded.</p>
</aside>
