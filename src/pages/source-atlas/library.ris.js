import sources from '../../data/world-sources.json';
import {makeRIS} from '../../lib/bibliography.js';
export function GET(){
  return new Response(sources.map(makeRIS).join('\n\n')+'\n',{headers:{'Content-Type':'application/x-research-info-systems; charset=utf-8','Content-Disposition':'attachment; filename="heraldry-source-atlas.ris"'}});
}
