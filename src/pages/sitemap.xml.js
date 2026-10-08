import {getCollection} from 'astro:content';
import lessons from '../data/course.json';
export async function GET() {
  const base='https://heraldry.jameshoward.us';
  const traditions=await getCollection('traditions');
  const seminars=await getCollection('seminars');
  const paths=['/','/academy/','/atelier/','/decoder/','/tinctures/','/armorial/','/lexicon/','/field-guide/','/practice/','/resources/','/traditions/','/source-atlas/','/translation-lab/','/seminars/','/about/',...lessons.map(x=>'/academy/'+x.slug+'/'),...lessons.map(x=>'/lecture/'+x.slug+'/'),...traditions.map(x=>'/traditions/'+x.id+'/'),...seminars.map(x=>'/seminars/'+x.id+'/')];
  const xml='<?xml version="1.0" encoding="UTF-8"?>'+'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(x=>'<url><loc>'+base+x+'</loc></url>').join('')+'</urlset>';
  return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
