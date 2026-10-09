/** @type {Record<string,{name:string,value:string,kind:string,meaning:string}>} */
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

/** @returns {{field:string,secondary:string,division:string,ordinary:string,ordinaryTincture:string,charge:string,chargeTincture:string,count:number}} */
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

// Bounds of the complete outlined artwork, including its stroke. Every charge
// is centered on its visible bounds and `size` is its longest visible dimension.
// Keep these measurements in step with any edits to the source artwork below.
const CHARGE_BOUNDS = {
  mullet: {cy:-2.195,extent:44.8398},
  fleur: {cy:-6.5,extent:60.0999},
  martlet: {cy:-5.3444,extent:53.0998},
  rose: {cy:-1,extent:47.9},
  escallop: {cy:0,extent:53.1},
  roundel: {cy:0,extent:43.1},
  annulet: {cy:0,extent:47},
  crosslet: {cy:0,extent:45.1}
};

export function chargeSVG(kind,color,x,y,size=40,monochrome=false,uid='') {
  const fill=monochrome?'url(#hatch-'+uid+'-'+color+')':(TINCTURES[color]?.value || TINCTURES.or.value);
  let shape="";
  const outline='stroke="#1b2d32" stroke-width="1.1" stroke-linejoin="round"';
  switch(kind){
    case "mullet": shape='<polygon points="'+starPoints(23,9.4)+'" />';break;
    case "fleur": shape='<path d="M0 23C-6 17-8 10-8 6c-9 7-19 1-18-8 1-9 11-11 16-5-2-12 3-21 10-29 7 8 12 17 10 29 5-6 15-4 16 5 1 9-9 15-18 8 0 4-2 11-8 17zm-19-13h38v6h-38z" />';break;
    case "martlet":shape='<g transform="scale(-1 1)"><path d="M-25 6Q-16-6-3-15Q-4-24 3-27Q12-30 15-20L26-18 14-13Q13-3 3 3L0 9 11 17-5 14-13 7Q-21 13-26 10L-17 1Z" /><path d="M-16 4Q-5-10 6-12Q2-1-9 7" fill="none" stroke="#1b2d32" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="-19" r="1.7" fill="#1b2d32" stroke="none"/></g>';break;
    case "rose":shape='<g><circle cx="0" cy="-13" r="11"/><circle cx="12.4" cy="-4" r="11"/><circle cx="7.7" cy="11" r="11"/><circle cx="-7.7" cy="11" r="11"/><circle cx="-12.4" cy="-4" r="11"/><circle cx="0" cy="0" r="6.4" fill="#ddb45f"/></g>';break;
    case "escallop":shape='<path d="M0-25Q8-22 13-11Q21-18 26-5Q17 4 10 18L0 25-10 18Q-17 4-26-5Q-21-18-13-11Q-8-22 0-25Z"/><path d="M0-23V20M-12-11L-2 21M12-11L2 21M-21-3L-6 20M21-3L6 20" fill="none" stroke="#1b2d32" stroke-width="1.4"/>';break;
    case "roundel":shape='<circle r="21" />';break;
    case "annulet":shape='<circle r="19" fill="none" stroke="'+fill+'" stroke-width="9"/>';break;
    case "crosslet":shape='<path d="M-7-22h14v15h15V7H7v15H-7V7h-15V-7h15Z" />';break;
    default: return "";
  }
  const bounds=CHARGE_BOUNDS[kind];
  return '<g data-charge="'+kind+'" transform="translate('+x+' '+y+') scale('+(size/bounds.extent).toFixed(6)+')" fill="'+fill+'" '+outline+'><g transform="translate(0 '+(-bounds.cy)+')">'+shape+'</g></g>';
}

const DIAGONAL = {x:75,y:84.5,slope:1.2,width:36};
const CHEVRON = {x:75,top:44,bottom:84,slope:67/81};
const diagonalX = y => DIAGONAL.x+(y-DIAGONAL.y)/DIAGONAL.slope;

// Derive the bands and their charge positions from the same center line.
function diagonalBand(reverse=false) {
  const half=DIAGONAL.width*Math.hypot(1,DIAGONAL.slope)/(2*DIAGONAL.slope);
  const points=[[diagonalX(0)-half,0],[diagonalX(0)+half,0],[diagonalX(174)+half,174],[diagonalX(174)-half,174]];
  return points.map(([x,y])=>[(reverse?150-x:x).toFixed(4),y].join(',')).join(' ');
}

export function chargePlacements(input={}) {
  const d=normalizeDesign(input);
  const middle=(CHEVRON.top+CHEVRON.bottom)/2;
  const diagonal=(reverse=false)=>[46.5,84.5,122.5].map(y=>[reverse?150-diagonalX(y):diagonalX(y),y,24]);
  if(d.count===1){
    const singles={
      fess:[75,84.5,32],pale:[75,84.5,26],bend:[75,84.5,24],
      'bend-sinister':[75,84.5,24],chief:[75,25,30],chevron:[75,middle,21],
      cross:[75,84,40],saltire:[75,84.5,40],bordure:[75,13.75,10]
    };
    return [singles[d.ordinary]||[75,85,50]];
  }
  switch(d.ordinary){
    case 'fess':return [[43,84.5,29],[75,84.5,29],[107,84.5,29]];
    case 'chief':return [[43,25,26],[75,25,26],[107,25,26]];
    case 'cross':return [[43,84,29],[75,84,29],[107,84,29]];
    case 'pale':return [[75,36,26],[75,83,26],[75,126,26]];
    case 'bend':case 'saltire':return diagonal();
    case 'bend-sinister':return diagonal(true);
    case 'chevron':return [39,75,111].map(x=>[x,middle+Math.abs(x-CHEVRON.x)*CHEVRON.slope,21]);
    case 'bordure':return [[75,13.75,10],[18,72,10],[132,72,10]];
    default:return [[47,46,33],[103,46,33],[75,112,33]];
  }
}

