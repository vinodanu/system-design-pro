import type {Metadata} from 'next';
import Link from 'next/link';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {getLesson,getLessonPaths} from '@/lib/content';
import ConsistentHashingAnim from '@/components/animations/ConsistentHashingAnim';
import TrafficSimulator from '@/components/animations/TrafficSimulator';
import ConceptLab from '@/components/animations/ConceptLab';
import ConceptIllustration from '@/components/mdx/ConceptIllustration';
import ConceptHero from '@/components/mdx/ConceptHero';
import conceptData from '@/components/animations/conceptData.json';
export const dynamicParams=false;
export function generateStaticParams(){return getLessonPaths().map(slug=>({slug}))}
type Props={params:Promise<{slug:string[]}>};
const nice=(s:string)=>s.replace(/^\d+-/,'').split('-').map(w=>w[0]?.toUpperCase()+w.slice(1)).join(' ');
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;return {title:nice(slug.at(-1)??'Lesson')}}
export default async function LessonPage({params}:Props){const {slug}=await params;const source=getLesson(slug);if(!source)return <main>Lesson not found</main>;
 const key=slug.at(-1)! as keyof typeof conceptData;const info=conceptData[key];const title=nice(key);const all=getLessonPaths();const index=all.findIndex(p=>p.join('/')===slug.join('/'));const prev=all[index-1];const next=all[index+1];
 // Keep MDX as a content source; the shared dashboard owns the visual/interactive cards.
 const cleaned=source.replace(/^# .+\n/,'').replace(/\n## Visual explanation[\s\S]*$/,'').replace(/<ConsistentHashingAnim \/>/g,'').replace(/<TrafficSimulator \/>/g,'');
 return <div className="lesson-view"><div className="lesson-toolbar"><div className="breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/#curriculum">{nice(slug[0])}</Link><span>›</span><strong>{title}</strong></div><div className="lesson-tools"><button type="button" className="tool-pill" disabled>☆ Bookmark</button>{prev&&<Link className="tool-pill" href={'/'+prev.join('/')+'/'}>‹ Previous</Link>}{next&&<Link className="tool-pill action" href={'/'+next.join('/')+'/'}>Next ›</Link>}</div></div>
 <section className="lesson-intro"><div><span className="eyebrow">INTERACTIVE SYSTEM DESIGN • {nice(slug[0]).toUpperCase()}</span><h1>{title}</h1><p>{info?.description??'Explore the architecture and learn by experimenting.'}</p><div className="topic-pills"><span>{nice(slug[0])}</span><span>Distributed Systems</span><span>Interactive lesson</span></div></div><div className="intro-art"><ConceptHero topic={key} title={title}/></div></section>
 <div className="lesson-dashboard"><section className="panel overview-panel"><h2>◈ Visual Overview</h2><ConceptIllustration topic={key} caption={info?.example??title}/><div className="info-note">ⓘ Follow the arrows to see how the components communicate.</div></section><section className="panel simulator-panel"><h2>🎮 Try It Yourself: {title}</h2>{key==='consistent-hashing'?<ConsistentHashingAnim/>:key==='load-balancer-algorithms'?<><TrafficSimulator/><ConceptLab topic={key}/></>:<ConceptLab topic={key}/>}</section></div>
 <div className="quick-grid"><section className="panel"><h2>▦ Real-World Example: {info?.example??title}</h2><p>{info?.description}</p><div className="explain-flow">{info?.nodes.map((n,i)=><span key={n}>{i>0?'→ ':''}{n}</span>)}</div></section><section className="panel"><h2>⌘ Java / Spring Boot: Production Perspective</h2><p>{info?.engineering}</p><div className="code-hint"><span>JAVA ENGINEERING NOTE</span><code>Design for failures · Observe latency · Test under load</code></div></section></div>
 <div className="quick-grid triple"><section className="panel"><h2>⚖ Tradeoffs & Considerations</h2><p>Think about performance, availability, complexity, and operational costs before choosing an approach.</p></section><section className="panel"><h2>⚙ When to Use?</h2><p>{info?.example}. Consider the system's scale, data access patterns, and failure modes.</p></section><section className="panel"><h2>💡 Key Takeaways</h2><p>{info?.steps[0]}</p><p>{info?.steps.at(-1)}</p></section></div>
 <section className="lesson-reading"><div className="reading-header"><span>📖 DEEP DIVE</span><h2>Understand the implementation</h2><p>Work through the details, Java examples, production pitfalls and interview checkpoints.</p></div><article className="prose"><MDXRemote source={cleaned} components={{ConsistentHashingAnim,TrafficSimulator,ConceptLab,ConceptIllustration}} /></article></section>
 <div className="lesson-bottom-nav">{prev&&<Link href={'/'+prev.join('/')+'/'}>← {nice(prev.at(-1)!)}</Link>}{next&&<Link href={'/'+next.join('/')+'/'}>{nice(next.at(-1)!)} →</Link>}</div>
 </div>
}
