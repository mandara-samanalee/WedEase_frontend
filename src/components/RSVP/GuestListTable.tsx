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
      ? (g.guestName + g.phone + g.mealPref + g.notes).toLowerCase().includes(filter.toLowerCase())
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
                  value={g.guestName}
                  placeholder="Name"
                  onChange={e => updateGuest(g.id, 'guestName', e.target.value)}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  className="w-full bg-transparent outline-none"
                  value={g.phone}
                  placeholder="Phone"
                  onChange={e => updateGuest(g.id, 'phone', e.target.value)}
                />
              </td>
              <td className="py-2 px-3">
                <select
                  value={g.Gender}
                  onChange={e => updateGuest(g.id, 'Gender', e.target.value)}
                  className="w-18 rounded-md px-2 py-1 text-sm border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
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
                  value={g.alcoholPref}
                  onChange={e => updateGuest(g.id, 'alcoholPref', e.target.value)}
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
                  <option value="Bride">Bride</option>
                  <option value="Groom">Groom</option>
                  <option value="Other">Other</option>
                </select>
              </td>
              <td className="py-2 px-3">
                <select
                  value={g.responseStatus}
                  onChange={e => updateGuest(g.id, 'responseStatus', e.target.value)}
                  className="rounded-md px-2 py-1 text-sm border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="PRELISTED">Prelisted</option>
                  <option value="INVITED">Invited</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="DECLINED">Declined</option>
                  <option value="PENDING">Pending</option>
                </select>
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  min={0}
                  className="w-14 rounded-md px-2 py-1 text-xs border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  value={g.plus}
                  onChange={e => updateGuest(g.id, 'plus', Number(e.target.value) || 0)}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  className="w-full bg-transparent outline-none"
                  value={g.mealPref}
                  placeholder="-"
                  onChange={e => updateGuest(g.id, 'mealPref', e.target.value)}
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