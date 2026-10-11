---
title: Geometry of the shield
unit: 4
updated: '2026-10-10'
status: 'Expanded teaching draft; specialist review pending'
---

## The shield has a viewpoint

Before learning the shapes, settle the directions. Heraldic **dexter** is the bearer's right, which appears on the viewer's left. **Sinister** is the bearer's left, appearing on the viewer's right. The upper area is **chief** and the lower area is **base**. These terms make a composition describable without depending on where the reader is standing.[^map]

If you have ever argued about whether a stage entrance is on the left, this should feel familiar. A coordinate system is useful only when its viewpoint is stated. The moment a designer silently changes from the bearer to the viewer, a bend can become a bend sinister and a directional animal can be reversed. A mirror image is not an innocent convenience when orientation carries information.

For this course's normal frontal illustrations, an animal facing dexter faces your left. The site's martlet mark follows that convention. When inspecting an original object, do not use the site mark as evidence of the object's orientation. Describe the original and check whether the image might itself have been reversed. A seal matrix and its impression are especially good reminders that the direction of an image can change during production.

## Locations are regions, not exact pixels

Terms such as dexter chief, sinister chief, center, and base locate features within the shield. They are not an engineering drawing with tolerances measured in millimeters. An artist places charges so that the composition remains legible and balanced within the chosen outline. A broad shield and a narrow shield may require different spacing while preserving the same relational arrangement.

This distinction is important for digital work. If a database stores only x and y coordinates from a photograph, it has recorded one image's layout. It has not necessarily captured the underlying armorial arrangement. Conversely, if it stores only “three charges,” it may have omitted their meaningful order. Preserve both when the project needs both: relational description for the design, image coordinates for the particular witness.

A charge described as **in chief** occupies the upper area. That does not necessarily mean it lies on an ordinary called **a chief**. A location and a shape may share a word. The surrounding grammar tells you which is intended. This small distinction will save you from drawing a horizontal band where the blazon merely asked you to place something near the top.

## Field divisions

A field can be divided into areas. **Per pale** makes a vertical division; **per fess** makes a horizontal one. **Per bend** divides diagonally from dexter chief toward sinister base. **Per bend sinister** uses the other diagonal. **Per chevron** divides along a chevron-shaped boundary. **Quarterly** produces four principal compartments, while **per saltire** produces four around diagonal boundaries.[^divisions]

| Expression | What to draw first | Common mistake |
|---|---|---|
| Per pale | A vertical boundary | Drawing a pale as a band |
| Per fess | A horizontal boundary | Drawing a fess on an undivided field |
| Per bend | A diagonal boundary | Reversing the bearer's viewpoint |
| Quarterly | Four compartments | Assuming four inherited coats without evidence |
| Per saltire | Crossing diagonal boundaries | Drawing a saltire charge instead of dividing the field |

The tinctures are assigned in a conventional reading order. For elementary two-part fields, identify the leading compartment before drawing. When a composition is more complex, reproduce the actual wording and consult a suitable regional manual. Do not extrapolate from one simple example to every arrangement.

## A division is not an ordinary

Compare *Per fess Argent and Gules* with *Argent, a fess Gules*. The first divides the field into white and red areas. The second places a red horizontal band on a white field. White remains visible above and below the band. These are different armorial structures even if a poorly proportioned drawing makes them look similar.

The difference is not merely semantic. A charge placed across a divided field interacts with two backgrounds. A charge on a fess lies on the ordinary. If your contrast checker or parser treats both cases as the same layer structure, later conclusions will be wrong. Geometry supplies relationships that the next unit's vocabulary of ordinaries depends on.

To test your understanding, cover the tincture words and inspect the grammatical structure. “Per fess” tells you to divide. “A fess” names an object to place. One short word controls the construction. Blazon works because small words do a great deal of work.

## Repetition and patterned fields

