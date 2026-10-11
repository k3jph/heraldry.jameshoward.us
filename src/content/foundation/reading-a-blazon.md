---
title: Reading a blazon
unit: 7
updated: '2026-10-10'
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

## A blazon is a sequence of operations

Begin with a constructed description: *Argent, a bend Azure between three mullets Gules.* Its words establish a white field, a blue diagonal ordinary, and three red stars related to that ordinary. The sentence is not merely a list of white, blue, red, bend, and stars. It contains a construction sequence and a grouping problem. Before making a finished image, identify the field, the ordinary, and the accompanying charge group. Then check the applicable convention for the group's arrangement or make it explicit in the teaching exercise.

Now change one preposition: *Argent, on a bend Azure three mullets Or.* The stars are supported by the bend rather than accompanying it in the field. Their immediate background changes, and their arrangement follows the available ordinary. The new tincture makes the constructed layer relation easy to see. The sentence can be short because the relation is compactly encoded, not because the relation is unimportant.

A practical parse therefore records **object**, **properties**, and **relationship**. The field has a tincture or treatment. The bend has type, tincture, direction, and modifiers. The stars have type, count, tincture, and arrangement. An on-relation connects stars to bend. This plan lets another reader reconstruct the composition before deciding how an artist should draw its exact proportions. It also makes an error easier to locate: the stars can be correct in type and wrong in support.

Keep the original sentence alongside the plan. The plan is your analysis; it is not a substitute witness. If a modifier has ambiguous scope, mark the alternative attachment instead of silently choosing one. An accurate account of an unresolved parse is more useful than a definitive drawing built on a hidden guess.

## Articles, number, and collective expressions

Small words establish whether we are discussing one figure, several figures, or a patterned treatment. “A chief” introduces a figure. “In chief” places something in a region. “Three roses” establishes a count. “Semy of roses” gives a repeating treatment rather than an incidental visible total. These expressions cannot be normalized to the same noun without losing their construction instructions.

The distinction becomes important when historical spelling or punctuation differs from modern usage. A transcription should preserve the source under its stated policy. A normalized reading can regularize capitalization or expand an abbreviation in a separate layer. A grammatical analysis can then identify figure groups. If all three operations are performed silently in one field, the reader cannot tell whether an apparent clarity belongs to the witness or the editor.

Collective descriptions also require a counting unit. A pair of wings may be one named compound figure in the source. Four pairs of seeds are not four individual seeds. A sheaf can contain multiple visible stems without requiring each to be counted as a separate charge. The artist's visible details and the description's named unit operate at different levels. Parse the unit the source actually gives before comparing counts.

The Universities Canada record illustrates that distinction with paired maple seeds and a group arrangement.[^universities-grammar] A reader should retain the paired unit instead of flattening it into an arbitrary count of leaves. The institutional commentary explains another history of the forms, but the shield description still controls the armorial construction. Read specification and explanation as related texts with different tasks.

## Modifiers need an address

Every meaningful modifier should be attached to a figure, part, group, line, or operation. Rampant modifies an animal's attitude. Guardant concerns its head. Engrailed concerns a relevant boundary. A tincture can apply to a complete figure or a separately specified part. Counterchanged can apply to one ordinary or a defined group. Scope is the address that tells us where the instruction goes.

Consider the fictional phrase “a lion rampant Gules holding a key Or.” The lion is red; the key is gold; holding relates them. Now add a crown with its own tincture. A loose annotation that merely marks the sentence red and gold loses the assignment. Write the noun and its properties together, then connect objects through the relationship. This is more useful than coloring every noun according to the nearest tincture word.

Longer descriptions may postpone a shared property until after several nouns. The reader must identify the group. A phrase giving two animals and a flower followed by “all Or” can assign one tincture to the whole defined set. A separate tincture within the group may limit that generalization. Read the actual grammar and compare the source's conventions before deciding whether all means every object in the shield or only the preceding cluster.

An ambiguity can be demonstrated by drawing its alternatives. In a constructed description with a charged chief and a nearby lion, a final crown tincture might be read as modifying either the lion's crown or another crown on the chief if the wording is poorly drafted. Make both parses explicit. A revised design blazon can remove the ambiguity; a documentary transcription cannot quietly rewrite the witness. Editorial improvement and source preservation are different activities.

