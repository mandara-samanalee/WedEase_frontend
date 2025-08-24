import React from 'react';
import { Trash2 } from 'lucide-react';

export interface BudgetCategory {
  id: number;
  name: string;
  allocated: number;
  actual: number;
}

interface Props {
  category: BudgetCategory;
  totalBudget: number;
  onUpdate: (id: number, field: keyof BudgetCategory, value: string) => void;
  onDelete: (id: number) => void;
}

export const CategoryCard: React.FC<Props> = ({
  category,
  totalBudget,
  onUpdate,
  onDelete
}) => {
  const allocPct = totalBudget ? (category.allocated / totalBudget) * 100 : 0;
  const usagePct = category.allocated ? (category.actual / category.allocated) * 100 : 0;
  const overSpend = category.actual > category.allocated;
  const variance = category.actual - category.allocated;

  return (
    <div className="rounded-xl border shadow-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-purple-700">{category.name}</h3>
          <p className="text-[11px] uppercase tracking-wide text-gray-400">
            {allocPct.toFixed(0)}% of total
          </p>
        </div>
        <button
          onClick={() => onDelete(category.id)}
          className="text-red-500 hover:text-red-600"
          title="Remove category"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-medium text-gray-600 uppercase mb-1">
            Allocated
          </label>
            <input
              type="number"
              min={0}
              value={category.allocated}
              onChange={e => onUpdate(category.id, 'allocated', e.target.value)}
              className="w-full rounded-md px-2.5 py-1.5 text-xs border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-600 uppercase mb-1">
            Actual
          </label>
          <input
            type="number"
            min={0}
            value={category.actual}
            onChange={e => onUpdate(category.id, 'actual', e.target.value)}
            className="w-full rounded-md px-2.5 py-1.5 text-xs border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>Usage</span>
          <span>{usagePct.toFixed(0)}%</span>
        </div>
        <div className="h-2 rounded bg-purple-100 overflow-hidden">
          <div
            className={`h-full transition-all ${overSpend ? 'bg-red-500' : 'bg-purple-500'}`}
            style={{ width: Math.min(usagePct, 100) + '%' }}
          />
        </div>
      </div>

      <div className="text-[11px] flex justify-between">
        <span className="text-gray-500">Variance</span>
        <span className={overSpend ? 'text-red-600 font-medium' : 'text-gray-700 font-medium'}>
          {overSpend ? '+' : ''}
          {variance.toLocaleString(undefined, {
            style: 'currency',
            currency: 'LKR',
            maximumFractionDigits: 0
          })}
        </span>
      </div>
    </div>
  );
};