Fields may use repeated divisions: **barry** for horizontal pieces, **paly** for vertical pieces, and **bendy** for diagonal pieces. A stated number tells you how many pieces are intended. **Checky** and **lozengy** create other repeated arrangements.[^patterns] Count the pieces specified by the description rather than counting every visible strip of paint at a damaged edge.

Here again, image and specification are different records. A torn manuscript may preserve only part of a patterned field. A shield's curved outline can cut through a repeated shape. A modern redrawing may regularize a historical artist's uneven spacing. None of those observations should be silently converted into a new blazon.

For a teaching design, use repetition to explore how the eye groups shapes. Try a plain field beside a patterned one while holding the charge constant. Does the charge remain easy to identify? This is a design investigation, not a historical explanation for every patterned coat. You can test an effect without claiming to know the original bearer's intentions.

## Lines can have a character

Boundaries need not be straight. **Wavy**, **engrailed**, **invected**, **indented**, and **embattled** are among the terms used for distinctive line treatments. The treatment can apply to a division or to the edge of an ordinary, and the scope of the term must be read carefully.[^lines]

Do not describe every irregular medieval brushstroke as a special line. Some irregularity belongs to the material, workmanship, or damage. A sequence of regular waves is different evidence from a single accidental wobble. Compare the blazon, another witness, or the object's technical study before assigning a formal modification.

There is also a difference between identifying a pattern and dictating the exact number of its repetitions. A line described as wavy does not always specify that there must be precisely seven waves at a particular amplitude. Unless the source does specify that detail, retain enough artistic latitude to fit the shape. Precision means preserving meaningful distinctions, not inventing measurements.

## Quarterly is a shape before it is a genealogy

A four-part field may form one coat of arms. A quartered display may also combine distinct coats. The geometry alone does not decide which case you have. A historian needs the component descriptions, the bearer's context, and the documentary basis for marshalling. Unit 9 will develop that argument.

**Constructed comparison:** one invented design is *Quarterly Argent and Azure*. Another combines invented coat A in quarters 1 and 4 and invented coat B in quarters 2 and 3. Both use four principal compartments. Only the second example is defined here as a combination of two coats. Calling the first “four ancestral families” would add a story absent from the specification.

If your data model has a property named `quartered`, decide whether it describes geometry or marshalling. Better yet, store the distinction explicitly. Ambiguous fields in a database make it very easy to turn a geometric observation into an unsupported genealogical assertion.

## Build the design before decorating it

Imagine receiving three instructions: divide a shield horizontally into white above red; place a blue horizontal band on white; arrange three blue stars horizontally on white. All three involve a horizontal relationship. They nevertheless require three different constructions. In the first, the boundary partitions the field. In the second, a figure occupies part of the field. In the third, several figures form a group. The shared direction does not make their structures equivalent.

This is the central geometric distinction in heraldry: **partition, figure, and arrangement**. A partition creates regions. A figure has an extent within or across those regions. An arrangement relates multiple figures to one another. When we confuse the three, we may preserve every noun and tincture while building the wrong shield. Blazon's small words often tell us which operation to perform. “Per fess,” “a fess,” and “in fess” are not three stylistic ways of saying the same thing.

The distinction has a useful French comparison. The CNRS/IRHT heraldic guide places **coupé**, **fasce**, and **fascé** in its table of partitions and pieces. It similarly distinguishes **parti** from **pal**, and **tranché** from **bande**.[^irht-geometry] The table supplies a compact visual introduction to the different operations. Preserve the original terms when working with a French description. The familiar English horizontal band is a useful conceptual bridge, but replacing every related French term with “fess” would erase the difference the source is teaching.

For a first drawing, remove color and represent only boundaries. Does a line divide the field into two regions? Do two lines enclose a band? Are several isolated figures merely aligned? Once that structure is secure, assign tinctures and add detail. This order is particularly helpful with elaborate arms, where attractive animals and dense ornament can distract from the basic construction.

