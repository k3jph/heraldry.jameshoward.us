# Object-study collection

The collection contains 35 source-linked studies: 8 earlier studies and 27 additions. The homepage deliberately features three, selected by stable identifiers in `src/lib/objects.js`. The complete collection supports combined text, material, and period filters; broadly dated objects can belong to more than one period.

## Sources and images

The additional museum studies use 24 Cleveland Museum of Art objects whose individual API records designate the images as CC0. The three chapel studies use a Bain archival photograph, a photographer-released public-domain colour view of Windsor, and David Iliff's CC BY-SA 3.0 photograph of the chapel at St Paul's. `object-image-rights.json` records each addition's evidence URL, verification date, source image, local reproduction, and SHA-256 checksum.

Image licences apply to the photographs; they do not confer entitlement to the depicted arms. Rights, credit, and resize statements appear beside gallery, homepage, and study images. The comparison bench updates credits and licences when selections change, and both Markdown and recovery JSON exports retain attribution. Local images are resized without cropping or recolouring. A modified copy of a BY-SA photograph retains the corresponding image licence; that does not assign the same licence to unrelated editorial text.

The Windsor photographs are dated views (circa 1915–1920 and 1983). The St Paul's photograph records 30 May 2014. These views must not be presented as current inventories or used to identify today's holders without separate dated evidence.

## Adding a study

1. Verify the specific object's or photograph's source and image reuse terms. A general institutional open-access policy alone does not establish that every image qualifies.
2. Record the original identifier, repository, dating, culture, maker qualifiers, material, source URL, consultation date, and licence. Preserve uncertainty and distinguish artifact dates from photograph dates.
3. Inspect the actual photograph. Write observations separately from source-attributed statements, then supply an interpretation, bounded claims, an exercise, discussion, and a next research step.
4. Add a local reproduction with matching dimensions, descriptive alternative text, and a rights-evidence/checksum entry. Retain required author attribution and an actual licence link for licences such as CC BY-SA.
5. Choose a related Academy lesson and appropriate overlapping periods. Comparison pieces are welcome, but must explicitly explain why a shield shape, decorated animal, monogram, or the catalogue's word “heraldic” does not itself establish a coat of arms.
6. Run the object and notebook tests, Astro check, and production build. Inspect the study and its comparison credit. Retain only two or three homepage features as the collection grows.

There is no fixed editorial ceiling. Future growth should broaden repositories and modern civic or institutional objects alongside historical artifacts. Every addition needs rights evidence and a useful question; the collection is a set of teaching studies, not an indiscriminate image feed. Specialist review remains pending.