## Back-references trade repetition for dependence

Expressions such as **of the first**, **of the second**, **of the last**, or **of the field** refer to previously established tinctures. They save repetition but make the reader carry an ordered context. If the sentence is copied incompletely, the reference can lose its target. If an editor inserts another tincture earlier in the sentence, its numbering can change. This is one reason an excerpted phrase may not be interpretable without the complete blazon.

The Lyon Court's worked example for James Thomson, merchant in Kirkcaldy, uses a back-reference for charges on a red engrailed chief after naming a white field.[^thomson] The institutional explanation resolves the reference to the earlier field tincture. A learner can annotate the referring expression and its target before making the drawing. The instruction is compact because the earlier information remains available.

For an educational normalized version, repeating the tincture can improve readability. Keep the original wording beside it and state what was expanded. A historical comparison should not erase the source's reference system, because that system may be part of the language being studied. Nor should a translation preserve a numerical reference mechanically if the translation changes the order in which colors are introduced. Either preserve the ordering or make the referent explicit with an editorial note.

In software, the rule requires state. The parser needs to remember previously introduced tinctures and the scope of the current description. A nested quarter can introduce another local context. The correct implementation is not a global list of all colors mentioned anywhere on the page. A title, symbolism paragraph, or footnote can contain color words without belonging to the blazon's reference system. The document structure supplies boundaries for the grammar.

## Prepositions create a supporting structure

On, between, within, around, issuing from, holding, and overall do different work. Some locate a charge relative to an ordinary. Others connect a figure to a support, establish an enclosure, or describe superposition. The right drawing depends on the relationship, not merely the correct objects. A bird standing on a staff is not a bird above an unrelated staff. A roundel within a bordure is not a roundel charged on that bordure.

The Hinshelwood registration provides a readable actual construction. An engrailed bend carries three escallops, while a tree and stag occupy the field in specified regions.[^hinshelwood-grammar] The words distinguish a supporting ordinary from accompanying figures. A plan can show all those relations without requiring a complete naturalistic tree or stag. That is why structural reading should precede artistic finish.

An enclosure also has a scope. “All within a bordure” can gather the preceding composition into a bounded display. A smaller phrase may enclose one charge group rather than the entire shield. “Overall” can place a figure across structures already described. If the uppermost figure has an opening, that opening reveals the underlying layers rather than a new uniformly colored patch. Geometry and grammar cooperate to determine what appears at each intersection.

For a difficult passage, make a table with one row per relationship: source phrase, supporting or reference element, dependent element, and uncertainty. The table should retain the actual wording. This method turns a long sentence into a reconstructible plan while preserving places where its interpretation remains contested.

## Orientation is not arrangement

Three upright keys in a horizontal row and three horizontal keys in a vertical column can share count, type, and tincture. Their individual orientation and group arrangement differ. A source that says palewise describes each object's alignment; a phrase saying in fess describes the group's distribution. A single database property called direction is insufficient to store both.

Use the constructed keys in the charge chapter as a controlled test. Annotate the axis of each key, then the axis joining the group's centers. They need not coincide. Next place the keys on a bend. Their positions now follow a supporting figure, while their individual directions still depend on the source or convention. Do not rotate them automatically because the ordinary is diagonal.

Pairs in saltire add crossing and possible layer order. Two swords can cross while their hilts and points have specified directions. A pair of animal heads can face inward while the pair lies horizontally. The relationship between objects does not replace their individual morphology. This becomes particularly useful in translation because one language may rely on a conventional orientation that another has to state explicitly.

When a word's scope remains uncertain, describe the alternatives in plain language. “The three shafts are upright and their centers form a horizontal row” is an operable interpretation. Another reader can draw it. A technical term is valuable when it makes that relationship concise; it should not obscure the relationship it is supposed to name.

## A divided field changes the scope of a color operation

Counterchanging assigns tinctures across specified regions. Begin by identifying the partition, then the figure or group to which the operation applies. A single continuous charge crossing a boundary can change tincture while remaining one charge. Separate charges on opposite sides can also take exchanged tinctures according to the wording. Do not assume the operation must cut every object in half.

