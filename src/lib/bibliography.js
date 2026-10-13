/**
 * Stable research citations for our original-language institutional source ledger.
 * Dates default to access dates, NOT invented publication dates.
 * The corpus is mixed: statutes, catalogues, registers, guides, and scholarly organizations.
 */
const stringify=(value)=>String(value??'').trim();
const safeBib=(value)=>stringify(value).replaceAll('\\','\\textbackslash{}')
  .replace(/([{}&#_%$])/g,'\\$1')
  .replaceAll('~','\\textasciitilde{}').replaceAll('^','\\textasciicircum{}');
export const citationKey=(s)=>'jhheraldry_'+stringify(s.id).replace(/[^a-z0-9_-]/gi,'_');
const accessed=(s)=>(/^\d{4}-\d{2}-\d{2}$/.test(s.accessed||'')?s.accessed:'2026-10-08');
// The custodian of a document is not necessarily its creator. The source ledger
// can optionally supply a named author or authors, with the holder separately.
const creator=(s)=>Array.isArray(s.authors)?s.authors.map(stringify).filter(Boolean):stringify(s.author)?[stringify(s.author)]:[];
const holder=(s)=>stringify(s.holding);
const bibAuthor=(s)=>creator(s).map(safeBib).join(' and ');

export function makeBibtex(source) {
  const title=safeBib(source.titleOriginal);
  const authors=bibAuthor(source);
  const url=stringify(source.url);
  const note='Source type: '+stringify(source.kind)+'. Accessed '+accessed(source)+'. Verify bibliographic details at the linked original.';
  return '@misc{'+citationKey(source)+',\n'
    +(authors?'  author = {'+authors+'},\n':'')
    +'  title = {'+title+'},\n'
    +'  organization = {'+safeBib(holder(source))+'},\n'
    +'  howpublished = {\\url{'+url+'}},\n'
    +'  url = {'+url+'},\n'
    +'  note = {'+safeBib(note)+'}\n'
    +'}';
}
export function makeRIS(source) {
  return [
    'TY  - GEN',
    'TI  - '+stringify(source.titleOriginal).replace(/[\r\n]/g,' '),
    ...creator(source).map(author=>'AU  - '+author),
    'PB  - '+holder(source),
    'UR  - '+stringify(source.url),
    'LA  - '+stringify(source.language),
    'Y2  - '+accessed(source).replaceAll('-','/'),
    'N1  - Source type: '+stringify(source.kind)+'; verify publication and legal context.',
    'ER  - '
  ].join('\n');
}
export function makeCSL(source) {
  const d=accessed(source).split('-').map(Number);
  return {
    id:citationKey(source), type:'webpage',
    title:stringify(source.titleOriginal),
    ...(creator(source).length?{author:creator(source).map(literal=>({literal}))}:{}),
    publisher:holder(source),
    URL:stringify(source.url),
    accessed:{'date-parts':[d]},
    language:stringify(source.language),
    note:'Source type: '+stringify(source.kind)+'; '+stringify(source.area)
  };
}
