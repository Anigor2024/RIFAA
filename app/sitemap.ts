import type {MetadataRoute} from 'next';
import {properties,projects,neighborhoods} from '@/lib/atheeldar-data';
export default function sitemap():MetadataRoute.Sitemap{
 const base='https://atheeldar.vercel.app';
 const routes=['','/properties','/projects','/neighborhoods','/home-finder','/tools','/about','/contact','/trust','/briefs',...properties.map(p=>`/properties/${p.slug}`),...projects.map(p=>`/projects/${p.slug}`),...neighborhoods.map(p=>`/neighborhoods/${p.slug}`)];
 return routes.map(path=>({url:base+path,changeFrequency:'weekly',priority:path===''?1:path.split('/').length<3?.8:.6}));
}