In a constructed per-pale white-and-blue field, one counterchanged star crosses the central boundary. The white-field portion of the star is blue and the blue-field portion is white. Add a separately specified red chief. The chief does not automatically become counterchanged. Its own description supplies another layer and tincture. This example isolates the danger of interpreting one operation as a command applying to the whole image.

The Goebel grant studied in geometry combines a per-chevron field with a counterchanged pale and a separately tinctured face.[^goebel-grammar] A full parse distinguishes the supporting field regions, the ordinary, the operation applied to it, and the additional charge. The sentence's difficulty is manageable when those objects remain separate. It becomes unmanageable if the reader treats color exchange as a global filter.

For a historical source, preserve the relevant clause's boundaries. A modern punctuation change can make scope seem more obvious than it was. If you normalize punctuation for readability, state that policy and retain the diplomatic version. A clean digital text can otherwise conceal the very uncertainty a critical edition should expose.

## Nested descriptions require a stack of contexts

Marshalling creates a description within a description. A quarter may contain a divided field, an ordinary carrying charges, and an enclosing bordure. The next quarter begins another local composition. A final inescutcheon or overall figure can relate to the larger shield. Reading all the nouns in one flat sequence discards that hierarchy.

Use a fictional composite with coat A in quarters 1 and 4 and coat B in quarters 2 and 3. Coat A is itself per pale with a counterchanged star; coat B has a fess carrying three roses. The star's counterchanging belongs to A's divided field, not the entire four-part display. The roses belong to B's fess, not a horizontal band spanning the whole composite. The same relative words operate inside different containers.

A practical annotation assigns a path to each object: main shield, quarter 1, field; main shield, quarter 1, star; main shield, quarter 2, fess; and so forth. Repeated quarters can refer to the same component specification while keeping their positions distinct. This is a reading technique, not a demand that historical writers use a modern data format. It lets us preserve information a modern catalogue would otherwise flatten.

Spain's 1981 law describing the national arms supplies a real nested source. Its first article describes the main composite and external features; the second supplies the dynastic escutcheon.[^spanish-grammar] The article boundary helps locate an added level of structure. A translation should preserve the constituent regions and their relations rather than convert the whole text into an unordered list of national symbols. Unit 9 examines the political interpretation separately from this grammatical task.

## Formal description and symbolism are separate texts

A register can put a blazon beside an explanatory paragraph. The blazon tells the artist what to depict; the commentary explains associations attributed to the bearer or institution. The commentary can clarify an unfamiliar figure but should not silently replace its formal description. A symbol's stated meaning does not supply missing count, tincture, or orientation unless the source actually provides that information.

The distinction is especially important where the source itself qualifies its interpretation. The Canadian record for David Macdonald Stewart explicitly labels its symbolism comments as hypotheses rather than confirmed explanations.[^stewart-hypotheses] That qualification belongs in a summary. A reference site should not strip the uncertainty merely because the hypotheses sound plausible. A source may be secure about composition and provisional about intention at the same time.

For a transcription exercise, copy only the defined blazon into the transcription field. Put the commentary in a separately attributed note. If it helps interpret a technical term, identify that use explicitly. This prevents prose describing the artist's inspiration from becoming an accidental drawing command. “Growth” is an explanation; it is not a tincture or a number of leaves.

A translation should preserve the distinction too. Label an original English synthesis, a source-supplied English translation, and your own working translation differently. Their evidential roles differ. Fluency cannot settle whether a translation has retained every technical relationship, and official publication does not guarantee that two language versions are identical in every word. The Cairns bird terminology provides a concrete bilingual case rather than an abstract warning.

## Translate a structure, then polish its language

Start a translation by identifying the components and operations in the original. Record terms for partition, ordinary, figure, tincture, attitude, arrangement, and relation. Build a plain structural paraphrase. Only then write a fluent English blazon or explanation. This order makes it harder for a plausible dictionary equivalent to create the wrong picture.

A small comparison illustrates the method. French **parti** and **pal** concern different operations; **coupé** and **fasce** likewise differ.[^french-grammar] A translator should ask whether the source divides the field or places a figure on it. The chosen English expression follows that answer. Translating all horizontal vocabulary as fess may sound heraldic while losing the distinction on which the composition depends.

