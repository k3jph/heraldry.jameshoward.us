import {TINCTURES,DEFAULT_DESIGN,normalizeDesign,blazon} from './heraldry.js';

const tincture='(?:or|argent|gules|azure|sable|vert|purpure)';
const ORDINARY_NAMES={'bend sinister':'bend-sinister','fess':'fess','pale':'pale','bend':'bend','chief':'chief','chevron':'chevron','cross':'cross','saltire':'saltire','bordure':'bordure'};
const CHARGE_NAMES={
 'mullet':['a mullet','three mullets'],
 'martlet':['a martlet','three martlets'],
 'fleur':['a fleur-de-lis','three fleurs-de-lis'],
 'rose':['a rose','three roses'],
 'escallop':['an escallop','three escallops'],
 'roundel':['a roundel','three roundels'],
 'annulet':['an annulet','three annulets'],
 'crosslet':['a cross crosslet','three crosses crosslet']
};
export function parseBlazon(value) {
  if(typeof value!=='string'||value.length>500)return {ok:false,error:'Please enter a concise blazon (500 characters or less).'};
  let remaining=value.trim().replace(/\s+/g,' ').replace(/\.\s*$/,'').toLowerCase();
  if(!remaining)return {ok:false,error:'Enter a blazon. Start with a field tincture such as Azure.'};
  const d={...DEFAULT_DESIGN,division:'none',ordinary:'none',charge:'none',count:1};
  let fieldMatch=remaining.match(new RegExp('^(per pale|per fess|per bend|quarterly) ('+tincture+') and ('+tincture+')(?:,\\s*|$)','i'));
  if(fieldMatch){
    d.division=fieldMatch[1]==='quarterly'?'quarterly':fieldMatch[1].replace(' ','-');
    d.field=fieldMatch[2];d.secondary=fieldMatch[3];
    remaining=remaining.slice(fieldMatch[0].length).trim();
  } else {
    fieldMatch=remaining.match(new RegExp('^('+tincture+')(?:,\\s*|$)','i'));
    if(!fieldMatch)return {ok:false,error:'Start with the field: for example, Azure, a fess Or. Or try Per pale Argent and Gules.'};
    d.field=fieldMatch[1];
    remaining=remaining.slice(fieldMatch[0].length).trim();
  }
  if(remaining){
    const match=remaining.match(new RegExp('^(on a |a )(bend sinister|fess|pale|bend|chief|chevron|cross|saltire|bordure) ('+tincture+')(?: (.*))?$','i'));
    if(match){
      d.ordinary=ORDINARY_NAMES[match[2]];
      d.ordinaryTincture=match[3];
      remaining=(match[4]||'').trim();
      if(match[1]==='on a '&&!remaining)return {ok:false,error:'After “on a”, describe the supported charge placed on the ordinary, such as three mullets Gules.'};
      if(match[1]==='a '&&remaining)return {ok:false,error:remaining.startsWith('between ')?'“Between” places charges beside an ordinary, not on it. This introductory decoder does not yet support that arrangement; do not replace “between” with “on”.':'This decoder cannot represent the additional construction after the ordinary. It supports charges placed directly on an ordinary only when specified with “on a”.'};
    }
  }
  if(remaining){
    if(/^overall\s+/.test(remaining))return {ok:false,error:'“Overall” means a charge lies over another part of the design. This decoder cannot represent superimposition; omit “overall” only when it is not part of the actual blazon.'};
    let found=false;
    for(const [charge,phrases] of Object.entries(CHARGE_NAMES)){
      for(let i=0;i<phrases.length;i++){
        const phrase=phrases[i];
        const re=new RegExp('^'+phrase.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')+' ('+tincture+')$','i');
        const match=remaining.match(re);
        if(match){d.charge=charge;d.count=i===0?1:3;d.chargeTincture=match[1];found=true;break;}
      }
      if(found)break;
    }
    if(!found)return {ok:false,error:'That form is outside this teaching decoder. Try a plain field, a simple ordinary, or one/three supported charges. See the examples below.'};
  }
  const design=normalizeDesign(d);
  return {ok:true,design,canonical:blazon(design),note:'This parser recognizes a small introductory subset of English-language blazon. It cannot interpret arbitrary historic blazons or determine legal validity.'};
}
