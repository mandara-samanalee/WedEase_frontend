"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";
import { FileText, Calendar, DollarSign, CheckSquare, Users, Briefcase } from "lucide-react";

type Vendor = { id?: number; name?: string };
type ChecklistItem = { id?: number; title?: string; done?: boolean };
type AgendaItem = { id?: number; activity?: string };

export default function DashboardOverviewPage() {
  const [eventTitle, setEventTitle] = useState<string>("-");
  const [eventDate, setEventDate] = useState<string>("-");
  const [guestCount, setGuestCount] = useState<number>(0);
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [budgetTotal, setBudgetTotal] = useState<number>(0);
  const [budgetAllocated, setBudgetAllocated] = useState<number>(0);
  const [budgetActual, setBudgetActual] = useState<number>(0);
  const [agendaCount, setAgendaCount] = useState<number>(0);
  const [checklistDone, setChecklistDone] = useState<number>(0);
  const [checklistTotal, setChecklistTotal] = useState<number>(0);
  const [vendorsCount, setVendorsCount] = useState<number>(0);

  useEffect(() => {
    try {
      // Event meta (try a few common keys)
      const eventRaw = localStorage.getItem("wedeaseEvent") || localStorage.getItem("event") || localStorage.getItem("weddingEvent");
      if (eventRaw) {
        try {
          const ev = JSON.parse(eventRaw);
          setEventTitle(ev?.title || ev?.name || "-");
          setEventDate(ev?.date || ev?.day || "-");
        } catch {
          // if it's a simple string
          setEventTitle(eventRaw);
        }
      }
    } catch {}

    try {
      // Guests / RSVPs
      const raw = localStorage.getItem("wedeaseGuests");
      const arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) {
        setGuestCount(arr.length);
        const byStatus: Record<string, number> = {};
        arr.forEach((g: any) => {
          const s = (g?.status || "unknown").toString();
          byStatus[s] = (byStatus[s] || 0) + 1;
        });
        setRsvpCounts(byStatus);
      }
    } catch {}

    try {
      // Budget
      const total = Number(localStorage.getItem("weddingBudget") || 0) || 0;
      setBudgetTotal(total);
      const catsRaw = localStorage.getItem("weddingCategoriesV2");
      const cats = catsRaw ? JSON.parse(catsRaw) : [];
      if (Array.isArray(cats)) {
        const allocated = cats.reduce((s: number, c: any) => s + (Number(c?.allocated) || 0), 0);
        const actual = cats.reduce((s: number, c: any) => s + (Number(c?.actual) || 0), 0);
        setBudgetAllocated(allocated);
        setBudgetActual(actual);
      }
    } catch {}

    try {
      // Agenda (try common keys)
      const aRaw = localStorage.getItem("weddingAgenda") || localStorage.getItem("wedeaseAgenda") || localStorage.getItem("agendaItems");
      const agenda = aRaw ? JSON.parse(aRaw) : [];
      setAgendaCount(Array.isArray(agenda) ? agenda.length : 0);
    } catch {}

    try {
      // Checklist
      const cRaw = localStorage.getItem("weddingChecklist") || localStorage.getItem("wedeaseChecklist") || localStorage.getItem("checklist");
      const checklist = cRaw ? JSON.parse(cRaw) : [];
      if (Array.isArray(checklist)) {
        setChecklistTotal(checklist.length);
        setChecklistDone(checklist.filter((it: ChecklistItem) => it?.done).length);
      }
    } catch {}

    try {
      // Vendors
      const vRaw = localStorage.getItem("wedeaseVendors") || localStorage.getItem("vendors") || localStorage.getItem("weddingVendors");
      const vendors = vRaw ? JSON.parse(vRaw) : [];
      setVendorsCount(Array.isArray(vendors) ? vendors.length : 0);
    } catch {}
  }, []);

  const checklistPct = checklistTotal ? Math.round((checklistDone / checklistTotal) * 100) : 0;
  const budgetUtilPct = budgetTotal ? Math.round((budgetActual / budgetTotal) * 100) : 0;

  return (
    <CustomerMainLayout>
      <div className="max-w-5xl pb-24 space-y-8 px-2 py-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border-2 border-purple-400 p-4 bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 shadow-lg">
            <div className="flex items-start gap-3">
              <Calendar className="text-purple-600" />
              <div>
                <div className="text-md text-purple-700">Event</div>
                <div className="font-medium text-gray-800">{eventTitle || "-"}</div>
                <div className="text-sm text-gray-500">{eventDate || "-"}</div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Link href="/customer/dashboard/event/view" className="text-sm text-purple-600">Manage</Link>
            </div>
          </div>

 
          <div className="rounded-lg border-2 border-purple-400 p-4 bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 shadow-lg">
            <div className="flex items-start gap-3">
              <DollarSign className="text-purple-600" />
              <div>
                <div className="text-md text-purple-700">Budget</div>
                <div className="font-medium text-gray-800">LKR {budgetTotal.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Allocated: LKR {budgetAllocated.toLocaleString()} • Actual: LKR {budgetActual.toLocaleString()}</div>
                <div className="mt-2 text-sm text-gray-600">Utilization: {budgetUtilPct}%</div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Link href="/customer/dashboard/budget/allocation" className="text-sm text-purple-600">Manage</Link>
            </div>
          </div>


          <div className="rounded-lg border-2 border-purple-400 p-4 bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 shadow-lg">
            <div className="flex items-start gap-3">
              <Users className="text-purple-600" />
              <div>
                <div className="text-md text-purple-700">RSVPs</div>
                <div className="font-medium text-gray-800">{guestCount} guests</div>
                <div className="text-sm text-gray-600">
                  Confirmed: {rsvpCounts["confirmed"] || 0} • Pending: {rsvpCounts["pending"] || 0} • Declined: {rsvpCounts["declined"] || 0}
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Link href="/customer/dashboard/rsvp/responses" className="text-sm text-purple-600">View</Link>
            </div>
          </div>


          <div className="rounded-lg border-2 border-purple-400 p-4 bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 shadow-lg">
            <div className="flex items-start gap-3">
              <FileText className="text-purple-600" />
              <div>
                <div className="text-md text-purple-700">Agenda</div>
                <div className="font-medium text-gray-800">{agendaCount} items</div>
                <div className="text-sm text-gray-500">Plan your event schedule</div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Link href="/customer/dashboard/agenda/create" className="text-sm text-purple-600">Edit</Link>
            </div>
          </div>


          <div className="rounded-lg border-2 border-purple-400 p-4 bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 shadow-lg">
            <div className="flex items-start gap-3">
              <CheckSquare className="text-purple-600" />
              <div>
                <div className="text-md text-purple-700">Checklist</div>
                <div className="font-medium text-gray-800">{checklistDone}/{checklistTotal} done</div>
                <div className="text-sm text-gray-500">Progress: {checklistPct}%</div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Link href="/customer/dashboard/checklist/create" className="text-sm text-purple-600">Edit</Link>
            </div>
          </div>


          <div className="rounded-lg border-2 border-purple-400 p-4 bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 shadow-lg">
            <div className="flex items-start gap-3">
              <Briefcase className="text-purple-600" />
              <div>
                <div className="text-md text-purple-700">Vendors</div>
                <div className="font-medium text-gray-800">{vendorsCount} vendors</div>
                <div className="text-sm text-gray-500">Contacts & bookings</div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Link href="/customer/dashboard/vendors/selection" className="text-sm text-purple-600">Manage</Link>
            </div>
          </div>
        </div>
      </div>
    </CustomerMainLayout>
  );
}
