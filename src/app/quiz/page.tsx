"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS } from "@/lib/quiz";
import { buildPersonality } from "@/lib/personality";
import { useApp } from "@/lib/store";
import type { CompatibilityAnswers } from "@/lib/types";

const empty: Partial<CompatibilityAnswers> = {
  activities: [],
  food: [],
  tripRuiners: [],
  priorities: [],
};

export default function QuizPage() {
  const { completeQuiz, currentUser } = useApp();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<CompatibilityAnswers>>(empty);
  const [done, setDone] = useState(false);
  const q = QUIZ_QUESTIONS[index];
  const progress = Math.round(((index + (done ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100);

  const personality = useMemo(() => {
    if (!done) return null;
    return buildPersonality(answers as CompatibilityAnswers);
  }, [done, answers]);

  function setValue(id: keyof CompatibilityAnswers, value: unknown) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  function canContinue() {
    const v = answers[q.id];
    if (q.kind === "scale") return true;
    if (q.kind === "multi" || q.kind === "rank") return Array.isArray(v) && v.length > 0;
    return Boolean(v);
  }

  function next() {
    const nextAnswers =
      q.kind === "scale" && typeof answers[q.id] !== "number"
        ? { ...answers, [q.id]: 3 }
        : answers;
    if (q.kind === "scale" && typeof answers[q.id] !== "number") {
      setAnswers(nextAnswers);
    }
    if (index < QUIZ_QUESTIONS.length - 1) {
      setIndex(index + 1);
      return;
    }
    completeQuiz(nextAnswers as CompatibilityAnswers);
    setDone(true);
  }

  if (!currentUser) {
    return <main className="p-8">Please log in first.</main>;
  }

  if (done && personality) {
    return (
      <main className="mx-auto max-w-lg px-5 py-10">
        <p className="text-sm text-muted">Your Travel Personality</p>
        <h1 className="mt-2 font-serif text-4xl">
          {personality.emoji} {personality.title}
        </h1>
        <div className="mt-8 space-y-3">
          {Object.entries(personality.scores).map(([k, v]) => (
            <div key={k}>
              <div className="mb-1 flex justify-between text-sm capitalize">
                <span>{k}</span>
                <span>{v}%</span>
              </div>
              <div className="h-2 rounded-full bg-sand">
                <div className="h-full rounded-full bg-forest" style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => router.push("/app")} className="mt-10 w-full rounded-full bg-forest py-3 text-white">
          Go to dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-6">
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-sand">
        <div className="h-full bg-forest transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs uppercase tracking-widest text-muted">
        Question {index + 1} / {QUIZ_QUESTIONS.length}
      </p>
      <article className="mt-4 overflow-hidden rounded-[1.8rem] bg-card tm-shadow">
        <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${q.image})` }} />
        <div className="p-5">
          <h1 className="font-serif text-3xl">{q.title}</h1>
          {q.subtitle && <p className="mt-2 text-sm text-muted">{q.subtitle}</p>}

          {q.kind === "single" && (
            <div className="mt-5 grid gap-2">
              {q.options?.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setValue(q.id, opt.value)}
                  className={`rounded-2xl border px-4 py-3 text-left ${
                    answers[q.id] === opt.value ? "border-forest bg-forest text-white" : "border-line bg-paper"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {q.kind === "multi" && (
            <div className="mt-5 flex flex-wrap gap-2">
              {q.options?.map((opt) => {
                const selected = ((answers[q.id] as string[]) ?? []).includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const cur = new Set((answers[q.id] as string[]) ?? []);
                      if (cur.has(opt.value)) cur.delete(opt.value);
                      else cur.add(opt.value);
                      setValue(q.id, [...cur]);
                    }}
                    className={`rounded-full px-4 py-2 text-sm ${selected ? "bg-forest text-white" : "bg-sand"}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {q.kind === "rank" && (
            <div className="mt-5 grid gap-2">
              {q.options?.map((opt) => {
                const rank = ((answers[q.id] as string[]) ?? []).indexOf(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const cur = [...((answers[q.id] as string[]) ?? [])];
                      if (cur.includes(opt.value)) return;
                      setValue(q.id, [...cur, opt.value]);
                    }}
                    className="flex items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3"
                  >
                    <span>{opt.label}</span>
                    <span className="text-sm text-muted">{rank >= 0 ? `#${rank + 1}` : "Tap"}</span>
                  </button>
                );
              })}
              <button className="text-sm text-muted" onClick={() => setValue(q.id, [])}>
                Reset ranking
              </button>
            </div>
          )}

          {q.kind === "scale" && (
            <div className="mt-6">
              <input
                type="range"
                min={q.min}
                max={q.max}
                value={(answers[q.id] as number) ?? 3}
                onChange={(e) => setValue(q.id, Number(e.target.value))}
                onPointerUp={() => {
                  if (typeof answers[q.id] !== "number") setValue(q.id, 3);
                }}
                className="w-full accent-forest"
              />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>{q.minLabel}</span>
                <span className="text-base text-ink">{(answers[q.id] as number) ?? 3}</span>
                <span>{q.maxLabel}</span>
              </div>
            </div>
          )}
        </div>
      </article>
      <div className="mt-5 flex gap-3">
        <button
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
          className="flex-1 rounded-full border border-line py-3 disabled:opacity-30"
        >
          Back
        </button>
        <button
          disabled={!canContinue()}
          onClick={next}
          className="flex-[2] rounded-full bg-forest py-3 text-white disabled:opacity-40"
        >
          {index === QUIZ_QUESTIONS.length - 1 ? "See personality" : "Continue"}
        </button>
      </div>
    </main>
  );
}
