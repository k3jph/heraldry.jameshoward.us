/**
 * Citation exports from source-specific bibliographic metadata.
 * A holding institution is a custodian, not automatically the author.
 * Missing authors or publication dates remain missing, not invented.
 */
const str = value=>String(value??'').trim();
const bibEscape = value=>str(value).replaceAll('\\','\\textbackslash{}')
  .replace(/([{}&#_%$])/g,'\\$1')
  .replaceAll('~','\\textasciitilde{}').replaceAll('^','\\textasciicircum{}');
export const citationKey = s => 'jhheraldry_'+str(s.id).replace(/[^a-z0-9_-]/gi,'_');
const accessed = s => /^\d{4}-\d{2}-\d{2}$/.test(s.accessed||'') ? s.accessed : '2026-10-08';
const authors = s => Array.isArray(s.authors) ? s.authors.map(str).filter(Boolean)
  : str(s.author) ? [str(s.author)] : [];
const isArticle = s => s.recordType==='journal-article' || (!!s.containerTitle && /research|article/i.test(str(s.kind)));
const note = s => [s.language==='en'?'English-language source':'Non-English source',
  str(s.kind),str(s.titleStatus), 'Accessed '+accessed(s)].filter(Boolean).join('. ')+'.';
const pageRange=s=>str(s.pages).split(/[–—-]/).map(x=>x.trim());
const maybe=(name,value)=>str(value) ? '  '+name+' = {'+bibEscape(value)+'},\n' : '';

export function makeBibtex(source) {
  const article=isArticle(source);
  const name=article?'article':'misc';
  const lines=['@'+name+'{'+citationKey(source)+','];
  if(authors(source).length)lines.push('  author = {'+authors(source).map(bibEscape).join(' and ')+'},');
  lines.push('  title = {'+bibEscape(source.titleOriginal)+'},');
  if(source.containerTitle)lines.push('  journal = {'+bibEscape(source.containerTitle)+'},');
  if(source.publicationYear)lines.push('  year = {'+source.publicationYear+'},');
  if(source.volume)lines.push('  volume = {'+bibEscape(source.volume)+'},');
  if(source.issue)lines.push('  number = {'+bibEscape(source.issue)+'},');
  if(source.pages)lines.push('  pages = {'+bibEscape(source.pages)+'},');
  if(source.doi)lines.push('  doi = {'+str(source.doi)+'},');
  lines.push('  institution = {'+bibEscape(source.holding)+'},');
  lines.push('  url = {'+str(source.url)+'},');
  lines.push('  note = {'+bibEscape(note(source))+'}');
  return lines.join('\n')+'\n}';
}
export function makeRIS(source) {
  const out=['TY  - '+(isArticle(source)?'JOUR':'GEN')];
  out.push('TI  - '+str(source.titleOriginal).replace(/[\r\n]/g,' '));
  for(const author of authors(source))out.push('AU  - '+author);
  if(source.containerTitle)out.push('JO  - '+str(source.containerTitle));
  if(source.publicationYear)out.push('PY  - '+str(source.publicationYear));
  if(source.volume)out.push('VL  - '+str(source.volume));
  if(source.issue)out.push('IS  - '+str(source.issue));
  if(source.pages){const [start,end]=pageRange(source);out.push('SP  - '+start);if(end)out.push('EP  - '+end);}
  if(source.doi)out.push('DO  - '+str(source.doi));
  out.push('PB  - '+str(source.holding));
  out.push('UR  - '+str(source.url));
  out.push('LA  - '+str(source.language));
  out.push('Y2  - '+accessed(source).replaceAll('-','/'));
  out.push('N1  - '+note(source));
  out.push('ER  - ');
  return out.join('\n');
}
export function makeCSL(source) {
  const date=accessed(source).split('-').map(Number);
  return {
    id:citationKey(source),
    type:isArticle(source)?'article-journal':'webpage',
    title:str(source.titleOriginal),
    ...(authors(source).length?{author:authors(source).map(literal=>({literal}))}:{}),
    ...(source.containerTitle?{'container-title':str(source.containerTitle)}:{}),
    ...(source.publicationYear?{issued:{'date-parts':[[Number(source.publicationYear)]]}}:{}),
    ...(source.volume?{volume:str(source.volume)}:{}),
    ...(source.issue?{issue:str(source.issue)}:{}),
    ...(source.pages?{page:str(source.pages)}:{}),
    ...(source.doi?{DOI:str(source.doi)}:{}),
    publisher:str(source.holding),
    URL:str(source.url),
    accessed:{'date-parts':[date]},
    language:str(source.language),
    note:note(source)
  };
}
