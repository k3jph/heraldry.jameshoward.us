import sources from '../../data/world-sources.json';
import {makeBibtex} from '../../lib/bibliography.js';
export function GET(){
  const header='% The Heraldry Project · annotated primary and secondary sources\n% Exported from https://heraldryproject.org/source-atlas/\n% Publication years are not inferred from access dates. Verify edition, authority and copyright.\n';
  return new Response(header+'\n'+sources.map(makeBibtex).join('\n\n')+'\n',{headers:{'Content-Type':'application/x-bibtex; charset=utf-8','Content-Disposition':'attachment; filename="heraldry-source-atlas.bib"'}});
}