Preserve terms without a secure equivalent and explain them. A working translation can include the original in parentheses or a note. If a bird word has source-specific morphology, give that morphology rather than substitute an available stock drawing. If a term's historical use differs from its present everyday meaning, cite the lexical or technical evidence. This is how a translation becomes an argument a reader can inspect.

Finish with a reverse test. Could another reader reconstruct the source's structure from the translation? Can the reader identify which details were supplied from convention rather than literal wording? If the translation has removed a modifier or introduced an unsupported default, revise it. A polished sentence is the last stage of the work, not evidence that the first stages were unnecessary.

## Describe what the witness preserves

A damaged blazon can preserve a clear field and ordinary while losing a tincture word. Transcribe the legible portion under an explicit policy. Mark the loss. In a separate note, propose a completion if another witness supports it. Do not insert the tincture merely because it gives conventional contrast. An expectation about a design is not a reading of missing ink.

The same distinction applies when blazoning from an image. You can describe visible features and state unresolved ones. If a monochrome seal has no securely identified hatching, it does not establish tinctures. If a painting loses a charge's head, its attitude may remain partly recoverable while species or head direction is uncertain. A complete modern blazon reconstructed from that image needs a claim ledger identifying which instructions are observed and which are supplied.

An image and text can disagree. Preserve both. Possible explanations include artistic error, later alteration, a textual copying mistake, different versions of the design, or a mistaken association between witnesses. Choosing the most convenient one without investigation makes the source conflict disappear from the prose while leaving it unresolved in reality. Describe the specific disagreement and identify evidence that would discriminate among explanations.

This is where the [transcription desk](/transcription-desk/) and [witness comparison](/transcription-desk/compare/) tools can support a fuller study. Keep diplomatic text, normalization, translation, and apparatus distinct. The existing Getty exercises provide real manuscript locations; they are a route beyond the compact modern descriptions used in this chapter. The tool stores a research record, but the student still has to justify the reading.

## Writing a new blazon is a different editorial task

When designing fictional teaching arms, you can revise the wording to remove ambiguity. Begin with a clear structural plan, choose a convention, and write only the instructions needed to recover it. Then ask another reader to draw from the words without seeing your image. If the result puts the right objects in the wrong places, investigate whether the description omitted a relation or the reader misunderstood one.

Avoid false precision. Specify a charge's count and meaningful orientation; do not normally prescribe its exact screen coordinates unless the task actually requires a fixed graphic. A blazon is capable of supporting multiple competent realizations. Adding the number of feather lines in your current SVG can turn an artistic choice into an unnecessary constraint. At the same time, compactness should never be an excuse to omit a distinction that carries identity.

A useful revision process tests one change at a time. Add an explicit arrangement if the group is ambiguous. Repeat a tincture if a back-reference becomes unclear. Move a modifier into the phrase it governs. Separate nested components before giving their contents. The goal is an instruction a capable reader can operate, not a sentence that looks impressively archaic.

For actual proposed arms, formal wording and availability depend on the chosen institutional framework. A successful classroom blazon does not establish entitlement or an exhaustive uniqueness search. The distinction is easy to maintain: label the teaching design as constructed, describe the work it demonstrates, and identify the further process needed for a real adoption or grant.

## Test a parser against evidence, not evidence against a parser

The site's decoder accepts a deliberately small set of elementary structures. Its source implementation and examples define that supported grammar.[^parser] Unsupported expressions are declined. That behavior is useful because it makes the boundary visible, but it cannot determine whether a historical blazon is valid. An unfamiliar phrase can be correct and unsupported, damaged and uninterpretable, or mistranscribed. Those possibilities need separate diagnoses.

A good parser evaluation uses cases with known intended structures. Include a simple success, a superficially similar structure that should be different, and a valid source outside the implementation's scope. Record the result and expected relation. If the tool draws stars above a fess when the words place them on it, the error concerns support. If it rejects a compound cross it does not implement, that is a coverage limit. Calling both failures invalid heraldry would confuse software with the source language.

Keep the original description, normalized input, software version, parse result, and unresolved features. If the grammar improves, those records allow reanalysis. Throwing away the original after a successful parse makes the current implementation's assumptions permanent. A reference resource should preserve the evidence needed to outgrow its own tools.

For manual review, use the same principle. A reader's first interpretation is a model to test, not an authority that the witness must obey. Draw alternatives, compare sources, and revise the model. The difficult case is often the one that teaches the most, because it shows which apparently obvious default was doing hidden work.

