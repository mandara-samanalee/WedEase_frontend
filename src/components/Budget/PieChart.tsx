import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { BudgetCategory } from './CategoryCard';

ChartJS.register(ArcElement, Tooltip, Legend);

const currency = (v: number) =>
  v.toLocaleString(undefined, { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 });

interface Props {
  categories: BudgetCategory[];
  size?: number;     
}

export const AllocationDistributionSection: React.FC<Props> = ({
  categories,
  size = 300      
}) => {
  const totalAllocated = useMemo(
    () => categories.reduce((s, c) => s + c.allocated, 0),
    [categories]
  );

  if (totalAllocated <= 0) return null;

  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.allocated),
        backgroundColor: [
          '#6366F1','#EC4899','#F59E0B','#10B981',
          '#3B82F6','#EF4444','#6B7280','#8B5CF6','#14B8A6'
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-block tracking-wide uppercase">
        Budget Allocation Distribution
      </h2>
      <div
        style={{ width: size, height: size }}
        className="relative"
      >
        <Pie
          data={data}
          options={{
            maintainAspectRatio: false,  
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 10, font: { size: 10 } }
              },
              tooltip: {
                callbacks: {
                  label: ctx => {
                    const raw = Number(ctx.raw || 0);
                    const pct = totalAllocated ? (raw / totalAllocated) * 100 : 0;
                    return `${ctx.label}: ${currency(raw)} (${pct.toFixed(1)}%)`;
                  }
                }
              }
            },
            layout: { padding: 4 }
          }}
        />
      </div>
    </section>
  );
};