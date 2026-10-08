export const TINCTURES = {
  "or": {
    "name": "Or",
    "value": "#ddb45f",
    "kind": "metal",
    "meaning": "gold"
  },
  "argent": {
    "name": "Argent",
    "value": "#f8f5ee",
    "kind": "metal",
    "meaning": "silver"
  },
  "gules": {
    "name": "Gules",
    "value": "#b7443d",
    "kind": "colour",
    "meaning": "red"
  },
  "azure": {
    "name": "Azure",
    "value": "#285783",
    "kind": "colour",
    "meaning": "blue"
  },
  "sable": {
    "name": "Sable",
    "value": "#1f2a30",
    "kind": "colour",
    "meaning": "black"
  },
  "vert": {
    "name": "Vert",
    "value": "#337557",
    "kind": "colour",
    "meaning": "green"
  },
  "purpure": {
    "name": "Purpure",
    "value": "#7b5480",
    "kind": "colour",
    "meaning": "purple"
  }
};

export const DEFAULT_DESIGN = {
  "field": "azure",
  "secondary": "or",
  "division": "none",
  "ordinary": "fess",
  "ordinaryTincture": "or",
  "charge": "mullet",
  "chargeTincture": "gules",
  "count": 3
};

export const FIELD_VALUES = [
  "or",
  "argent",
  "gules",
  "azure",
  "sable",
  "vert",
  "purpure"
];

export const DIVISIONS = [
  "none",
  "per-pale",
  "per-fess",
  "per-bend",
  "quarterly"
];

export const ORDINARIES = [
  "none",
  "fess",
  "pale",
  "bend",
  "bend-sinister",
  "chief",
  "chevron",
  "cross",
  "saltire",
  "bordure"
];

export const CHARGES = [
  "none",
  "mullet",
  "fleur",
  "martlet",
  "rose",
  "escallop",
  "roundel",
  "annulet",
  "crosslet"
];

export function normalizeDesign(spec={}) {
  const normalized={};
  for (const [key,values,fallback] of [
    ["field",FIELD_VALUES,DEFAULT_DESIGN.field],
    ["secondary",FIELD_VALUES,DEFAULT_DESIGN.secondary],
    ["division",DIVISIONS,DEFAULT_DESIGN.division],
    ["ordinary",ORDINARIES,DEFAULT_DESIGN.ordinary],
    ["ordinaryTincture",FIELD_VALUES,DEFAULT_DESIGN.ordinaryTincture],
    ["charge",CHARGES,DEFAULT_DESIGN.charge],
    ["chargeTincture",FIELD_VALUES,DEFAULT_DESIGN.chargeTincture]
  ]) normalized[key]=values.includes(spec[key]) ? spec[key] : fallback;
  normalized.count=Number(spec.count)===1 ? 1 : 3;
  return normalized;
}

export function starPoints(outer=23,inner=10,n=5) {
  const points=[];
  for (let i=0;i<n*2;i++){
    const a=-Math.PI/2+i*Math.PI/n;
    const r=i%2 ? inner:outer;
    points.push((Math.cos(a)*r).toFixed(2)+","+(Math.sin(a)*r).toFixed(2));
  }
  return points.join(" ");
}

