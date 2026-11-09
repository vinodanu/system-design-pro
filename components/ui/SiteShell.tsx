"use client";
import Link from "next/link";
import {useState} from "react";

type Entry={slug:string[];title:string};
export default function SiteShell({lessons,children}:{lessons:Entry[],children:React.ReactNode}){
 const groups=Array.from(new Set(lessons.map(x=>x.slug[0])));
 const [filter,setFilter]=useState("");const [mobile,setMobile]=useState(false);
 const name=(s:string)=>s.replace(/^\d+-/,"").split("-").map(w=>w[0]?.toUpperCase()+w.slice(1)).join(" ");
 const filtered=lessons.filter(l=>l.title.toLowerCase().includes(filter.toLowerCase())||l.slug.join(" ").includes(filter.toLowerCase()));
 return <div className="site-frame">
 <header className="topbar"><Link className="brand" href="/"><span className="brand-icon">▱</span><span><strong>System Design Pro</strong><small>Learn • Visualize • Build</small></span></Link>
 <nav className="top-links"><Link href="/">▣ Learn</Link><Link href="/#curriculum">♧ Roadmap</Link><Link href="/#curriculum">ϟ Practice</Link></nav>
 <div className="header-search"><span>⌕</span><input aria-label="Search lessons" placeholder="Search concepts, e.g. Kafka, Caching…" value={filter} onChange={e=>setFilter(e.target.value)}/>{filter&&<div className="search-results">{filtered.slice(0,8).map(l=><Link onClick={()=>setFilter("")} key={l.slug.join('/')} href={'/'+l.slug.join('/')+'/'}>{l.title}</Link>)}{filtered.length===0&&<span>No lessons found</span>}</div>}</div>
 <a className="github-icon" aria-label="GitHub" href="https://github.com" target="_blank" rel="noreferrer">◎</a><button className="mobile-menu" onClick={()=>setMobile(!mobile)} aria-label="Toggle lesson navigation">☰</button>
 </header>
 <aside className={'sidebar '+(mobile?'sidebar-open':'')}><div className="sidebar-head"><strong>System Design ({lessons.length} Lessons)</strong><p>Learn from the foundations</p><div className="progress-track"><span style={{width:'5%'}}/></div></div><nav className="sidebar-nav" aria-label="Curriculum">{groups.map((g,i)=><details open={i<2} key={g}><summary><span className="module-icon">{['◎','▣','▤','▥','⇵','⚑','◈','⚙','⌘','✧'][i%10]}</span>{String(i+1).padStart(2,'0')}. {name(g)}</summary><div className="lesson-links">{lessons.filter(l=>l.slug[0]===g).map((l,j)=><Link onClick={()=>setMobile(false)} href={'/'+l.slug.join('/')+'/'} key={l.slug.join('/')}><span className="lesson-bullet">◌</span>{l.title}</Link>)}</div></details>)}</nav><div className="sidebar-foot">✦ Open source • Made for builders</div></aside>
 <div className="main-content">{children}</div>
 </div>
}