<figure class="academy-figure">
  <picture><source media="(max-width: 650px)" srcset="/images/academy/geometry-operations-mobile.svg" /><img src="/images/academy/geometry-operations.svg" alt="Three constructed shields compare a field divided per fess, a fess placed on a field, and three stars arranged in fess." width="720" height="390" loading="lazy" /></picture>
  <figcaption>The same horizontal axis supports three operations: partition, charge, and arrangement. Original teaching diagrams; these are not historical arms or grants.</figcaption>
</figure>

## A coordinate system needs an object and a viewpoint

Dexter and sinister describe the bearer's sides. That convention remains stable when a frontal image is redrawn, but not every photograph is a frontal view. A shield can be tilted, seen obliquely, held by a figure, or reproduced in a reflection. The observer has to identify the object's orientation before applying the descriptive map. A camera's left edge does not automatically coincide with heraldic dexter in a rotated photograph.

For a constructed example, take a blue shield with a gold bend. Rotate the whole photograph ninety degrees. The band has not become a fess; the shield and band rotated together. Now hold the shield upright and reverse only its internal design. The bend has changed direction. These are different transformations because one changes the viewing arrangement and the other changes the armorial relationship. A useful description states the orientation of the object and then the design within it.

A seal matrix introduces a further transformation. The working face of a matrix is made so its impression presents the intended design. Reading the matrix as if it were the impression can reverse lettering and directional charges. A photograph may also be reversed independently of the object. If a legend reads backward, that is a clue to investigate the production stage or image handling. It is not sufficient by itself to decide which occurred.

Document both sides of this problem. “The photographed matrix shows the animal facing the viewer's right” is an observation about that photograph. “The impression would show it facing the viewer's left” is a reconstruction contingent on the image not having been independently reversed. An actual impression can test the reconstruction. Geometry becomes historical evidence when the transformation is known; it becomes a source of error when the transformation is silently assumed.

The National Records of Scotland's terminology guide and the Lyon Court's worked blazon both supply the bearer-based viewpoint.[^institutional-map] They are useful institutional anchors for the convention. A student should still describe the inspected object's position. Knowing the convention is necessary; recognizing the evidence to which it applies is a separate skill.

## Nine regions are a reading aid, not nine little boxes

The shield can be discussed as upper, middle, and lower regions, each with dexter, central, and sinister positions. This gives us dexter chief, chief, sinister chief; the corresponding middle regions; and dexter base, base, sinister base. Such a map helps locate a figure without measuring its exact center. A charge “in chief” belongs to the upper region. It does not have to be imprisoned inside a rigid top-third rectangle if the composition and convention give it more room.

The center is particularly easy to misunderstand. A geometrical center of a rectangular bounding box is not necessarily the visually effective center of a tapered shield. The lower point has less area than the upper portion. A large bird with extended wings has a different distribution of visual mass from a compact roundel. An artist may adjust placement to make the composition coherent while preserving its specified position. That is judgment about one realization, not a universal numerical offset to add to every charge.

We can test this without claiming historical intent. Draw one star on a broad shield and on a narrow pointed shield. Place both at the midpoint of the outer bounding box, then compare the surrounding space. Move the star slightly and observe when it looks balanced. The experiment demonstrates that equal numerical coordinates can produce different visual relationships. It does not tell us where a medieval artist intended to place a particular damaged star; that still requires the witness and specification.

For digital cataloguing, distinguish **relational position** from **measured location**. “In base” is a design description. “Center at 47 percent of this image's width and 73 percent of its height” is an observation about an image. Both may be useful, but they should not occupy one field. If a future photograph has a different crop, the measured coordinates can change while the relational position remains the same.

## Dividing a field creates a reading order

In elementary two-tincture fields, the description assigns tinctures according to the partition and the applicable convention. Per pale begins with the dexter portion; per fess begins with the upper portion. For per bend, begin with the upper compartment above the diagonal running from dexter chief to sinister base. Do not replace this procedure with “always color the left half first,” because a diagonal division and a horizontal one do not have the same left half. State the partition before assigning its tinctures.