export function chargeSVG(kind,color,x,y,size=40) {
  const fill=TINCTURES[color]?.value || TINCTURES.or.value;
  let shape="";
  const outline='stroke="#1b2d32" stroke-width="1.1" stroke-linejoin="round"';
  switch(kind){
    case "mullet": shape='<polygon points="'+starPoints(23,9.4)+'" />';break;
    case "fleur": shape='<path d="M0 23C-6 17-8 10-8 6c-9 7-19 1-18-8 1-9 11-11 16-5-2-12 3-21 10-29 7 8 12 17 10 29 5-6 15-4 16 5 1 9-9 15-18 8 0 4-2 11-8 17zm-19-13h38v6h-38z" />';break;
    case "martlet":shape='<path d="M-25 6Q-16-6-3-15Q-4-24 3-27Q12-30 15-20L26-18 14-13Q13-3 3 3L0 9 11 17-5 14-13 7Q-21 13-26 10L-17 1Z" /><circle cx="9" cy="-19" r="2" fill="#f8f5ee" stroke="none"/>';break;
    case "rose":shape='<g><circle cx="0" cy="-13" r="11"/><circle cx="12.4" cy="-4" r="11"/><circle cx="7.7" cy="11" r="11"/><circle cx="-7.7" cy="11" r="11"/><circle cx="-12.4" cy="-4" r="11"/><circle cx="0" cy="0" r="6.4" fill="#ddb45f"/></g>';break;
    case "escallop":shape='<path d="M0-25Q8-22 13-11Q21-18 26-5Q17 4 10 18L0 25-10 18Q-17 4-26-5Q-21-18-13-11Q-8-22 0-25Z"/><path d="M0-23V20M-12-11L-2 21M12-11L2 21M-21-3L-6 20M21-3L6 20" fill="none" stroke="#1b2d32" stroke-width="1.4"/>';break;
    case "roundel":shape='<circle r="21" />';break;
    case "annulet":shape='<circle r="19" fill="none" stroke="'+fill+'" stroke-width="9"/>';break;
    case "crosslet":shape='<path d="M-7-22h14v15h15V7H7v15H-7V7h-15V-7h15Z" />';break;
    default: return "";
  }
  return '<g transform="translate('+x+' '+y+') scale('+(size/48).toFixed(4)+')" fill="'+fill+'" '+outline+'>'+shape+'</g>';
}

export function armsSVG(input={},identifier="heraldic-study") {
  const d=normalizeDesign(input);
  const uid=(""+identifier).replace(/[^a-zA-Z0-9_-]/g,"-");
  const id="clip-"+uid;
  const p="M75 6 C96 7 117 8 139 6 L139 83 C138 121 116 147 75 165 C34 147 12 121 11 83 L11 6 C33 8 54 7 75 6Z";
  const col=t=>TINCTURES[t].value;
  const clip='clip-path="url(#'+id+')"';
  let ground='<path d="'+p+'" fill="'+col(d.field)+'"/>';
  if(d.division==="per-pale") ground+='<rect x="75" width="75" height="172" fill="'+col(d.secondary)+'"/>';
  if(d.division==="per-fess") ground+='<rect x="0" y="80" width="150" height="92" fill="'+col(d.secondary)+'"/>';
  if(d.division==="per-bend") ground+='<polygon points="0,0 150,0 150,172" fill="'+col(d.secondary)+'"/>';
  if(d.division==="quarterly") ground+='<rect x="75" y="0" width="75" height="86" fill="'+col(d.secondary)+'"/><rect x="0" y="86" width="75" height="86" fill="'+col(d.secondary)+'"/>';
  const t=col(d.ordinaryTincture);
  let ordinary="";
  if(d.ordinary==="fess") ordinary='<rect x="0" y="67" width="150" height="35" fill="'+t+'"/>';
  if(d.ordinary==="pale") ordinary='<rect x="59" y="0" width="32" height="172" fill="'+t+'"/>';
  if(d.ordinary==="bend") ordinary='<polygon points="-12,0 24,0 162,172 124,172" fill="'+t+'"/>';
  if(d.ordinary==="bend-sinister") ordinary='<polygon points="126,0 162,0 24,172 -12,172" fill="'+t+'"/>';
  if(d.ordinary==="chief") ordinary='<rect x="0" y="0" width="150" height="43" fill="'+t+'"/>';
  if(d.ordinary==="chevron") ordinary='<polygon points="-6,125 -6,91 75,24 156,91 156,125 75,59" fill="'+t+'"/>';
  if(d.ordinary==="cross") ordinary='<path d="M58 0H92V66H150V102H92V172H58V102H0V66H58Z" fill="'+t+'"/>';
  if(d.ordinary==="saltire") ordinary='<path d="M-14 0H23L150 140V174H124L0 34V0ZM124 0H164L23 174H-14V140Z" fill="'+t+'"/>';
  if(d.ordinary==="bordure") ordinary='<path d="'+p+'" fill="none" stroke="'+t+'" stroke-width="28"/>';
  let charge="";
  if(d.charge!=="none"){
    let coordinates;
    if(d.count===1){
      coordinates=[[75,d.ordinary==="chief"?24:d.ordinary==="chevron"?59:85, d.ordinary==="chief"?35:50]];
    } else if(d.ordinary==="fess" || d.ordinary==="chief" || d.ordinary==="cross"){
      coordinates=[[43,d.ordinary==="chief"?23:84,29],[75,d.ordinary==="chief"?23:84,29],[107,d.ordinary==="chief"?23:84,29]];
    } else if(d.ordinary==="pale"){
      coordinates=[[75,36,31],[75,83,31],[75,126,31]];
    } else if(d.ordinary==="bend" || d.ordinary==="bend-sinister"){
      const reverse=d.ordinary==="bend-sinister";
      coordinates=[[reverse?113:37,37,30],[75,82,30],[reverse?37:113,126,30]];
    } else if(d.ordinary==="chevron"){
      coordinates=[[39,98,28],[75,53,28],[111,98,28]];
    } else {
      coordinates=[[75,43,33],[47,109,33],[103,109,33]];
    }
    charge=coordinates.map(c=>chargeSVG(d.charge,d.chargeTincture,c[0],c[1],c[2])).join("");
  }
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 174" role="img" aria-label="'+blazon(d).replace(/"/g,"&quot;")+'"><defs><clipPath id="'+id+'"><path d="'+p+'"/></clipPath></defs><g '+clip+'>'+ground+ordinary+charge+'</g><path d="'+p+'" fill="none" stroke="#172c33" stroke-width="3.3" stroke-linejoin="round"/></svg>';
  return svg;
}

