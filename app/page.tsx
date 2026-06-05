'use client';

import { useState } from 'react';
import styles from './grid.module.css';

const WEEKS_PER_YEAR = 52;

export default function Home() {
  const [birthDate, setBirthDate] = useState('1972-07-14');
  const [totalYears, setTotalYears] = useState(85);
  const [yearsInput, setYearsInput] = useState('85');

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
    const raw = e.target.value;
    setYearsInput(raw);
    const val = parseInt(raw);
    if (!isNaN(val) && val >= 1 && val <= 120) {
      setTotalYears(val);
    }
  }

  function handleYearsBlur() {
    const val = parseInt(yearsInput);
    if (isNaN(val) || val < 1) {
      setTotalYears(1);
      setYearsInput('1');
    } else if (val > 120) {
      setTotalYears(120);
      setYearsInput('120');
    } else {
      setYearsInput(String(val));
    }
  }

  function handlePrint() {
    const win = window.open('', `lifeweeks_print_${Date.now()}`);
    if (!win) return;

    const cells = Array.from({ length: totalWeeks }, (_, i) =>
      `<div class="${i < weeksLived ? 'lived' : 'future'}"></div>`
    ).join('');

    win.document.open();
    win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { margin: 0; size: auto; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { background: white; padding: 15mm; display: flex; justify-content: center; align-items: center; }
  .grid { display: grid; grid-template-columns: repeat(52, 8px); gap: 2px; }
  .lived { width: 8px; height: 8px; background: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .future { width: 8px; height: 8px; border: 1px solid #71717a; }
</style>
</head>
<body>
<div class="grid">${cells}</div>
<script>window.onload = function() { window.print(); window.close(); }</script>
</body>
</html>`);
    win.document.close();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center py-12 px-4">
      <div className="no-print w-full max-w-2xl mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
          Life in Weeks
        </h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-8">
          {totalYears} ans × 52 semaines = {totalWeeks.toLocaleString('fr-FR')} semaines
        </p>

        <div className="flex flex-wrap gap-6 items-end">
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
              value={yearsInput}
              min={1}
              max={120}
              onChange={handleYearsChange}
              onBlur={handleYearsBlur}
              className="w-24 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
            />
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Enregistrer en PDF
          </button>
        </div>
      </div>

      <div className="grid-wrapper w-full flex justify-center mb-8">
        <div className={styles.grid}>
          {Array.from({ length: totalWeeks }, (_, i) => (
            <div
              key={i}
              className={`${styles.cell} ${
                i < weeksLived
                  ? `bg-zinc-800 dark:bg-zinc-200 ${styles.lived}`
                  : `border border-zinc-200 dark:border-zinc-700 ${styles.future}`
              }`}
            />
          ))}
        </div>
      </div>

      {birthDate && (
        <div className="no-print flex gap-8 sm:gap-12 text-center">
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
