import type { Metadata } from 'next';
export const SITE = 'https://microduck.intemotech.com';
export function pageMetadata(path:string,title:string,description:string,en=false):Metadata {
 const languages = path === '/downloads' || path === '/en/downloads' ? {'zh-Hant':SITE+'/downloads',en:SITE+'/en/downloads','x-default':SITE+'/downloads'} : undefined;
 return {title,description,alternates:{canonical:SITE+path,languages},openGraph:{type:'website',siteName:'小鴨製造所 · Open Duck Build Notes',title,description,url:SITE+path,locale:en?'en_US':'zh_TW',images:[{url:SITE+'/assets/shin-v2.png',width:2210,height:1190,alt:'Open Duck Mini v2 experimental one-piece shin CAD'}]},twitter:{card:'summary_large_image',title,description,images:[SITE+'/assets/shin-v2.png']}};
}
