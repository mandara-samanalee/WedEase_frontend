import React from 'react';
import { Guest } from './GuestTypes';
import { Trash2 } from 'lucide-react';

interface Props {
  guests: Guest[];
  updateGuest: (id: number, field: keyof Guest, value: unknown) => void;
  removeGuest: (id: number) => void;
  filter: string;
}

export const GuestListTable: React.FC<Props> = ({ guests, updateGuest, removeGuest, filter }) => {
  const filtered = guests.filter(g =>
    filter
      ? (g.name + g.phone + g.dietary + g.notes).toLowerCase().includes(filter.toLowerCase())
      : true
  );

  if (!filtered.length)
    return <div className="text-sm text-gray-600 py-8 text-center border rounded-lg">No guests match.</div>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-purple-50 text-[12px] uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Phone</th>
            <th className="py-2 px-3">Gender</th>
            <th className="py-2 px-3">Child count</th>
            <th className="py-2 px-3">Alcohol</th>
            <th className="px-3 py-2">Side</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Plus</th>
            <th className="px-3 py-2 text-left">Dietary</th>
            <th className="px-3 py-2 text-left">Notes</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(g => (
            <tr key={g.id} className="border-t hover:bg-purple-50/40">
              <td className="px-3 py-2">
                <input
                  className="w-full bg-transparent outline-none"
                  value={g.name}
                  placeholder="Name"
                  onChange={e => updateGuest(g.id, 'name', e.target.value)}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  className="w-full bg-transparent outline-none"
                  value={g.phone}
                  placeholder="phone"
                  onChange={e => updateGuest(g.id, 'phone', e.target.value)}
                />
              </td>
              <td className="py-2 px-3">
                <select
                  value={g.gender}
                  onChange={e => updateGuest(g.id, 'gender', e.target.value)}
                  className="w-18 rounded-md px-2 py-1 text-sm border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </td>
              <td className="py-2 px-3">
                <input
                  type="number"
                  min={0}
                  value={g.childCount}
                  onChange={e => updateGuest(g.id, 'childCount', Number(e.target.value))}
                  className="w-14 rounded-md px-2 py-1 text-xs border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </td>
              <td className="py-2 px-3">
                <select
                  value={g.alcohol}
                  onChange={e => updateGuest(g.id, 'alcohol', e.target.value)}
                  className="w-18 rounded-md px-2 py-1 text-sm border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </td>
              <td className="px-3 py-2">
                <select
                  className="rounded-md px-2 py-1 text-sm border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  value={g.side}
                  onChange={e => updateGuest(g.id, 'side', e.target.value)}
                >
                  <option value="bride">Bride</option>
                  <option value="groom">Groom</option>
                  <option value="other">Other</option>
                </select>
              </td>
              <td className="py-2 px-3">
                <select
                  value={g.status}
                  onChange={e => updateGuest(g.id, 'status', e.target.value)}
                  className="text-sm bg-transparent"
                >
                  <option value="invited">Invited</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="pending">Pending</option>
                </select>
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  min={0}
                  className="w-14 rounded-md px-2 py-1 text-xs border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  value={g.plusOnes}
                  onChange={e => updateGuest(g.id, 'plusOnes', Number(e.target.value) || 0)}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  className="w-full bg-transparent outline-none"
                  value={g.dietary}
                  placeholder="-"
                  onChange={e => updateGuest(g.id, 'dietary', e.target.value)}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  className="w-full bg-transparent outline-none"
                  value={g.notes}
                  placeholder="-"
                  onChange={e => updateGuest(g.id, 'notes', e.target.value)}
                />
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={() => removeGuest(g.id)}
                  className="text-red-500 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};