## Six developed reading problems

### Problem 1: correct objects, wrong support

An artist receives the constructed gold-fess-and-red-stars blazon from the opening sections, but places the stars immediately above the fess. Explain the error without saying merely that the picture looks wrong. Supply the smallest verbal change that would instead request the artist's placement, with a clear arrangement.

<details>
<summary>Answer discussion: repair the relationship or repair the drawing</summary>

The source places stars on the fess; the artist has placed them in the field. Repairing the drawing restores support. Requesting the returned drawing requires wording that places the stars in chief or otherwise explicitly above the ordinary, with their group arrangement stated. A good answer recognizes these as different tasks. Changing the text of a historical source to excuse a wrong drawing would not be a legitimate documentary repair.

</details>

### Problem 2: a back-reference lost its target

In a fictional excerpt, a charge is described as “of the second,” but the editor has omitted the earlier clause naming the second tincture. Explain why the excerpt cannot supply a color, and propose an editorial presentation that restores the information without disguising the expansion as original wording.

<details>
<summary>Answer discussion: restore context transparently</summary>

The expression requires its ordered antecedent. Supply the complete blazon or a clearly labeled expansion based on the complete witness. Cite the target phrase and explain the expansion. Do not infer the tincture from a thumbnail or choose the color that produces conventional contrast. If the antecedent is unavailable, the uncertainty belongs in the result. The abbreviation's economy depends on context, so removing context changes interpretability.

</details>

### Problem 3: orientation and arrangement crossed wires

Describe a horizontal row of three upright keys, then a vertical column of three horizontal keys. Give each a plain-language explanation and an annotated diagram. Explain why a single direction field cannot preserve both descriptions.

<details>
<summary>Answer discussion: each object and the group have axes</summary>

One variable controls the keys' own alignment; another controls their centers' distribution. The first group is palewise individually and in fess collectively; the second reverses those relations. A database needs separate properties or an equivalent structured representation. The drawings can differ while sharing nouns, counts, and tinctures, which is exactly why a flat keyword list cannot reconstruct a blazon.

</details>

### Problem 4: the adjective escaped its quarter

A fictional composite places counterchanged coat A in quarters 1 and 4 and plain coat B in 2 and 3. A renderer counterchanges every charge across the main shield. Explain the scope error and provide a component path for the affected figure in quarter 1.

<details>
<summary>Answer discussion: keep the local field local</summary>

The operation belongs to coat A's own divided field. Its figure's path is main shield, quarter 1, component A, charge. It does not use the main shield's quarter boundaries as the color-exchange regions unless the description says so. A strong answer keeps the component specification and its placement separate. Repeated occurrence does not make the operation global.

</details>

### Problem 5: the commentary sounded certain in the summary

Read the David Macdonald Stewart record's qualification of symbolism. Write a short editorial note preserving it, then explain how that uncertainty differs from uncertainty about the shield's specified figures. Do not invent a new reason for the charges.

<details>
<summary>Answer discussion: confidence belongs to a proposition</summary>

The source can supply a formal description while stating that explanatory comments are hypotheses. The note should attribute the proposed meanings as unconfirmed. That does not make the entire record unusable. It separates secure composition from provisional intention and shows the next evidence needed: documentation of the chooser's explanation. A confident paraphrase that removes the source's qualifier weakens the scholarship.

</details>

### Problem 6: a valid source exceeds the tool

Choose one of the complex official descriptions linked in this chapter. Attempt a structural annotation manually and compare it with the elementary decoder's supported forms. Record the first unsupported operation. Explain why rewriting the source to obtain a successful rendering would change the exercise.

<details>
<summary>Answer discussion: coverage is not validity</summary>

The source's structure should remain the benchmark. A manual annotation can preserve unsupported nesting, modifiers, and figures. A simplified teaching version may be useful if clearly labeled, but it is no longer a full reconstruction of the source. Success means locating the implementation's boundary accurately, not forcing the historical record through it. The source text must remain available for a better tool or an expert artist.

</details>

## Research project: publish a small annotated blazon corpus

