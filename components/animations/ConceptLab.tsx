"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import data from "./conceptData.json";

type Topic = keyof typeof data;
export default function ConceptLab({ topic }: { topic: Topic }) {
  const concept = data[topic];
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  if (!concept) return <p>Simulation unavailable.</p>;
  const next = () => setStep(s => (s + 1) % concept.steps.length);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setStep(s => (s + 1) % concept.steps.length), 2200);
    return () => window.clearInterval(id);
  }, [running, concept.steps.length]);
  return (
    <section aria-label={`${topic} interactive simulation`} className="my-8 rounded-2xl border border-cyan-800/70 bg-slate-950 p-5 shadow-xl not-prose">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs uppercase tracking-widest text-cyan-300">Interactive concept lab</p><h3 className="mt-1 text-xl font-bold text-white">{concept.example}</h3></div>
        <span className="rounded-full bg-cyan-900/60 px-3 py-1 text-xs text-cyan-100">Step {step + 1} / {concept.steps.length}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{concept.description}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4" role="list" aria-label="Architecture stages">
        {concept.nodes.map((node, i) => (
          <motion.div role="listitem" key={node} animate={{ y: step === i ? -7 : 0, scale: step === i ? 1.035 : 1, borderColor: step === i ? '#22d3ee' : '#334155', backgroundColor: step === i ? '#164e63' : '#0f172a' }} transition={{ duration: 0.32 }} className="relative min-h-28 rounded-xl border-2 px-3 py-5 text-center text-slate-100">
            <span className="mb-2 block text-xs text-cyan-300">{String(i+1).padStart(2, '0')}</span><strong className="text-sm">{node}</strong>
            {step === i && <motion.div layoutId={`active-${topic}`} className="absolute inset-x-4 bottom-2 h-1 rounded bg-cyan-300" />}
          </motion.div>
        ))}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-valuemin={1} aria-valuemax={concept.steps.length} aria-valuenow={step+1}><motion.div className="h-full rounded-full bg-cyan-400" animate={{width: `${(step+1)*100/concept.steps.length}%`}} transition={{duration:.3}} /></div>
      <div className="mt-5 min-h-24 rounded-xl bg-slate-900 p-4" aria-live="polite">
        <AnimatePresence mode="wait"><motion.p key={step} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.2}} className="text-sm leading-7 text-white"><strong className="mr-2 text-cyan-300">What happens:</strong>{concept.steps[step]}</motion.p></AnimatePresence>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={next} className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Next step →</button>
        <button type="button" onClick={() => setStep(s => (s + concept.steps.length - 1) % concept.steps.length)} className="rounded-lg border border-slate-600 px-4 py-2 text-white hover:bg-slate-800">← Previous</button>
        <button type="button" onClick={() => {setStep(0);setRunning(false)}} className="rounded-lg border border-slate-600 px-4 py-2 text-white hover:bg-slate-800">Reset</button>
        <button type="button" aria-pressed={running} onClick={() => setRunning(r => !r)} className="rounded-lg border border-slate-600 px-4 py-2 text-white hover:bg-slate-800">{running ? 'Pause' : 'Autoplay'}</button>
      </div>
      <p className="mt-5 rounded-lg border-l-4 border-amber-400 bg-amber-950/30 p-3 text-sm leading-6 text-amber-100"><strong>Java / Spring Boot production note:</strong> {concept.engineering}</p>
    </section>
  );
}
