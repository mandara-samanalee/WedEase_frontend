"use client";
import React, { useEffect, useRef, useState } from 'react';
import CustomerMainLayout from '@/components/CustomerLayout/CustomerMainLayout';
import { Guest } from '@/components/RSVP/GuestTypes';
import { GuestListTable } from '@/components/RSVP/GuestListTable';
import { RSVPStats } from '@/components/RSVP/RSVPStats';
import DefaultButton from '@/components/DefaultButton';
import { Plus, Save, Funnel } from 'lucide-react';

export default function GuestListPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [textFilter, setTextFilter] = useState('');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [alcoholFilter, setAlcoholFilter] = useState<string>('all');
  const [minChildren, setMinChildren] = useState<number>(0);
  const nextId = useRef(1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('wedeaseGuests');
      if (raw) {
        const parsed: Guest[] = JSON.parse(raw);
        setGuests(parsed);
        nextId.current = (parsed.reduce((m, g) => Math.max(m, g.id), 0) || 0) + 1;
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('wedeaseGuests', JSON.stringify(guests));
  }, [guests]);

  const addGuest = () => {
    setGuests(g => [
      ...g,
      {
        id: nextId.current++,
        name: '',
        phone: '',
        gender: 'other',
        childCount: 0,
        alcohol: 'unknown',
        side: 'bride',
        status: 'invited',
        dietary: '',
        notes: '',
        plusOnes: 0,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const updateGuest = (id: number, field: keyof Guest, value: unknown) =>
    setGuests(g => g.map(x => (x.id === id ? { ...x, [field]: value } : x)));

  const removeGuest = (id: number) =>
    setGuests(g => g.filter(x => x.id !== id));

  const handleSave = () =>
    localStorage.setItem('wedeaseGuests', JSON.stringify(guests));

  const criteriaFiltered = guests.filter(g => {
    if (textFilter) {
      const t = textFilter.toLowerCase();
      if (
        !g.name.toLowerCase().includes(t) &&
        !g.phone.toLowerCase().includes(t)
      ) return false;
    }
    if (sideFilter !== 'all' && g.side !== sideFilter) return false;
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    if (genderFilter !== 'all' && g.gender !== genderFilter) return false;
    if (alcoholFilter !== 'all' && g.alcohol !== alcoholFilter) return false;
    if (minChildren > 0 && (g.childCount || 0) < minChildren) return false;
    return true;
  });

  return (
    <CustomerMainLayout>
      <div className="max-w-6xl pb-24 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">Guest List</h1>
            <p className="text-gray-600">Manage and track all invited guests.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DefaultButton
              btnLabel="Save"
              Icon={<Save size={16} />}
              handleClick={handleSave}
              className="!w-auto !bg-purple-600 !text-white px-4 py-2 rounded-lg text-sm hover:!bg-purple-700"
            />
            <DefaultButton
              btnLabel="Add Guest"
              Icon={<Plus size={16} />}
              handleClick={addGuest}
              className="!w-auto !bg-purple-600 !text-white px-4 py-2 rounded-lg text-sm hover:!bg-purple-700"
            />
          </div>
        </div>

        <RSVPStats guests={criteriaFiltered} />

        {/* Filters */}
        <div className="bg-white border border-purple-100 rounded-lg p-4 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Funnel size={16} className="text-purple-600" /> Filters
          </div>
          <div className="grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-4">
            <input
              value={textFilter}
              onChange={e => setTextFilter(e.target.value)}
              placeholder="Search name / phone"
              className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 col-span-2 md:col-span-2"
            />
            <select
              value={sideFilter}
              onChange={e => setSideFilter(e.target.value)}
              className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Side (All)</option>
              <option value="bride">Bride</option>
              <option value="groom">Groom</option>
              <option value="both">Both</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Status (All)</option>
              <option value="invited">Invited</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
              className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Gender (All)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select
              value={alcoholFilter}
              onChange={e => setAlcoholFilter(e.target.value)}
              className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Alcohol (All)</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="unknown">?</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSideFilter('all');
                setStatusFilter('all');
                setGenderFilter('all');
                setAlcoholFilter('all');
                setMinChildren(0);
                setTextFilter('');
              }}
              className="text-xs text-purple-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        </div>

        <GuestListTable
          guests={criteriaFiltered}
          updateGuest={updateGuest}
          removeGuest={removeGuest}
          filter={''} 
        />
      </div>
    </CustomerMainLayout>
  );
}