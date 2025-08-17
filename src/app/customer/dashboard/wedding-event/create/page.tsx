"use client";

import React, { useState } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";

export default function CreateEventPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <CustomerMainLayout>
            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold mb-8 text-gray-900">Create Event</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Name */}
                    <div className="flex items-center gap-6 mb-4">
                        <label className="w-40 block">Event Title</label>
                        <div className="flex-1">
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                            />
                        </div>
                    </div>

                    {/* Couple Names */}
                    <div className="flex items-center gap-6 mb-4">
                        <label className="w-40 block">Couple Names</label>
                        <div className="flex-1">
                            <div className="flex gap-4 w-full">
                                <input
                                    name="groomName"
                                    type="text"
                                    className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    required
                                />
                                <input
                                    name="brideName"
                                    type="text"
                                    className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Event Date */}
                    <div className="flex items-center gap-6 mb-4"> {/* Added gap-6 */}
                        <label className="w-40 block">Event Date</label>
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={2}
                                    className="w-16 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    placeholder="DD"
                                    required
                                />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={2}
                                    className="w-16 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    placeholder="MM"
                                    required
                                />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={4}
                                    className="w-24 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    placeholder="YYYY"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Start/End Time */}
                    <div className="flex items-center gap-6 mb-4"> {/* Added gap-6 */}
                        <label className="w-40 text-block">Start Time</label>
                        <div className="flex-1">
                            <div className="flex items-center gap-6">
                                <input
                                    type="time"
                                    className="w-32 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    required
                                />
                                <span className="text-block">End Time</span>
                                <input
                                    type="time"
                                    className="w-32 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-6 mb-4">
                        <label className="w-40 text-block">Location</label>
                        <div className="flex-1 min-w-[300px]">
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-6 mb-4">
                        <label className="w-40 text-block mt-2">Description</label>
                        <div className="flex-1 min-w-[300px]">
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                    </div>

                    {/* Guests Count */}
                    <div className="flex items-center gap-6 mb-4">
                        <label className="w-40 text-block">Guests Count</label>
                        <div className="flex-1">
                            <input
                                type="number"
                                min={0}
                                className="w-28 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pb-60">
                        <DefaultButton
                            btnLabel="Create event"
                            className="mt-2"
                        />
                    </div>
                </form>
            </div>
        </CustomerMainLayout>
    );
}