Quarterly and per saltire both produce four principal regions, but their boundaries differ. A quarterly field has vertical and horizontal boundaries. A per-saltire field uses the two diagonals. A full saltire is instead a figure with width. Confusion is especially likely when a narrow white gap between colored triangular areas looks like a white saltire. Is the gap a specified figure, an outline added by the artist, or simply the division rendered inaccurately? The text and a comparison image can discriminate among those possibilities.

Three-part and irregular divisions require another step. Do not force them into a two-color template. **Per pall** uses a Y-shaped division, and descriptions can specify three tinctures. The College of Arms' record for Sir David Reddaway, granted 1 December 2021, is a dated example of that expression.[^reddaway] Its source supplies both division and charge placement. The geometry is easier to understand if you draw the Y-shaped boundaries before distributing the figures. A three-part field is not a pale with a missing section.

The regional vocabulary can differ even when the underlying construction is comparable. Translate the operation, not just the word. Preserve a diagram or a plain-language structural explanation alongside the original term when equivalence is uncertain. A familiar English label that creates the wrong number of regions is less useful than an unfamiliar source term explained accurately.

## Repetition: count pieces, bands, and visible fragments separately

Take a field described as barry of six. The intended construction has six horizontal pieces across the whole field. A shield bearing three bars has three horizontal charges on a background. The first description counts alternating field pieces; the second counts figures. Depending on tincture order and proportions, the resulting pictures can be deceptively similar. Their grammar still describes different constructions, and their interactions with other charges may expose the distinction.

Counting a damaged image creates another problem. A chip may remove the bottom of a striped field. A photograph may crop the top. A narrow strip may be a line of outline rather than a field piece. Record the observed fragments and the complete specification separately. If the blazon says six pieces but only five are visible, ask whether the image is incomplete before declaring the description wrong. The specification can supply a reconstruction, but the reconstruction should not be presented as six fully observed areas.

**Paly** and **bendy** raise the same questions on other axes. The curved outline clips the repeated pieces, so their visible lengths vary. **Checky** and **lozengy** create repeated two-dimensional patterns whose edge units can be partial. Count what the particular picture shows if your study concerns artistic spacing. If your study concerns armorial identity, record the patterned treatment and any specified count instead of assigning the crop's incidental total to the design.

A simple controlled comparison is useful. Draw one lozengy field on a shield and on a rectangle with the same pattern scale. The rectangle may show more complete lozenges. The shield may show partial edge units. The two supports need not represent different armorial patterns. Their borders intersect the pattern differently. This is the difference between counting shapes in an image and describing the rule generating the pattern.

## Counterchanging is an operation across regions

Counterchanging becomes clearer when treated as a rule applied to a specified figure. Divide a constructed field per pale into white and blue. Place a single broad star across the boundary. The portion of the star on white becomes blue; the portion on blue becomes white. We still have one star, not two independent half-stars. Its contour continues across the division while its tincture responds to the underlying region.

Now move two separate stars to opposite sides without crossing the boundary. They can take the exchanged tinctures as a group if that is what the description specifies. The visual result does not require every counterchanged figure to be cut through its middle. The operation assigns tinctures according to the relevant field areas and scope. Read what is counterchanged before painting everything in the shield with the opposite color.

The record for Richard James Goebel, a grant dated 15 July 2024, combines a per-chevron field, a counterchanged pale, and a separately specified badger's face.[^goebel] This is a useful actual reading problem because the operation applies to the pale across a shaped boundary; the named face has its own tincture and position. The source's composition prevents us from treating “counterchanged” as a global command affecting every charge. A layer diagram should identify field regions, pale, and face as separate components.

For a research transcription, retain the complete phrase. If your software cannot represent a counterchanged ordinary, record that limit and preserve the source. Replacing the whole composition with four colored rectangles may produce a similar thumbnail but loses the continuous figure. The drawing should express the operation's structure, not just approximate its color balance.

## Line treatments change edges, not the whole vocabulary

A boundary can be wavy, indented, embattled, engrailed, or otherwise modified. The basic geometry tells us what is divided or charged; the line treatment tells us how a particular edge behaves. A wavy per-fess division remains a partition. A wavy fess remains a band, normally with the specified treatment on its relevant edges. The word wavy does not convert every nearby shape into water or settle the original reason for choosing it.

