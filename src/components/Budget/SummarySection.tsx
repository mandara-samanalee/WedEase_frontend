import React, { useMemo } from 'react';
import DefaultButton from '@/components/DefaultButton';

interface Props {
  totalBudget: number;
  setTotalBudget: (v: number) => void;
  totalAllocated: number;
  totalActual: number;
  remaining: number;
  utilizationPct: number;
  overAllocated: boolean;
  overActual: boolean;
  onAutoDistribute: () => void;
  onReset: () => void;
}

const currency = (v: number) => 
  v.toLocaleString(undefined, { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 });

export const SummarySection: React.FC<Props> = ({
  totalBudget,
  setTotalBudget,
  totalAllocated,
  totalActual,
  remaining,
  utilizationPct,
  overAllocated,
  overActual,
  onAutoDistribute,
  onReset,
}) => {
  const circleLength = 283;
  const circleOffset = circleLength - (circleLength * utilizationPct) / 100;

  const cards = useMemo(
    () => [
      { label: 'Total Budget', value: currency(totalBudget) },
      { label: 'Allocated', value: currency(totalAllocated), warn: overAllocated },
      { label: 'Remaining', value: currency(Math.max(remaining, 0)), warn: remaining < 0 },
      { label: 'Actual Spent', value: currency(totalActual), warn: overActual },
    ],
    [totalBudget, totalAllocated, remaining, totalActual, overAllocated, overActual]
  );

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Budget Allocation
          </h1>
          <p className="text-block">
            Plan allocations vs actual spending and stay on target.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cards.map(c => (
              <SummaryCard key={c.label} label={c.label} value={c.value} warn={c.warn} />
            ))}
          </div>
          <div className="hidden md:block relative w-24 h-24 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" className="stroke-gray-200" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#utilGradient)"
                strokeWidth="8"
                strokeDasharray={circleLength}
                strokeDashoffset={circleOffset}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="utilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-brand-violet,#7c3aed)" />
                  <stop offset="100%" stopColor="var(--color-brand-pink,#db2777)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800 font-medium">
              <span className="text-base leading-none">{utilizationPct.toFixed(0)}%</span>
              <span className="text-[9px] uppercase tracking-wide text-gray-500 mt-0.5">Used</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl">
        <div className="rounded-[inherit] py-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold uppercase mb-1">
              Total Wedding Budget (LKR)
            </label>
            <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              value={totalBudget || ''}
              onChange={e => {
                const v = Number(e.target.value);
                setTotalBudget(isNaN(v) || v < 0 ? 0 : v);
              }}
              placeholder="Enter total budget"
              className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <DefaultButton handleClick={onAutoDistribute} btnLabel="Auto Distribute" className="!w-auto !bg-white !text-purple-600 border border-purple-400 px-4 py-2 rounded-lg font-medium text-sm 
            active:!bg-purple-100"/>

            <DefaultButton handleClick={onReset} btnLabel="Reset" className="w-auto px-4 text-white font-medium text-sm inline-flex items-center"></DefaultButton>
          </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

function SummaryCard({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div
      className={`rounded-lg px-2 py-4 text-center border shadow-sm leading-tight ${
        warn 
          ? 'bg-red-50/80 border-2 border-red-200 text-red-700'
          : 'bg-white/80 border-2 border-purple-400 text-gray-800'
      }`}
    >
      <div className="text-[12px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">
        {label}
      </div>
      <div className="tabular-nums text-sm mt-0.5">{value}</div>
    </div>
  );
}
