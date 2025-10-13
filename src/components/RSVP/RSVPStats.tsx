import { JSX } from 'react';
import { Guest } from './GuestTypes';
import { Users, UserCheck, Mail, Baby, Heart, UserCircle2 } from 'lucide-react';

export function RSVPStats({ guests }: { guests: Guest[] }) {
  const total = guests.length;
  const invited = guests.filter(g => g.responseStatus === 'INVITED').length;
  const accepted = guests.filter(g => g.responseStatus === 'ACCEPTED').length;
  const children = guests.reduce((n, g) => n + (g.childCount || 0), 0);
  const brideSide = guests.filter(g => g.side === 'Bride').length;
  const groomSide = guests.filter(g => g.side === 'Groom').length;
  const male = guests.filter(g => g.Gender === 'Male').length;
  const female = guests.filter(g => g.Gender === 'Female').length;

  type Metric = { 
    label: string; 
    value: number | string; 
    gradient: string;
    iconBg: string;
    icon: JSX.Element;
  };

  const metrics: Metric[] = [
    { 
      label: 'Total Guests', 
      value: total, 
      gradient: 'from-purple-50 to-purple-100',
      iconBg: 'from-purple-400 to-purple-600',
      icon: <Users className="w-6 h-6" />
    },
    { 
      label: 'Invited', 
      value: invited, 
      gradient: 'from-blue-50 to-blue-100',
      iconBg: 'from-blue-400 to-blue-600',
      icon: <Mail className="w-6 h-6" />
    },
    { 
      label: 'Accepted', 
      value: accepted, 
      gradient: 'from-green-50 to-green-100',
      iconBg: 'from-green-400 to-green-600',
      icon: <UserCheck className="w-6 h-6" />
    },
    { 
      label: 'Children', 
      value: children, 
      gradient: 'from-amber-50 to-amber-100',
      iconBg: 'from-amber-400 to-amber-600',
      icon: <Baby className="w-6 h-6" />
    },
    { 
      label: 'Bride / Groom', 
      value: `${brideSide}/${groomSide}`, 
      gradient: 'from-pink-50 to-pink-100',
      iconBg: 'from-pink-400 to-pink-600',
      icon: <Heart className="w-6 h-6" />
    },
    { 
      label: 'Male / Female', 
      value: `${male}/${female}`, 
      gradient: 'from-indigo-50 to-indigo-100',
      iconBg: 'from-indigo-400 to-indigo-600',
      icon: <UserCircle2 className="w-6 h-6" />
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map(m => (
        <div
          key={m.label}
          className={`bg-gradient-to-br ${m.gradient} rounded-xl shadow-md p-5 border-2 border-white/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                {m.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {m.value}
              </p>
            </div>
            <div className={`bg-gradient-to-br ${m.iconBg} p-3 rounded-xl text-white shadow-lg`}>
              {m.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}