**Engrailed** and **invected** require attention to which side of the line belongs to the figure. Scallops that bite into the figure produce a different edge from scallops projecting out of it. If you inspect only one detached boundary without knowing the enclosed area, the distinction can become ambiguous. Draw the whole figure and shade its interior before assigning the term. The problem is geometric sidedness, not simply whether a line looks curly.

An **embattled** edge evokes alternating raised and recessed portions. A line described as indented has a repeated pointed character. Those descriptions still leave questions of spacing, amplitude, and count unless the source fixes them. An artist working on a narrow ordinary may need fewer repetitions than one working on a large banner. The figure should remain identifiable, and explicit numerical requirements must survive. Unspecified numerical detail should not be manufactured as a rule.

Compare two kinds of irregularity. A repeated, consistent pattern supported by a blazon is good evidence of a formal line treatment. One wobble caused by a brush, crack, or torn edge is not. In a damaged stone, a row of missing chips may accidentally resemble an indented line. A technical examination or earlier image can help distinguish carving from damage. Geometry should report what is preserved, then use evidence to explain why it has that form.

There is an actual institutional counterexample to the assumption that every plausible line is acceptable everywhere. Minutes of Sweden's heraldic board dated 1 February 2017 discuss a proposed Mölndal design, including an unfamiliar division line and a missing charge relative to the registered blazon.[^molndal] The important mechanism is source-specific review: formal vocabulary and the existing specification constrain a proposed redesign. An attractive new curve does not become an authorized heraldic boundary merely because a designer can draw it smoothly.

## Adjacency and superposition answer different questions

Two field regions can share a boundary. A charge can cover a region. Two charges can overlap. A smaller charge can lie on an ordinary. These relationships are geometrically different, and the tincture chapter's contrast analysis depends on them. If you cannot tell what touches and what covers, you cannot reliably identify the immediate background of a charge.

Use a constructed white shield with a red fess and a blue roundel. If the roundel lies above the fess without touching it, its immediate background is white. If it lies wholly on the fess, its background is red. If it crosses the fess, it meets both backgrounds. The same three colors and two figure names can therefore produce three different contrast problems. Geometry supplies the information that a color inventory lacks.

A layer sketch does not have to reproduce the finished artwork. Represent the field as the base region, the fess as a band, and the roundel as a circle. Mark the overlap. Then apply tinctures. This small diagram can make a complicated blazon understandable before its animal details are complete. It also exposes a parser that has attached the roundel to the wrong support.

Do not infer a formal edging from a drawing's thin black line. Rendering outlines help separate shapes on a screen, but they do not necessarily belong to the specification. A fimbriation, by contrast, is a described narrow border around a figure. The two can look similar at low resolution. The verbal record and a better image help decide which relationship the apparent line represents.

## Adaptation is constrained by the support

The same composition may occupy a shield, a banner, a circular seal, or a decorated plate. Each support changes available space. A tapering base compresses lower charges. A rectangular banner offers broad corners. A circular medallion may encourage an inset shield rather than a direct stretching of the arms. The artist must preserve the design's meaningful relationships while deciding how the particular object carries them.

The Met targe studied in the anatomy chapter is especially helpful because its physical contour and its painted armorial shield differ. The painted achievement lives inside a larger shaped object.[^geometry-targe] Measuring the outer targe and calling those measurements the proportions of its painted arms would confuse support with image. Before calculating a center or diagonal, decide which outline you are studying.

In digital production, blindly stretching an SVG can distort a charge's identity. Scaling the whole shield and its figures uniformly is different from changing only the vertical dimension. A star can become unusually elongated; a circular charge can become an ellipse; a chevron's angle changes. A responsive design should choose a suitable layout or scale the illustration proportionally. If the armorial support itself is deliberately changed, redraw the figures competently within it rather than mechanically squash them.

