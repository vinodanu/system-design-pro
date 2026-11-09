"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import data from "./conceptData.json";

type Topic = keyof typeof data;

export default function ConceptLab({ topic }: { topic: Topic }) {
    const concept = data[topic];

    const [step, setStep] = useState(0);
    const [running, setRunning] = useState(false);

    const steps = concept?.steps ?? [];
    const totalSteps = steps.length;

    useEffect(() => {
        setStep(0);
        setRunning(false);
    }, [topic]);

    useEffect(() => {
        if (!running || totalSteps === 0) return;

        const id = window.setInterval(() => {
            setStep((current) => (current + 1) % totalSteps);
        }, 2200);

        return () => window.clearInterval(id);
    }, [running, totalSteps]);

    if (!concept || totalSteps === 0) {
        return (
            <p className="my-6 text-sm text-slate-700">
                Simulation unavailable.
            </p>
        );
    }

    const next = () => {
        setStep((current) => (current + 1) % totalSteps);
    };

    const previous = () => {
        setStep((current) => (current + totalSteps - 1) % totalSteps);
    };

    const reset = () => {
        setStep(0);
        setRunning(false);
    };

    const toggleAutoplay = () => {
        setRunning((current) => !current);
    };

    const secondaryButtonClass =
        "rounded-lg border border-slate-300 bg-white px-4 py-2.5 " +
        "font-semibold text-slate-900 shadow-sm transition-colors " +
        "hover:border-cyan-500 hover:bg-cyan-50 " +
        "focus-visible:outline focus-visible:outline-2 " +
        "focus-visible:outline-offset-2 focus-visible:outline-cyan-600 " +
        "disabled:cursor-not-allowed disabled:bg-slate-100 " +
        "disabled:text-slate-500 disabled:opacity-100";

    return (
        <section
            aria-label={`${topic} interactive simulation`}
            className="concept-lab not-prose my-8 rounded-2xl border border-violet-200 bg-violet-50/70 p-5 text-slate-900 shadow-lg sm:p-6"
        >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-700">
                        Interactive Concept Lab
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-950">
                        {concept.example}
                    </h3>
                </div>

                <span className="rounded-full bg-cyan-700 px-3 py-1 text-xs font-semibold text-white">
          Step {step + 1} / {totalSteps}
        </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-6 text-slate-800">
                {concept.description}
            </p>

            {/* Architecture stages */}
            <div
                className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4"
                role="list"
                aria-label="Architecture stages"
            >
                {concept.nodes.map((node, index) => {
                    const isActive = step === index;

                    return (
                        <motion.div
                            role="listitem"
                            key={`${topic}-${index}-${node}`}
                            animate={{
                                y: isActive ? -5 : 0,
                                scale: isActive ? 1.025 : 1,
                                borderColor: isActive ? "#06b6d4" : "#475569",
                                backgroundColor: isActive ? "#155e75" : "#0f172a",
                            }}
                            transition={{ duration: 0.3 }}
                            className="relative flex min-h-28 flex-col items-center justify-center rounded-xl border-2 px-3 py-5 text-center shadow-sm"
                        >
              <span className="mb-2 block text-xs font-semibold text-cyan-200">
                {String(index + 1).padStart(2, "0")}
              </span>

                            <strong className="text-sm font-bold leading-5 text-white">
                                {node}
                            </strong>

                            {isActive && (
                                <motion.div
                                    layoutId={`active-${topic}`}
                                    className="absolute inset-x-4 bottom-2 h-1 rounded-full bg-cyan-300"
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div
                className="mt-5 h-2 overflow-hidden rounded-full bg-slate-300"
                role="progressbar"
                aria-label="Simulation progress"
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-valuenow={step + 1}
            >
                <motion.div
                    className="h-full rounded-full bg-cyan-500"
                    animate={{
                        width: `${((step + 1) * 100) / totalSteps}%`,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Explanation */}
            <div
                className="mt-5 min-h-24 rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-inner"
                aria-live="polite"
                aria-atomic="true"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${topic}-${step}`}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                    >
                        <p className="text-sm leading-7 text-white">
                            <strong className="mr-2 font-bold text-cyan-300">
                                What happens:
                            </strong>

                            <span className="text-slate-100">
                {steps[step]}
              </span>
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={next}
                    className="rounded-lg border border-cyan-600 bg-cyan-500 px-5 py-2.5 font-bold text-slate-950 shadow-sm transition-colors hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                    Next step →
                </button>

                <button
                    type="button"
                    onClick={previous}
                    className={secondaryButtonClass}
                >
                    ← Previous
                </button>

                <button
                    type="button"
                    onClick={reset}
                    className={secondaryButtonClass}
                >
                    Reset
                </button>

                <button
                    type="button"
                    aria-pressed={running}
                    onClick={toggleAutoplay}
                    className={secondaryButtonClass}
                >
                    {running ? "⏸ Pause" : "▶ Autoplay"}
                </button>
            </div>

            {/* Java / Spring Boot production note */}
            <div className="production-note mt-6 rounded-xl border-l-4 border-violet-600 bg-violet-100 p-4">
                <p className="text-sm leading-6 text-slate-900">
                    <strong className="font-bold text-violet-950">
                        ☕ Java / Spring Boot production note:
                    </strong>{" "}
                    <span className="text-slate-900">
            {concept.engineering}
          </span>
                </p>
            </div>
        </section>
    );
}