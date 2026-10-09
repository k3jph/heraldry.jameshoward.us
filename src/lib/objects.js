import objects from '../data/objects.json' with {type:'json'};

// Cite the modern collection record; the object's date is not its publication year.
export const objectCitation = object => ({
  id: 'object-'+object.id,
  titleOriginal: object.catalogueTitle+' (accession '+object.accession+')',
  holding: object.museum,
  language: 'en',
  kind: 'museum collection record',
  area: object.culture,
  url: object.url,
  accessed: object.accessed,
});
export const objectStudies = objects;