export function blazon(input={}) {
  const d=normalizeDesign(input);
  const word=t=>TINCTURES[t].name;
  const divisions={"per-pale":"Per pale","per-fess":"Per fess","per-bend":"Per bend",quarterly:"Quarterly"};
  const ordinaries={fess:"fess",pale:"pale",bend:"bend","bend-sinister":"bend sinister",chief:"chief",chevron:"chevron",cross:"cross",saltire:"saltire",bordure:"bordure"};
  const charges={mullet:["mullet","mullets"],fleur:["fleur-de-lis","fleurs-de-lis"],martlet:["martlet","martlets"],rose:["rose","roses"],escallop:["escallop","escallops"],roundel:["roundel","roundels"],annulet:["annulet","annulets"],crosslet:["cross crosslet","crosses crosslet"]};
  const field=d.division==="none"?word(d.field):divisions[d.division]+" "+word(d.field)+" and "+word(d.secondary);
  const chargeText=d.charge==="none"?"":(d.count===1?"a "+charges[d.charge][0]:"three "+charges[d.charge][1])+" "+word(d.chargeTincture);
  if(d.ordinary==="none") return field+(chargeText?", "+(d.division==="none"?"":"overall ")+chargeText:"")+".";
  const ordinary="a "+ordinaries[d.ordinary]+" "+word(d.ordinaryTincture);
  return field+", "+(chargeText?"on "+ordinary+" "+chargeText:ordinary)+".";
}

export function assessDesign(input={}) {
  const d=normalizeDesign(input);
  const cautions=[];
  const isSameKind=(a,b)=>TINCTURES[a].kind===TINCTURES[b].kind;
  if(d.division==="none" && d.ordinary!=="none" && isSameKind(d.field,d.ordinaryTincture))
    cautions.push("The ordinary places "+TINCTURES[d.ordinaryTincture].kind+" on "+TINCTURES[d.field].kind+". This may conflict with the conventional rule of tincture.");
  const base=d.ordinary==="none"?d.field:d.ordinaryTincture;
  if(d.charge!=="none" && d.division==="none" && isSameKind(base,d.chargeTincture))
    cautions.push("The charge appears "+TINCTURES[d.chargeTincture].kind+" on "+TINCTURES[base].kind+". Consider stronger traditional contrast.");
  if(d.division!=="none") cautions.push("Divided fields require case-by-case reading. This simplified check does not evaluate every partition or counterchanging convention.");
  return {level:cautions.length?"caution":"good",messages:cautions.length?cautions:["No obvious colour-on-colour or metal-on-metal issue in this introductory check."],disclaimer:"Contrast is a design convention with exceptions—not a complete test of heraldic correctness, uniqueness, or legal entitlement."};
}

