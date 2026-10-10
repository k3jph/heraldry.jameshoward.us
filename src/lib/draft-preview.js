// Show entered text before catalogue boilerplate, with space for each field.
const excerpt=value=>value?value.slice(0,300)+(value.length>300?'\n[Excerpt; download for the full text.]':''):'[Not entered]';
const fields=(value,prefix='')=>Object.entries(value).map(([name,text])=>prefix+name+':\n'+excerpt(text)).join('\n\n');
export function draftPreview(_id,draft){
  if(draft.readings)return 'Left witness reading\n'+fields(draft.readings.left.draft.fields)+'\n\nRight witness reading\n'+fields(draft.readings.right.draft.fields)+'\n\nComparison notes\n'+fields(draft.fields)+'\n\nLocated comparisons: '+draft.alignments.length;
  if(draft.fields)return fields(draft.fields)+'\n\nApparatus entries: '+draft.apparatus.length;
  return fields(draft);
}
