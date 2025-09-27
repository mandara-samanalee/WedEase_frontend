import { Guest } from './GuestTypes';

export function RSVPStats({ guests }: { guests: Guest[] }) {
  const total = guests.length;
  //const prelisted = guests.filter(g => g.responseStatus === 'PRELISTED').length;
  const invited = guests.filter(g => g.responseStatus === 'INVITED').length;
  const accepted = guests.filter(g => g.responseStatus === 'ACCEPTED').length;
  //const pending = guests.filter(g => g.responseStatus === 'PENDING').length;
  //const declined = guests.filter(g => g.responseStatus === 'DECLINED').length;
  const children = guests.reduce((n, g) => n + (g.childCount || 0), 0);
  const brideSide = guests.filter(g => g.side === 'Bride').length;
  const groomSide = guests.filter(g => g.side === 'Groom').length;
  const male = guests.filter(g => g.Gender === 'Male').length;
  const female = guests.filter(g => g.Gender === 'Female').length;

  type Metric = { label: string; value: number | string; tone: string };

  const metrics: Metric[] = [
    { label: 'Total Guests', value: total, tone: 'purple' },
    //{ label: 'Pre-listed', value: prelisted, tone: 'gray' },
    { label: 'Invited', value: invited, tone: 'blue' },
    { label: 'Accepted', value: accepted, tone: 'green' },
    //{ label: 'Pending', value: pending, tone: 'amber' },
    //{ label: 'Declined', value: declined, tone: 'rose' },
    { label: 'Children', value: children, tone: 'amber' },
    { label: 'Bride / Groom', value: `${brideSide}/${groomSide}`, tone: 'indigo' },
    { label: 'Male / Female', value: `${male}/${female}`, tone: 'cyan' },
  ];

  const toneStyles: Record<string, string> = {
    purple: 'from-purple-50/90 via-white to-white border-purple-200/70',
    green: 'from-emerald-50/90 via-white to-white border-emerald-200/70',
    rose: 'from-rose-50/90 via-white to-white border-rose-200/70',
    amber: 'from-amber-50/90 via-white to-white border-amber-200/70',
    indigo: 'from-indigo-50/90 via-white to-white border-indigo-200/70',
    cyan: 'from-cyan-50/90 via-white to-white border-cyan-200/70',
    blue: 'from-blue-50/90 via-white to-white border-blue-200/70',
    gray: 'from-gray-50/90 via-white to-white border-gray-200/70',
    pink: 'from-pink-50/90 via-white to-white border-pink-200/70',
  };

  const glowRing: Record<string, string> = {
    purple: 'group-hover:ring-purple-300/60',
    green: 'group-hover:ring-emerald-300/60',
    rose: 'group-hover:ring-rose-300/60',
    amber: 'group-hover:ring-amber-300/60',
    indigo: 'group-hover:ring-indigo-300/60',
    cyan: 'group-hover:ring-cyan-300/60',
    blue: 'group-hover:ring-blue-300/60',
    gray: 'group-hover:ring-gray-300/60',
    pink: 'group-hover:ring-pink-300/60',
  };

  const badgeDot: Record<string, string> = {
    purple: 'bg-purple-400',
    green: 'bg-emerald-400',
    rose: 'bg-rose-400',
    amber: 'bg-amber-400',
    indigo: 'bg-indigo-400',
    cyan: 'bg-cyan-400',
    blue: 'bg-blue-400',
    gray: 'bg-gray-400',
    pink: 'bg-pink-400',
  };

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {metrics.map(m => (
        <div
          key={m.label}
          className={[
            'group relative overflow-hidden rounded-xl border backdrop-blur-sm',
            'bg-gradient-to-br',
            toneStyles[m.tone],
            'shadow-sm hover:shadow-md transition-all',
            'ring-1 ring-transparent',
            glowRing[m.tone]
          ].join(' ')}
        >
          {/* soft decorative radial highlight */}
          <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/40 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
          <div className="relative px-4 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={['h-2.5 w-2.5 rounded-full shadow-inner', badgeDot[m.tone]].join(' ')} />
              <p className="text-[11px] font-semibold tracking-wide text-gray-600 uppercase select-none">
                {m.label}
              </p>
            </div>
            <p className="text-xl font-bold tracking-tight text-gray-900">
              {m.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}