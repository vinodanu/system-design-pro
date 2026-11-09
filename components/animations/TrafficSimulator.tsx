"use client";
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
const labels = ['Server A', 'Server B', 'Server C', 'Server D'];
export default function TrafficSimulator() {
  const [count, setCount] = useState(3);
  const [requests, setRequests] = useState<number[]>([]);
  const [next, setNext] = useState(0);
  const distribution = useMemo(() => Array.from({ length: count }, (_, i) => requests.filter(s => s === i).length), [count, requests]);
  const addRequest = () => { setRequests(previous => [...previous, next % count]); setNext(n => n + 1); };
  const changeServers = (n: number) => { setCount(n); setRequests([]); setNext(0); };
  return <section className="my-8 rounded-2xl border border-slate-700 bg-slate-900 p-5 not-prose" aria-label="Round-robin load balancing simulator">
    <h3 className="text-xl font-semibold">Round-robin request router</h3>
    <p className="my-3 text-sm text-slate-300">Each new request moves to the next healthy server. Change server count to reset the experiment.</p>
    <div className="mb-5 flex flex-wrap gap-3"><button onClick={addRequest} className="rounded-lg bg-teal-300 px-4 py-2 font-bold text-slate-950">Send request</button><button onClick={() => {setRequests([]); setNext(0);}} className="rounded-lg border border-slate-500 px-4 py-2">Reset</button><label className="flex items-center gap-2 text-sm">Servers <select value={count} onChange={e => changeServers(Number(e.target.value))} className="rounded-md bg-slate-800 p-2">{[2,3,4].map(n=><option key={n} value={n}>{n}</option>)}</select></label></div>
    <div className="grid gap-3 sm:grid-cols-2">{labels.slice(0,count).map((label,i) => <div key={label} className="rounded-xl border border-slate-600 p-4"><div className="flex justify-between"><span>{label}</span><strong>{distribution[i]} requests</strong></div><div className="mt-3 h-3 rounded-full bg-slate-700"><motion.div animate={{width: (requests.length ? (distribution[i]/requests.length)*100 : 0)+'%'}} className="h-full rounded-full bg-teal-400" /></div></div>)}</div>
    <div className="mt-4 flex flex-wrap gap-2"><AnimatePresence>{requests.slice(-16).map((server,idx) => <motion.span key={requests.length-16+idx} initial={{scale:0}} animate={{scale:1}} exit={{opacity:0}} className="rounded-full bg-sky-900 px-3 py-1 text-xs">{labels[server]}</motion.span>)}</AnimatePresence></div>
  </section>;
}
