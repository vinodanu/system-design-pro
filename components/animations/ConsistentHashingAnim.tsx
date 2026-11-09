'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

const COLORS = ['#5eead4', '#93c5fd', '#c4b5fd', '#f9a8d4', '#fde68a', '#fdba74'];
const R = 125;
const CENTER = 175;
const KEY_COUNT = 30;

// Stable 32-bit hashing for the demo. Not a production routing algorithm.
function hash(input: string) {
  let h = 2166136261;
  for (const char of input) { h ^= char.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function angle(position: number) { return (position / 2 ** 32) * 360 - 90; }
function xy(position: number, radius = R) {
  const rad = angle(position) * Math.PI / 180;
  return { x: CENTER + Math.cos(rad) * radius, y: CENTER + Math.sin(rad) * radius };
}
function assign(key: number, servers: number[]) {
  const keyHash = hash(`key-${key}`);
  const sorted = servers.map(id => ({ id, position: hash(`server-${id}`) })).sort((a, b) => a.position - b.position);
  return (sorted.find(s => s.position >= keyHash) ?? sorted[0]).id;
}

export default function ConsistentHashingAnim() {
  const [servers, setServers] = useState([1, 2, 3]);
  const [previous, setPrevious] = useState<Record<number, number> | null>(null);
  const [showKeys, setShowKeys] = useState(true);
  const assignment = useMemo(() => Object.fromEntries(Array.from({length:KEY_COUNT}, (_,i) => [i + 1, assign(i + 1, servers)])), [servers]);
  const moved = useMemo(() => previous ? Array.from({length:KEY_COUNT}, (_,i) => i + 1).filter(k => previous[k] !== assignment[k]) : [], [assignment, previous]);
  function mutate(next: number[]) { setPrevious(assignment); setServers(next); }
  function add() { if (servers.length < 6) mutate([...servers, Math.max(...servers) + 1]); }
  function remove() { if (servers.length > 2) mutate(servers.slice(0, -1)); }
  const sorted = [...servers].sort((a,b) => hash(`server-${a}`) - hash(`server-${b}`));
  const changedKeys = new Set(moved);
  return <div className="not-prose my-9 rounded-3xl border border-slate-700 bg-[#101b2c] p-4 shadow-2xl md:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h3 className="text-xl font-bold text-white">Consistent hashing · live simulator</h3><p className="mt-1 text-sm text-slate-400">Key travels clockwise to the next server on the ring.</p></div>
      <span className="rounded-full bg-teal-950 px-3 py-2 text-sm text-teal-200" aria-live="polite">{moved.length} / {KEY_COUNT} keys remapped</span>
    </div>
    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_220px]">
      <svg viewBox="0 0 350 350" className="mx-auto w-full max-w-[480px]" role="img" aria-label={`${servers.length} servers, ${moved.length} of ${KEY_COUNT} keys changed ownership after last action`}>
        <circle cx={CENTER} cy={CENTER} r={R} fill="none" stroke="#50627d" strokeWidth="3" strokeDasharray="6 7" />
        <circle cx={CENTER} cy={CENTER} r={86} fill="#0b1322" stroke="#233348" />
        <text x={CENTER} y="162" fill="#f3f8ff" fontSize="25" textAnchor="middle" fontWeight="bold">{servers.length} servers</text>
        <text x={CENTER} y="182" fill="#9aaac1" fontSize="12" textAnchor="middle">{KEY_COUNT} hashed keys</text>
        <text x={CENTER} y="202" fill="#5eead4" fontSize="12" textAnchor="middle">↻ clockwise</text>
        {showKeys && Array.from({length:KEY_COUNT},(_,i) => i + 1).map(k => {
          const p = xy(hash(`key-${k}`), R);
          return <motion.circle key={`key-${k}`} cx={p.x} cy={p.y} r={changedKeys.has(k)?5:3} fill={changedKeys.has(k)?'#fb7185': COLORS[(assignment[k]-1)%COLORS.length]} stroke="#101b2c" strokeWidth="1" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.25}}><title>Key {k} → server {assignment[k]}{changedKeys.has(k)?' (remapped)':''}</title></motion.circle>;
        })}
        <AnimatePresence>{sorted.map(id => {
          const p = xy(hash(`server-${id}`), R);
          return <motion.g key={id} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.5}} transition={{type:'spring',stiffness:170,damping:15}} style={{transformOrigin:`${p.x}px ${p.y}px`}}>
            <circle cx={p.x} cy={p.y} r="17" fill={COLORS[(id-1)%COLORS.length]} stroke="#06111f" strokeWidth="3" />
            <text x={p.x} y={p.y + 5} fontSize="13" fontWeight="bold" textAnchor="middle" fill="#08101d">{id}</text>
          </motion.g>;
        })}</AnimatePresence>
      </svg>
      <div className="flex flex-col gap-3 lg:justify-center">
        <button className="rounded-xl bg-teal-300 px-4 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40" onClick={add} disabled={servers.length>=6}>+ Add Server</button>
        <button className="rounded-xl border border-slate-500 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40" onClick={remove} disabled={servers.length<=2}>− Remove Server</button>
        <button className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300" onClick={() => {setServers([1,2,3]);setPrevious(null)}}>Reset</button>
        <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={showKeys} onChange={e=>setShowKeys(e.target.checked)} /> Show keys</label>
        <p className="text-sm text-slate-400" aria-live="polite">{previous ? `${Math.round(moved.length / KEY_COUNT * 100)}% of keys changed ownership. Pink dots identify affected keys.` : 'Add or remove a server to inspect redistribution.'}</p>
        <div className="flex flex-wrap gap-2">{servers.map(id => <span key={id} className="rounded-lg border border-slate-700 px-2 py-1 text-xs" style={{color:COLORS[(id-1)%COLORS.length]}}>● S{id} · {Object.values(assignment).filter(owner=>owner===id).length} keys</span>)}</div>
      </div>
    </div>
    <p className="mt-3 text-xs leading-5 text-slate-500">Educational demo: one hash position per server, 30 sample keys. Production deployments usually use virtual nodes, replication and weighted placement; a stable hash alone does not guarantee availability or perfect balance.</p>
  </div>;
}