This is another place where geometric correctness and visual balance cooperate. A diagram can put three stars at mathematically equal intervals and still leave the outer stars cramped by sloping edges. Adjusting spacing to the actual available area may preserve the arrangement better. The specification controls the relationship; the support controls the practical realization. Neither a universal pixel coordinate nor unbounded artistic license can do both jobs.

## Extended laboratory: transformations and reconstruction

### Exercise 1: three horizontal instructions

Draw the three constructed operations shown above: a per-fess field, a fess, and three stars in fess. Describe the difference without relying on color names. Then add a roundel that lies on the fess in only the second design and explain the extra relationship its wording requires.

<details>
<summary>Answer discussion: the operation survives removal of color</summary>

The partition uses one boundary to create upper and lower regions. The ordinary uses a band with field visible on both sides. The arrangement relates three isolated stars horizontally without introducing a band. In the second design, “on” assigns the roundel to the fess rather than the field. A strong answer can recover those structures from a monochrome outline. If it can explain the pictures only by saying red above white or blue stars, it has not yet isolated the geometry.

</details>

### Exercise 2: rotate, reflect, and redraw

Make four versions of the invented blue shield and gold bend: upright, a rotated whole image, a horizontally reflected whole image, and a new upright drawing with the same bend. Identify which differences concern viewing orientation, which concern the internal design, and which concern artistic realization. State any assumptions needed about the original photograph.

<details>
<summary>Answer discussion: identify what was transformed</summary>

Rotation of the whole object changes its photographed orientation. Reflection changes the relation to the upright shield's bearer-based sides unless it represents an intermediate production stage such as a matrix. A competent new upright drawing can preserve the design while changing proportions. The account should distinguish a transformation of the evidence from a deliberate transformation of the arms. Without knowing how an image was produced, an observed reversal remains a problem to investigate rather than a secure redesign.

</details>

### Exercise 3: count a damaged pattern

In a constructed photograph, five complete horizontal pieces survive and the bottom is broken. A separate trustworthy description specifies a barry field of six. Write an observed description, a source-based reconstruction, and a note explaining why they differ. Do not repaint the photograph or silently correct the description.

<details>
<summary>Answer discussion: a reconstruction is another layer</summary>

The observation reports the five preserved pieces and damage. The reconstruction follows the specified six-piece field, contingent on the description applying to this object. The note explains that the sixth piece is supplied from textual evidence rather than directly observed. If the text's connection to the photograph is uncertain, that is the missing premise. A complete-looking drawing cannot strengthen that premise by looking convincing.

</details>

### Exercise 4: read the Goebel operation

Use the institutional record for Richard James Goebel. Draw a plain structural plan identifying the per-chevron regions, pale, and separately described face. Explain the scope of counterchanging and identify which tincture assignment should not be treated as a global inversion. Link the record instead of copying its protected artwork.

<details>
<summary>Answer discussion: one modifier has a defined target</summary>

The pale crosses the divided field and exchanges its tinctures in relation to that field. The face has its own position and explicit tincture. An answer that reverses all colors indiscriminately has lost scope. The plan should preserve the pale as one continuous figure despite its changing tincture. This exercise combines partition, figure, position, and a color operation; each part has to remain identifiable.

</details>

## Research project: when a redraw becomes a redesign

Choose an institutional emblem for which an earlier blazon and a proposed or adopted later drawing are available. Compare the geometry component by component: partitions, figure extents, orientation, count, arrangement, overlap, and modified edges. Separate changes in artistic treatment from changes that require different descriptive instructions. If an official review exists, compare your analysis with its stated reasons rather than merely reporting whether it approved the result.

The Mölndal minutes offer a defined starting point. Read the Swedish text, retain its technical expressions, and identify what the board says is missing or unfamiliar. A working English synthesis should show which conclusions belong to the board and which are your geometric analysis. The project need not settle a municipality's current branding. It can answer the narrower, well-supported question of why this particular proposal raised these particular heraldic objections.

