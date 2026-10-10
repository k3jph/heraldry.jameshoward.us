import objects from '../data/objects.json' with {type:'json'};

// Cite the modern collection record; the object's date is not its publication year.
export const objectCitation = object => ({
  id: 'object-'+object.id,
  titleOriginal: (object.recordTitle||object.catalogueTitle)+' ('+(object.recordTitle?'study photograph identifier':object.identifierLabel||'accession')+' '+object.accession+')',
  holding: object.recordHolding||object.museum,
  language: 'en',
  kind: object.recordKind||(object.identifierLabel?'photograph record':'museum collection record'),
  area: object.culture,
  url: object.url,
  accessed: object.accessed,
});
export const objectStudies = objects;

export const featuredObjectStudies=['vols-colonna-armour','garter-banners-colour','zurich-civic-roundel'].map(id=>{const object=objects.find(object=>object.id===id);if(!object)throw new Error('Missing featured object: '+id);return object;});
export const relatedObjectStudies = object => objects.filter(other=>other.id!==object.id).sort((a,b)=>(Number(b.material===object.material)*2+Number(b.lesson===object.lesson))-(Number(a.material===object.material)*2+Number(a.lesson===object.lesson))).slice(0,3);
