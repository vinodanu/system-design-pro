import type { Metadata } from 'next';
import './globals.css';
import {getLessonPaths} from '@/lib/content';
import SiteShell from '@/components/ui/SiteShell';
export const metadata:Metadata={title:{default:'System Design Pro',template:'%s | System Design Pro'},description:'System design explained visually with interactive simulations and Java examples.'};
function title(s:string){return s.replace(/^\d+-/,'').split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')}
export default function RootLayout({children}:{children:React.ReactNode}){
 const lessons=getLessonPaths().map(slug=>({slug,title:title(slug[slug.length-1])}));
 return <html lang="en"><body><SiteShell lessons={lessons}>{children}</SiteShell></body></html>;
}