Conclude with a model specification for a faithful educational redraw. Explain the freedoms that remain and the relationships that must survive. A serious specification can allow variation while being exact about identity. That is the geometric foundation of heraldic art.

## Workshop and answer discussion

Draw six empty shields. Divide them per pale, per fess, per bend, per bend sinister, quarterly, and per saltire. Mark dexter and sinister outside the first drawing. Then make a seventh shield bearing a fess and explain how it differs from the second.

For a written exercise, evaluate this statement: “A shield divided into four quarters proves descent from four armigerous ancestors.” Give at least two alternative explanations and identify what evidence could distinguish them. Do not merely answer “false”; explain the missing inference.

<details>
<summary>What should a correct answer include?</summary>

The drawings must preserve the bearer's viewpoint. The fess should be an ordinary with field visible on both sides, rather than a two-part division. The written answer should distinguish a single quarterly field from a marshalled coat and acknowledge that repeated quarters need not indicate four different ancestors. A source blazon, documentary genealogy, and a dated explanation of the composition would be relevant evidence. A modern surname search would not settle the question.

</details>

[^map]: Fox-Davies, *A Complete Guide to Heraldry* (1909), chapter VI, pp. 60–66, [text](https://www.gutenberg.org/cache/epub/41617/pg41617-images.html#page60). Historical explanation of the shield and its divisions; chapter VIII discusses descriptive order.
[^divisions]: Fox-Davies, chapter VII, especially pp. 96–98, [text](https://www.gutenberg.org/cache/epub/41617/pg41617-images.html#page96). English terminology is used here for a foundational exercise, not imposed as the vocabulary of all traditions.
[^patterns]: Fox-Davies, chapter VII, p. 97 onward; chapter IX, pp. 106–157. Preserve a source's specified number of pieces.
[^lines]: Fox-Davies, chapter VII, pp. 90–98, and chapter IX. The historical manual provides comparative drawings; object-specific identification still requires the witness.
[^irht-geometry]: Institut de recherche et d'histoire des textes, CNRS, [*Des armoiries et des livres — Héraldique*](https://lorfevre.irht.cnrs.fr/heraldique.php), “Partitions et pièces.” Original French technical guide; the limited term comparison is an original English synthesis, not a complete translation. Consulted 10 October 2026.
[^institutional-map]: National Records of Scotland, [*Coat of Arms*, terminology](https://www.nrscotland.gov.uk/learning-and-events/research-guides/coat-of-arms/?section=terminology); Court of the Lord Lyon, [*Blazoning*](https://courtofthelordlyon.scot/blazoning.htm). Institutional terminology and a worked example; consulted 10 October 2026.
[^reddaway]: College of Arms, [*January 2022 Newsletter*, no. 67](https://www.college-of-arms.gov.uk/news-grants/newsletter/item/194-january-2022-newsletter-no-67), Sir David Norman Reddaway, grant 1 December 2021, Grants 183/331. Institutional publication of a specific grant; no artwork reproduced. Consulted 10 October 2026.
[^goebel]: Governor General of Canada, [*Richard James Goebel*](https://www.gg.ca/en/heraldry/public-register/project/3626), grant 15 July 2024, VIII, 288, shield blazon. No artwork reproduced; original structural analysis. Consulted 10 October 2026.
[^molndal]: Riksarkivet, [*Protokoll, Riksarkivets heraldiska nämnd*, 1 February 2017](https://riksarkivet.se/Media/pdf-filer/HNProtokoll170201.pdf), Mölndal discussion. Swedish institutional minutes, specifically the missing sickle, unfamiliar division line, and absent bounding line in the proposed drawing. Original English synthesis, not a full reviewed translation or a statement of current municipal branding. Consulted 10 October 2026.
[^geometry-targe]: The Metropolitan Museum of Art, [*Shield for the Field or Tournament (Targe)*, 25.26.1](https://www.metmuseum.org/art/collection/search/22876); the existing [illustrated object study](/objects/franconian-targe/) distinguishes physical support from painted shield. No new attribution claimed.
