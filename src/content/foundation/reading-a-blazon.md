---
title: Reading a blazon
unit: 7
updated: '2026-10-08'
status: 'Expanded teaching draft; specialist review pending'
---

## A specification with a history

Blazon is a compact descriptive language. It names the field, figures, tinctures, positions, and relationships needed to reproduce an armorial composition. It often leaves room for artistic judgment. A reader therefore needs vocabulary and grammar, but also an understanding of the conventions that the particular source assumes.[^grammar]

Do not confuse compactness with obscurity. A good blazon is short because it avoids repeatedly specifying what its readership already understands. If that understanding changes between languages, periods, or traditions, the same compact phrase may become ambiguous to a later reader. Your job is to recover the relevant conventions, not to accuse the source of failing to anticipate your software.

We will begin with elementary English constructions. They are a useful working language, not a universal standard imposed on every historical armorial. Preserve original-language descriptions when studying other traditions. A translation should make the relationship to the original visible, particularly where one language's defaults require another language to add words.

## Read from the field outward

**Constructed teaching blazon:** *Azure, on a fess Or three mullets Gules.* Read it in stages. *Azure* establishes a blue field. *On a fess Or* introduces a gold horizontal ordinary and tells you that it carries something. *Three mullets Gules* identifies the red charges on that ordinary. The resulting image has three layers: blue field, gold fess, red mullets.

| Phrase | Instruction | Information still needed from convention or art |
|---|---|---|
| Azure | Make the field blue | A suitable shade and material realization |
| On a fess Or | Place a gold fess carrying the following charges | Its workable width and proportions |
| Three mullets Gules | Place three red mullets on it | Competent spacing and drawing in the chosen style |

This is why reading blazon as a bag of nouns fails. The correct colors and figures can all appear in the wrong places. The prepositions are part of the specification. Draw the relationships before polishing the artwork.

For this beginner example, use the conventional English mullet supplied by the teaching tool. In historical or international work, examine what the original means by its star terminology and whether it specifies points or piercing. The site's limited renderer does not settle a philological question.

## Scope: which word modifies which object?

Consider *Argent, a lion rampant Gules*. The field is white, the lion is red, and rampant describes the lion's attitude. Now add *guardant*. That modifies the head direction. Add a separately specified tongue tincture and you have a component attribute. Each modifier belongs to an identifiable object or part.[^scope]

Longer descriptions make scope harder. A tincture near the end of a clause may apply to several earlier charges if the grammar groups them. Historical shorthand can refer back to “the field” or to an earlier named tincture. Do not automatically attach a word to the nearest noun. Parse the grouping and compare the source's usage.

A practical annotation method is to place brackets around each group. Write the noun, its count, its modifiers, and its tincture together. Then draw arrows for relationships such as on, between, and over all. This is a study technique, not a replacement for the original wording. Keep the unaltered transcription beside your analysis.

## Arrangement is different from orientation

**Constructed example:** *Gules, three keys palewise in fess Argent.* Each key is oriented vertically, while the group is arranged horizontally. **Palewise** describes individual orientation; **in fess** describes their arrangement. A horizontal row of upright keys is not three horizontal keys stacked vertically.[^orientation]

The distinction generalizes. Three objects can each point one way while the group follows another axis. Crossed objects may have an additional relationship. If you record only a single “direction” for the group, you may be unable to reconstruct what the source says. Store orientation and distribution separately when building a digital corpus.

When the description leaves a detail to convention, identify that reliance. “I used the default arrangement in this manual” is more reproducible than “it seemed right.” If the original image disagrees with your expected default, preserve both witnesses and investigate. Do not silently alter either to make your exercise neat.

## Counterchanging, semy, and nested descriptions

**Counterchanging** exchanges tinctures across a field division. The operation belongs to particular specified figures. A figure crossing a boundary may have one tincture on one side and the opposite tincture on the other. Read its scope before applying the operation to every visible element.[^counterchanging]

A field **semy** of a charge is patterned with it. The painter's visible count can vary with the area, spacing, and partial figures at the edges. A photograph's count should not replace the formal patterned description. The image is evidence of a realization; the blazon describes a composition.

