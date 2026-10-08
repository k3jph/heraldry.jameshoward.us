import lessons from '../data/course.json';
export function GET() {
  const base='https://heraldry.jameshoward.us';
  const paths=['/','/academy/','/atelier/','/decoder/','/tinctures/','/armorial/','/lexicon/','/field-guide/','/practice/','/resources/','/about/',...lessons.map(x=>'/academy/'+x.slug+'/'),...lessons.map(x=>'/lecture/'+x.slug+'/')];
  const xml='<?xml version="1.0" encoding="UTF-8"?>'+'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(x=>'<url><loc>'+base+x+'</loc></url>').join('')+'</urlset>';
  return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
