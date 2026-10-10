export const searchableObjectText = object => [object.title,object.catalogueTitle,object.culture,object.material,object.medium,object.museum,object.summary].filter(Boolean).join(' ');
export const normalizeObjectSearch = text => String(text||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
export function matchesObjectStudy(object,{query='',material='',period=''}={}){
  const text=normalizeObjectSearch(object.searchText??searchableObjectText(object));
  return normalizeObjectSearch(query).trim().split(/\s+/).every(word=>text.includes(word))
    && (!material||object.material===material)
    && (!period||(object.periods||[]).includes(period));
}