Marshalling introduces descriptions within descriptions. A quarter can itself contain several coats or a divided field. Keep its boundaries explicit. If you flatten every charge from every quarter into a single inventory, the result may be useful for keyword searching but not for reading the arms. Unit 9 will show why this loss of structure also damages genealogical interpretation.

## Transcription, normalization, and translation

A **transcription** records the source's text under stated conventions. A **normalization** regularizes it for a defined purpose. A **translation** renders its meaning in another language. These can all be useful, but the reader must know which one is being supplied.

Suppose a document uses an unfamiliar spelling of a tincture. Preserve it in the transcription. In a separate field, supply your normalized English term and explain the choice. If an abbreviation is expanded, mark the expansion according to your editorial practice. If part of the source is illegible, do not fill it with the word that would make the drawing easiest. Use an explicit uncertainty and say what supports any proposed reading.

A machine-assisted translation needs the same discipline. A fluent sentence can hide a wrong technical equivalent. Check the original term, a relevant glossary, the image if available, and parallel usages. A successful translation should preserve the distinction between a field division and a charge, between arrangement and orientation, and between a main figure and an external component.

## A parser is not an officer of arms

The site's [blazon decoder](/decoder/) supports a restricted grammar. It can help expose relationships in elementary examples. It cannot certify a historical transcription, identify every unusual charge, reconstruct all complex quarterings, or determine a bearer's rights. The fact that a sentence parses says something about the parser's rules, not about the world's heraldic institutions.

Treat an unsupported phrase as evidence of a tool limit first. Perhaps the phrase is valid in another convention. Perhaps a modifier is outside the implementation. Perhaps the source is damaged or your transcription is wrong. Those are different possibilities. The responsible next step is to inspect the record, not to rewrite it until the tool displays a green tick.

For a research dataset, retain the source text even if you also store a parsed structure. Record the software version and unresolved expressions. That makes future reanalysis possible when the grammar improves. Throwing away the original sentence after parsing it would make your current limitations permanent.

## Worked problem: diagnose a plausible wrong drawing

An artist receives *Azure, on a fess Or three mullets Gules* and returns a blue shield with a gold band and three red mullets above the band. Everything on the shopping list is present. The drawing is still wrong because the stars were not placed **on** the fess.

Another artist places the red mullets on the fess but changes their count to five because the band looked empty. This changes the specification. A third artist uses the correct count and placement but adjusts spacing to suit a narrower shield. That may be an acceptable artistic realization. Explain which distinction lets you reject the first two while accepting the third.

<details>
<summary>Answer discussion</summary>

The first changes a structural relationship, the second an explicit count, and the third a normally flexible aspect of layout. A complete answer acknowledges that additional source instructions could constrain spacing too. Fidelity is determined by what the relevant specification and convention require, not by a blanket rule that all visual differences are either permitted or forbidden.

</details>

## Workshop: two artists, one description

Write three simple blazons and exchange them with another learner. Each person draws independently without seeing the other's image. Compare which differences are artistic and which require changes to the words. Include one case distinguishing a division from an ordinary and one distinguishing orientation from arrangement.

For documentary study, select a short description from an institutional register. Produce a literal transcription, an annotated parse, and a plain-language explanation. Cite the record and location. Reproduce no protected artwork without permission. Your explanation should identify at least one convention it relies on and one detail left to the artist.

[^grammar]: Fox-Davies, *A Complete Guide to Heraldry* (1909), chapter VIII, pp. 99–105, [text](https://www.gutenberg.org/cache/epub/41617/pg41617-images.html#page99). This chapter uses its English grammatical framework as dated instructional evidence.
[^scope]: Fox-Davies, chapter VIII, pp. 100–103; chapter XI, pp. 172–190, for the lion's attitudes and attributes.
[^orientation]: Fox-Davies, chapter VIII, pp. 102–103, distinguishes the position of individual spears from the arrangement of their group. The key example here is an original teaching construction.
[^counterchanging]: Fox-Davies, chapter VIII, p. 103, with chapter VII for divided and patterned fields. The document's actual wording controls scope.
