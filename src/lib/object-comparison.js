export const NOTE_FIELDS=[
  {id:'question',label:'Research question',prompt:'What relationship or difference are you investigating?'},
  {id:'left',label:'Observations: left object',prompt:'What can you see? Describe features before identifying a bearer.'},
  {id:'right',label:'Observations: right object',prompt:'What can you see? Keep the object and its armorial display distinct.'},
  {id:'catalogue',label:'Catalogue-based claims',prompt:'Attribute each identification, date, or maker to its collection record.'},
  {id:'uncertainty',label:'Uncertainty and competing explanations',prompt:'Which claims remain open, and what else could explain the evidence?'},
  {id:'next',label:'Next sources to consult',prompt:'What dated witness, conservation record, or inventory would help?'}
];

export function selectObjectPair(objects,leftId,rightId){
  const left=objects.find(object=>object.id===leftId)||objects[0];
  const right=objects.find(object=>object.id===rightId&&object.id!==left.id)||objects.find(object=>object.id!==left.id);
  return [left,right];
}

export function comparisonNotes(value){
  return Object.fromEntries(NOTE_FIELDS.map(field=>[field.id,typeof value?.[field.id]==='string'?value[field.id]:'']));
}

export const comparisonStorageKey=(left,right)=>'heraldry-object-notes-v1:'+left.id+':'+right.id;

export function comparisonReport(left,right,notes){
  const source=object=>[
    '### '+object.catalogueTitle,
    '- Institution: '+object.museum,
    '- Accession: '+object.accession,
    '- Catalogue date: '+object.date,
    ...(object.creator?['- Catalogue maker: '+object.creator]:[]),
    '- Medium: '+object.medium,
    '- Collection record: '+object.url,
    '- Record consulted: '+object.accessed,
    '- Photograph: '+object.imageSource,
    '- Image rights: '+object.imageRights+'; '+object.rightsUrl
  ].join('\n');
  const values=comparisonNotes(notes);
  return '# Comparative object research notes\n\n'
    +'Student working notes. Catalogue identifications and dates remain attributed to their sources.\n\n'
    +'## Objects and sources\n\n'+source(left)+'\n\n'+source(right)+'\n\n'
    +NOTE_FIELDS.map(field=>'## '+field.label+'\n\n'+(values[field.id]||'[No note entered.]')).join('\n\n')+'\n';
}
