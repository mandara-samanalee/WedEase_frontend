"use client";
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import CustomerMainLayout from '@/components/CustomerLayout/CustomerMainLayout';
import { Guest } from '@/components/RSVP/GuestTypes';
import { RSVPStats } from '@/components/RSVP/RSVPStats';
import DefaultButton from '@/components/DefaultButton';
import { FileText, Save, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function RSVPResponsesPage() {
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('wedeaseGuests');
      if (raw) setGuests(JSON.parse(raw));
    } catch {}
  }, []);

  const grouped = useMemo(() => {
    const byStatus: Record<string, Guest[]> = {};
    guests.forEach(g => {
      byStatus[g.status] = byStatus[g.status] || [];
      byStatus[g.status].push(g);
    });
    return byStatus;
  }, [guests]);

    const exportCSV = useCallback(() => {
    const header = ['Name','Email','Phone','Side','Status','PlusOnes','Dietary','Notes'];
    const rows = guests.map(g => [
      g.name, g.email, g.phone, g.side, g.status, g.plusOnes, g.dietary, g.notes
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${(v ?? '').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-list.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [guests]);

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text('RSVP Responses', 14, 16);
    doc.setFontSize(10);
    doc.text(`Total Guests: ${guests.length}`, 14, 23);
    const statuses = ['confirmed','pending','invited','declined'];
    let y = 30;
    statuses.forEach(status => {
      const list = grouped[status] || [];
      autoTable(doc, {
        startY: y,
        head: [[`${status.toUpperCase()} (${list.length})`, 'Email', 'Phone', 'Side', 'Plus', 'Dietary', 'Notes']],
        body: list.map(g => [
          g.name || '—',
          g.email || '—',
          g.phone || '—',
          g.side,
          g.plusOnes,
          g.dietary || '—',
          g.notes || '—'
        ]),
        styles: { fontSize: 8 },
        theme: 'grid'
      });
      // @ts-expect-error
      y = doc.lastAutoTable.finalY + 6;
    });
    doc.save('rsvp-responses.pdf');
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">RSVP Responses</h1>
              <p className="text-block">
                Overview of guest confirmations and declines.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <DefaultButton
                btnLabel="Export CSV"
                Icon={<Download size={16} />}
                handleClick={exportCSV}
                className="!w-auto !bg-purple-600 !text-white px-4 py-2 rounded-lg text-sm hover:!bg-purple-700"
              />
              <DefaultButton
                btnLabel="Export PDF"
                Icon={<FileText size={16} />}
                handleClick={exportPDF}
                className="!w-auto !bg-purple-600 !text-white px-4 py-2 rounded-lg text-sm hover:!bg-purple-700"
              /> 
            </div>
          </div>

          <RSVPStats guests={guests} />

          <div className="space-y-8">
            {['confirmed','pending','invited','declined'].map(status => {
              const list = grouped[status] || [];
              return (
                <div key={status} className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    {status.charAt(0).toUpperCase()+status.slice(1)} ({list.length})
                  </h2>
                  {list.length === 0 && (
                    <div className="text-sm text-gray-500 border rounded-md px-3 py-4">
                      No {status} guests.
                    </div>
                  )}
                  {list.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {list.map(g => (
                        <div
                          key={g.id}
                          className="rounded-lg border border-purple-400 bg-white/80 px-4 py-3 text-sm flex flex-col"
                        >
                          <div className="font-medium text-gray-800">{g.name || 'Unnamed Guest'}</div>
                          <div className="text-[13px] text-block">{g.email || '—'} | {g.phone || '—'}</div>
                          <div className="mt-1 text-[13px] text-purple-600">
                            Side: {g.side} {g.plusOnes ? `(+${g.plusOnes})` : ''}
                          </div>
                          {(g.dietary || g.notes) && (
                            <div className="mt-1 text-[13px] text-gray-700 line-clamp-2">
                              {(g.dietary && `Dietary: ${g.dietary}`) || ''} {g.notes && ` | ${g.notes}`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CustomerMainLayout>
  );
}