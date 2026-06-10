"use client";

import { useMemo, useState } from "react";
import { FOOD_OPTIONS, recommendHerbs } from "@/lib/herbs";

export function Recommender() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");

  const recommendations = useMemo(
    () => recommendHerbs([...selected], notes),
    [selected, notes],
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const hasInput = selected.size > 0 || notes.trim().length > 0;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          What do you like to eat?
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {FOOD_OPTIONS.map((food) => {
            const active = selected.has(food.id);
            return (
              <button
                key={food.id}
                type="button"
                onClick={() => toggle(food.id)}
                aria-pressed={active}
                className={
                  "rounded-full border px-3.5 py-1.5 text-sm transition " +
                  (active
                    ? "border-green-700 bg-green-700 text-white"
                    : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10")
                }
              >
                <span className="mr-1">{food.emoji}</span>
                {food.label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <label className="block">
          <span className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
            Anything else? (optional)
          </span>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. I drink a lot of tea and grill steak on weekends"
            className="mt-2 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-green-600 dark:border-white/20"
          />
        </label>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Plant these herbs
        </h2>

        {!hasInput ? (
          <p className="mt-3 rounded-xl border border-dashed border-black/15 p-6 text-center text-sm text-black/50 dark:border-white/20 dark:text-white/50">
            Select some foods above to see recommendations 🌱
          </p>
        ) : recommendations.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-black/15 p-6 text-center text-sm text-black/50 dark:border-white/20 dark:text-white/50">
            No matches yet — try adding more of what you like.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {recommendations.map((herb) => (
              <li
                key={herb.name}
                className="rounded-xl border border-black/10 p-4 dark:border-white/15"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    <span className="mr-1.5">{herb.emoji}</span>
                    {herb.name}
                  </span>
                  {herb.score > 1 ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-200">
                      strong match
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm text-black/60 dark:text-white/60">
                  {herb.blurb}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
