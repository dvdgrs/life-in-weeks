'use client';

import { useState } from 'react';
import styles from './grid.module.css';

const WEEKS_PER_YEAR = 52;

export default function Home() {
  const [birthDate, setBirthDate] = useState('1972-07-14');
  const [totalYears, setTotalYears] = useState(85);

  const totalWeeks = totalYears * WEEKS_PER_YEAR;

  const weeksLived = birthDate
    ? Math.max(
        0,
        Math.min(
          Math.floor(
            (Date.now() - new Date(birthDate + 'T12:00:00').getTime()) /
              (7 * 24 * 60 * 60 * 1000)
          ),
          totalWeeks
        )
      )
    : 0;

  const weeksRemaining = totalWeeks - weeksLived;
  const percentage = ((weeksLived / totalWeeks) * 100).toFixed(1);
  const today = new Date().toISOString().split('T')[0];

  function handleYearsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.max(1, Math.min(120, parseInt(e.target.value) || 1));
    setTotalYears(val);
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
          Life in Weeks
        </h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-8">
          {totalYears} ans × 52 semaines = {totalWeeks.toLocaleString('fr-FR')} semaines
        </p>

        <div className="flex flex-wrap gap-6">
          <div>
            <label
              htmlFor="birthdate"
              className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2"
            >
              Date de naissance
            </label>
            <input
              id="birthdate"
              type="date"
              value={birthDate}
              max={today}
              onChange={(e) => setBirthDate(e.target.value)}
              className="border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="years"
              className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2"
            >
              Espérance de vie (ans)
            </label>
            <input
              id="years"
              type="number"
              value={totalYears}
              min={1}
              max={120}
              onChange={handleYearsChange}
              className="w-24 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full flex justify-center mb-8">
        <div className={styles.grid}>
          {Array.from({ length: totalWeeks }, (_, i) => (
            <div
              key={i}
              className={`${styles.cell} ${
                i < weeksLived
                  ? 'bg-zinc-800 dark:bg-zinc-200'
                  : 'border border-zinc-200 dark:border-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>

      {birthDate && (
        <div className="flex gap-8 sm:gap-12 text-center">
          <div>
            <div className="text-xl sm:text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {weeksLived.toLocaleString('fr-FR')}
            </div>
            <div className="text-xs text-zinc-500 mt-1">semaines vécues</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {weeksRemaining.toLocaleString('fr-FR')}
            </div>
            <div className="text-xs text-zinc-500 mt-1">semaines restantes</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {percentage}%
            </div>
            <div className="text-xs text-zinc-500 mt-1">de vie écoulée</div>
          </div>
        </div>
      )}
    </main>
  );
}