function hatchDefs(uid) {
  const strokes = {
    or: '<circle cx="2" cy="2" r="1.05" fill="#1b262c"/>',
    argent: '',
    gules: '<path d="M4 0V8" stroke="#1b262c" stroke-width="1.3"/>',
    azure: '<path d="M0 4H8" stroke="#1b262c" stroke-width="1.3"/>',
    sable: '<path d="M4 0V8M0 4H8" stroke="#1b262c" stroke-width="1.1"/>',
    vert: '<path d="M-8 0L0 8M0 0L8 8M8 0L16 8" stroke="#1b262c" stroke-width="1.3"/>',
    purpure: '<path d="M-8 8L0 0M0 8L8 0M8 8L16 0" stroke="#1b262c" stroke-width="1.3"/>'
  };
  return Object.entries(strokes).map(([name,art])=>'<pattern id="hatch-'+uid+'-'+name+'" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" fill="#fffdf8"/>'+art+'</pattern>').join('');
}

export function armsSVG(input={},identifier="heraldic-study",monochrome=false) {
  const d=normalizeDesign(input);
  const uid=(""+identifier).replace(/[^a-zA-Z0-9_-]/g,"-");
  const id="clip-"+uid;
  const p="M75 6 C96 7 117 8 139 6 L139 83 C138 121 116 147 75 165 C34 147 12 121 11 83 L11 6 C33 8 54 7 75 6Z";
  const col=t=>monochrome?'url(#hatch-'+uid+'-'+t+')':TINCTURES[t].value;
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
  if(d.ordinary==="bend") ordinary='<polygon points="'+diagonalBand()+'" fill="'+t+'"/>';
  if(d.ordinary==="bend-sinister") ordinary='<polygon points="'+diagonalBand(true)+'" fill="'+t+'"/>';
  if(d.ordinary==="chief") ordinary='<rect x="0" y="0" width="150" height="43" fill="'+t+'"/>';
  if(d.ordinary==="chevron") ordinary='<polygon points="-6,'+(CHEVRON.bottom+67)+' -6,'+(CHEVRON.top+67)+' 75,'+CHEVRON.top+' 156,'+(CHEVRON.top+67)+' 156,'+(CHEVRON.bottom+67)+' 75,'+CHEVRON.bottom+'" fill="'+t+'"/>';
  if(d.ordinary==="cross") ordinary='<path d="M58 0H92V66H150V102H92V172H58V102H0V66H58Z" fill="'+t+'"/>';
  if(d.ordinary==="saltire") ordinary='<polygon points="'+diagonalBand()+'" fill="'+t+'"/><polygon points="'+diagonalBand(true)+'" fill="'+t+'"/>';
  if(d.ordinary==="bordure") ordinary='<path d="'+p+'" fill="none" stroke="'+t+'" stroke-width="28"/>';
  let charge="";
  if(d.charge!=="none"){
    charge=chargePlacements(d).map(c=>chargeSVG(d.charge,d.chargeTincture,c[0],c[1],c[2],monochrome,uid)).join("");
  }
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 174" role="img" aria-label="'+blazon(d).replace(/"/g,"&quot;")+'"><defs><clipPath id="'+id+'"><path d="'+p+'"/></clipPath>'+(monochrome?hatchDefs(uid):'')+'</defs><g '+clip+'>'+ground+ordinary+charge+'</g><path d="'+p+'" fill="none" stroke="#172c33" stroke-width="3.3" stroke-linejoin="round"/></svg>';
  return svg;
}

export function blazon(input={}) {
  const d=normalizeDesign(input);
  const word=t=>TINCTURES[t].name;
  const divisions={"per-pale":"Per pale","per-fess":"Per fess","per-bend":"Per bend",quarterly:"Quarterly"};
  const ordinaries={fess:"fess",pale:"pale",bend:"bend","bend-sinister":"bend sinister",chief:"chief",chevron:"chevron",cross:"cross",saltire:"saltire",bordure:"bordure"};
  const charges={mullet:["mullet","mullets"],fleur:["fleur-de-lis","fleurs-de-lis"],martlet:["martlet","martlets"],rose:["rose","roses"],escallop:["escallop","escallops"],roundel:["roundel","roundels"],annulet:["annulet","annulets"],crosslet:["cross crosslet","crosses crosslet"]};
  const field=d.division==="none"?word(d.field):divisions[d.division]+" "+word(d.field)+" and "+word(d.secondary);
  const chargeText=d.charge==="none"?"":(d.count===1?(/^[aeiou]/i.test(charges[d.charge][0])?"an ":"a ")+charges[d.charge][0]:"three "+charges[d.charge][1])+" "+word(d.chargeTincture);
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
