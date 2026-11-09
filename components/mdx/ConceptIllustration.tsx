import {featuredConcepts} from './ConceptHero';
const repo=process.env.GITHUB_REPOSITORY?.split('/')[1]??'';
const basePath=process.env.GITHUB_PAGES==='true'&&repo&&!repo.endsWith('.github.io')?`/${repo}`:'';
export default function ConceptIllustration({topic,caption}:{topic:string,caption:string}){
 if(!/^[a-z0-9-]+$/.test(topic))return null;
 const featured=featuredConcepts.has(topic);
 const src=featured ? `${basePath}/concept-art/${topic}.png` : `${basePath}/illustrations/${topic}.svg`;
 return <figure className={`concept-figure ${featured?'concept-art-figure':''}`}><img src={src} alt={`${caption}: visual overview`} width={featured?1648:1080} height={featured?928:510} loading="lazy"/><figcaption>{caption} · Concept visualization</figcaption></figure>;
}
