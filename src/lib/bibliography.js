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
const corp=(s)=>stringify(s.holding).split(' · ')[0]||stringify(s.holding);

export function makeBibtex(source) {
  const title=safeBib(source.titleOriginal);
  const author=safeBib(corp(source));
  const url=stringify(source.url);
  const note='Original-language '+stringify(source.kind)+'. Accessed '+accessed(source)+'.';
  return '@misc{'+citationKey(source)+',\n'
    +'  author = {{'+author+'}},\n'
    +'  title = {'+title+'},\n'
    +'  howpublished = {\\url{'+url+'}},\n'
    +'  url = {'+url+'},\n'
    +'  note = {'+safeBib(note)+'}\n'
    +'}';
}
export function makeRIS(source) {
  const title=stringify(source.titleOriginal).replace(/[\r\n]/g,' ');
  return [
    'TY  - ELEC',
    'TI  - '+title,
    'AU  - '+corp(source),
    'UR  - '+stringify(source.url),
    'LA  - '+stringify(source.language),
    'Y2  - '+accessed(source).replaceAll('-','/'),
    'N1  - Original-language '+stringify(source.kind)+'; accession and legal context should be verified against the source.',
    'ER  - '
  ].join('\n');
}
export function makeCSL(source) {
  const d=accessed(source).split('-').map(Number);
  return {
    id:citationKey(source),
    type:'webpage',
    title:stringify(source.titleOriginal),
    author:[{literal:corp(source)}],
    URL:stringify(source.url),
    accessed:{'date-parts':[d]},
    language:stringify(source.language),
    note:'Original-language '+stringify(source.kind)+'; '+stringify(source.area)
  };
}
