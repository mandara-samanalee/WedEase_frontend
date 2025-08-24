import React, { useMemo } from 'react';
import { Guest } from './GuestTypes';

export const RSVPStats: React.FC<{ guests: Guest[] }> = ({ guests }) => {
  const { totals, headcount } = useMemo(() => {
    const t = { invited: 0, confirmed: 0, declined: 0, pending: 0 };
    let headcount = 0;
    guests.forEach(g => {
    
      t[g.status] += 1;
      if (g.status === 'confirmed') headcount += 1 + g.plusOnes;
    });
    return { totals: t, headcount };
  }, [guests]);

  const Card = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className={`rounded-lg px-4 py-4 text-center border-2 border-purple-400 bg-white/80`}>
      <div className="text-[12px] uppercase tracking-wide text-gray-600 font-semibold mb-1">{label}</div>
      <div className={`text-lg font-semibold text-${color}-700 tabular-nums`}>{value}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card label="Invited" value={totals.invited} color="gray" />
      <Card label="Confirmed" value={totals.confirmed} color="green" />
      <Card label="Declined" value={totals.declined} color="red" />
      <Card label="Pending" value={totals.pending} color="amber" />
      <Card label="Headcount" value={headcount} color="purple" />
    </div>
  );
};