Select a defined set of short descriptions from one institutional or historical corpus. Record source language, witness, location, date, act type where relevant, diplomatic text, normalized text, structural parse, and plain-language explanation. Include several ordinary cases and at least two that challenge the convention you first assumed. Link protected images rather than reproduce them without permission.

Write an editorial method explaining what you normalize, how you mark uncertainty, and which conventions your explanations rely on. Then ask another reader to follow a description back to its source and reconstruct the structure from your analysis. The reader should be able to distinguish your decisions from the witness's wording. That test is more informative than whether every entry looks polished on the page.

The conclusion should identify a real grammatical pattern, a scope difficulty, or a translation problem supported by the corpus. A small defensible edition is already a contribution. Expanding it later should preserve the original witness trail and record revisions rather than replace uncertainty with unexplained confidence.

## Workshop: two artists, one description

Write three simple blazons and exchange them with another learner. Each person draws independently without seeing the other's image. Compare which differences are artistic and which require changes to the words. Include one case distinguishing a division from an ordinary and one distinguishing orientation from arrangement.

For documentary study, select a short description from an institutional register. Produce a literal transcription, an annotated parse, and a plain-language explanation. Cite the record and location. Reproduce no protected artwork without permission. Your explanation should identify at least one convention it relies on and one detail left to the artist.

[^grammar]: Fox-Davies, *A Complete Guide to Heraldry* (1909), chapter VIII, pp. 99–105, [text](https://www.gutenberg.org/cache/epub/41617/pg41617-images.html#page99). This chapter uses its English grammatical framework as dated instructional evidence.
[^scope]: Fox-Davies, chapter VIII, pp. 100–103; chapter XI, pp. 172–190, for the lion's attitudes and attributes.
[^orientation]: Fox-Davies, chapter VIII, pp. 102–103, distinguishes the position of individual spears from the arrangement of their group. The key example here is an original teaching construction.
[^counterchanging]: Fox-Davies, chapter VIII, p. 103, with chapter VII for divided and patterned fields. The document's actual wording controls scope.
[^universities-grammar]: Governor General of Canada, [*Universities Canada*](https://www.gg.ca/en/heraldry/public-register/project/2683), shield description, confirmation 15 May 2015, VI, 503. Analysis concerns the paired counting unit; no artwork reproduced. Consulted 10 October 2026.
[^thomson]: Court of the Lord Lyon, [*Blazoning*](https://courtofthelordlyon.scot/blazoning.htm), worked James Thomson example and explanation of “of the First.” Institutional pedagogical example, not a newly inspected register entry. Consulted 10 October 2026.
[^hinshelwood-grammar]: Governor General of Canada, [*Archibald Hinshelwood*](https://www.gg.ca/en/heraldry/public-register/project/2977), registration 15 November 2017, VII, 16, shield description. Source-linked grammatical analysis; no artwork reproduced. Consulted 10 October 2026.
[^goebel-grammar]: Governor General of Canada, [*Richard James Goebel*](https://www.gg.ca/en/heraldry/public-register/project/3626), grant 15 July 2024, VIII, 288. The counterchanging's target is distinguished from the separately specified face. No artwork reproduced; consulted 10 October 2026.
[^spanish-grammar]: Spain, [*Ley 33/1981, de 5 de octubre, del Escudo de España*](https://www.boe.es/eli/es/l/1981/10/05/33), articles 1–2, BOE-A-1981-24155. Spanish statutory description; this chapter supplies limited original structural commentary, not a full reviewed translation. Consulted 10 October 2026.
[^stewart-hypotheses]: Governor General of Canada, [*David Macdonald Stewart*](https://gg.ca/en/heraldry/public-register/project/3767), symbolism explicitly qualified as hypotheses. The indexed institutional text was consulted; direct retrieval was intermittent. Qualification retained without adopting the proposed meanings. Consulted 10 October 2026.
[^french-grammar]: IRHT/CNRS, [*Des armoiries et des livres — Héraldique*](https://lorfevre.irht.cnrs.fr/heraldique.php), “Partitions et pièces.” Original-language technical distinctions; direct retrieval was intermittent, with the institutional indexed text consulted. Consulted 10 October 2026.
[^parser]: Project implementation, `src/lib/blazon-parser.js`, and the [decoder's supported examples and limit statement](/decoder/). Software coverage is independent of source validity; the original text must be retained for unsupported expressions.
