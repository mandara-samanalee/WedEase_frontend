"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import CustomerMainLayout from '@/components/CustomerLayout/CustomerMainLayout';
import { Guest } from '@/components/RSVP/GuestTypes';
import { GuestListTable } from '@/components/RSVP/GuestListTable';
import { RSVPStats } from '@/components/RSVP/RSVPStats';
import DefaultButton from '@/components/DefaultButton';
import { Plus, Save, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function GuestListPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState('');
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
        email: '',
        phone: '',
        side: 'bride',
        status: 'invited',
        dietary: '',
        notes: '',
        plusOnes: 0,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const updateGuest = (id: number, field: keyof Guest, value: any) => {
    setGuests(g => g.map(x => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const removeGuest = (id: number) => {
    setGuests(g => g.filter(x => x.id !== id));
  };

  const handleSave = () => {
    localStorage.setItem('wedeaseGuests', JSON.stringify(guests));
  };

  return (
    <CustomerMainLayout>
      <div>
        <div className="max-w-5xl pb-24 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Guest List</h1>
              <p className="text-block">Manage and track all invited guests.</p>
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

          <RSVPStats guests={guests} />

          <div className="flex items-center mt-6 mb-2">
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Search guests..."
              className="w-full sm:w-80 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
            />
          </div>

          <GuestListTable
            guests={guests}
            updateGuest={updateGuest}
            removeGuest={removeGuest}
            filter={filter}
          />
        </div>
      </div>
    </CustomerMainLayout>
  );
}