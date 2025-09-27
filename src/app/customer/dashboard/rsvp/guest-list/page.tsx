"use client";

import React, { useEffect, useState } from 'react';
import CustomerMainLayout from '@/components/CustomerLayout/CustomerMainLayout';
import { Guest } from '@/components/RSVP/GuestTypes';
import { GuestListTable } from '@/components/RSVP/GuestListTable';
import { RSVPStats } from '@/components/RSVP/RSVPStats';
import DefaultButton from '@/components/DefaultButton';
import { Plus, Save, Funnel, Loader } from 'lucide-react';
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function GuestListPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [textFilter, setTextFilter] = useState('');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [alcoholFilter, setAlcoholFilter] = useState<string>('all');
  const [minChildren, setMinChildren] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSession = () => {
    try {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        return { userId: user?.userId, token };
      }
      return { userId: undefined, token: token || "" };
    } catch {
      return { userId: undefined, token: "" };
    }
  };

  const fetchGuests = async () => {
    const { token, userId } = getSession();

    if (!userId || !token) {
      toast.error("Please login to continue.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/rsvp/get-all-guests/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load guests: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status && result.data?.guests) {
        const guestList: Guest[] = result.data.guests.map((guest: unknown) => {
          const g = guest as Partial<Guest> & { [key: string]: unknown };
          return {
            id: g.id as number,
            guestName: g.guestName as string || '',
            phone: g.phone as string || '',
            Gender: g.Gender as Guest["Gender"] || 'Male',
            childCount: g.childCount as number || 0,
            alcoholPref: g.alcoholPref as Guest["alcoholPref"] || 'unknown',
            mealPref: g.mealPref as string || '',
            plus: g.plus as number || 0,
            side: g.side as Guest["side"] || 'Bride',
            responseStatus: g.responseStatus as Guest["responseStatus"] || 'PRELISTED',
            notes: g.notes as string || '',
            createdAt: g.createdAt as string || new Date().toISOString(),
            updatedAt: g.updatedAt as string || new Date().toISOString()
          };
        });
        setGuests(guestList);
        toast.success("Guest list loaded successfully");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast.error("Error loading guests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const addGuest = () => {
    setGuests(prev => [
      ...prev,
      {
        id: -Date.now(),
        guestName: '',
        phone: '',
        Gender: 'Male',
        childCount: 0,
        alcoholPref: 'unknown',
        mealPref: '',
        plus: 0,
        side: 'Bride',
        responseStatus: 'PRELISTED',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  };

  const updateGuest = (id: number, field: keyof Guest, value: unknown) => {
    setGuests(prev => prev.map(guest => 
      guest.id === id ? { ...guest, [field]: value, updatedAt: new Date().toISOString() } : guest
    ));
  };

  const removeGuest = async (id: number) => {
    const { token } = getSession();

    if (id < 0) {
      setGuests(prev => prev.filter(guest => guest.id !== id));
      toast.success("Guest removed");
      return;
    }

    if (!token) {
      toast.error("Please login to continue.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/rsvp/delete/${id}`, {
        method: 'DELETE',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete guest: ${response.status}`);
      }

      setGuests(prev => prev.filter(guest => guest.id !== id));
      toast.success("Guest deleted successfully");
    } catch (error) {
      console.error("Error deleting guest:", error);
      toast.error("Error deleting guest");
    }
  };

  const handleSave = async () => {
    const { token, userId } = getSession();

    if (!userId || !token) {
      toast.error("Please login to continue.");
      return;
    }

    try {
      const eventResponse = await fetch(`${BASE_URL}/rsvp/get-all-guests/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!eventResponse.ok) {
        throw new Error("Failed to get event data");
      }

      const eventResult = await eventResponse.json();
      const eventId = eventResult.data?.id;

      if (!eventId) {
        throw new Error("Event not found");
      }

      const payload = {
        eventId,
        guests: guests.map(guest => ({
          ...(guest.id > 0 ? { id: guest.id } : {}),
          guestName: guest.guestName,
          phone: guest.phone,
          Gender: guest.Gender,
          childCount: guest.childCount,
          alcoholPref: guest.alcoholPref,
          mealPref: guest.mealPref,
          plus: guest.plus,
          side: guest.side,
          responseStatus: guest.responseStatus,
          notes: guest.notes
        }))
      };

      const saveResponse = await fetch(`${BASE_URL}/rsvp/save-changes`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!saveResponse.ok) {
        throw new Error(`Failed to save guests: ${saveResponse.status}`);
      }

      toast.success("Guests saved successfully");
      await fetchGuests(); // Refresh the list to get updated data
    } catch (error) {
      console.error("Error saving guests:", error);
      toast.error("Error saving guests");
    }
  };

  const criteriaFiltered = guests.filter(guest => {
    if (textFilter) {
      const searchTerm = textFilter.toLowerCase();
      if (!guest.guestName.toLowerCase().includes(searchTerm) && 
          !guest.phone.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }
    if (sideFilter !== 'all' && guest.side !== sideFilter) return false;
    if (statusFilter !== 'all' && guest.responseStatus !== statusFilter) return false;
    if (genderFilter !== 'all' && guest.Gender !== genderFilter) return false;
    if (alcoholFilter !== 'all' && guest.alcoholPref !== alcoholFilter) return false;
    if (minChildren > 0 && guest.childCount < minChildren) return false;
    return true;
  });

  if (isLoading) {
    return (
      <CustomerMainLayout>
        <div className="max-w-4xl mx-auto py-2">
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <Loader className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading Guest details...</p>
                    </div>
                  </div>
                </div>
      </CustomerMainLayout>
    );
  }

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
              btnLabel={"Save"}
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
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Status (All)</option>
              <option value="PRELISTED">Prelisted</option>
              <option value="INVITED">Invited</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="DECLINED">Declined</option>
            </select>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
              className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Gender (All)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={alcoholFilter}
              onChange={e => setAlcoholFilter(e.target.value)}
              className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Alcohol (All)</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="unknown">Unknown</option>
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