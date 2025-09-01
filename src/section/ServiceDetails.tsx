"use client"

import React, { useEffect, useRef, useState } from "react";
import type { PickedAddress } from "@/components/Map";
import DefaultButton from "@/components/DefaultButton";
import dynamic from "next/dynamic"
import toast from "react-hot-toast";

export default function ServiceDetails() {
    // Auto-filled fields from map pick
    const [country, setCountry] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    // Dynamically load the Map only on the client
    const Map = dynamic(() => import("@/components/Map"), { ssr: false });

    // Service details fields
    const [serviceName, setServiceName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [capacity, setCapacity] = useState("");

    // Controlled map position
    const [position, setPosition] = useState<[number, number] | null>(null);

    // Pricing packages
    const [packages, setPackages] = useState([{ name: "", price: "", features: "" }]);

    // Photographs state
    const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
    const photoInputId = "photos-input";

    const addPhotos = (files: FileList | File[]) => {
        const incoming = Array.from(files).filter(f => f.type.startsWith("image/"));
        if (!incoming.length) return;
        const next = incoming.map(file => ({ file, url: URL.createObjectURL(file) }));
        setPhotos(prev => [...prev, ...next].slice(0, 6));
    };

    const onPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) addPhotos(e.target.files);
        e.target.value = "";
    };

    const onDropPhotos = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files?.length) addPhotos(e.dataTransfer.files);
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => {
            const copy = [...prev];
            const [removed] = copy.splice(index, 1);
            if (removed) URL.revokeObjectURL(removed.url);
            return copy;
        });
    };

    const skipNextForwardGeocode = useRef(false);

    const handlePick = (addr: PickedAddress) => {
        skipNextForwardGeocode.current = true;
        setCountry(addr.country);
        setProvince(addr.province);
        setDistrict(addr.district);
        setCity(addr.city);
        setAddress(addr.addressLine);
        setPosition([addr.lat, addr.lon]);
    };

    useEffect(() => {
        if (skipNextForwardGeocode.current) {
            skipNextForwardGeocode.current = false;
            return;
        }
        const q = [address, city, district, province, country].filter(Boolean).join(", ");
        if (!q) return;

        const ctrl = new AbortController();
        const t = setTimeout(async () => {
            try {
                const url = new URL("https://nominatim.openstreetmap.org/search");
                url.searchParams.set("format", "json");
                url.searchParams.set("q", q);
                url.searchParams.set("addressdetails", "1");
                url.searchParams.set("limit", "1");

                const res = await fetch(url.toString(), { headers: { Accept: "application/json" }, signal: ctrl.signal });
                const data: unknown[] = await res.json();
                if (data.length) {
                    const best = data[0] as { lat: string; lon: string };
                    const lat = parseFloat(best.lat);
                    const lon = parseFloat(best.lon);
                    if (!Number.isNaN(lat) && !Number.isNaN(lon)) setPosition([lat, lon]);
                }
            } catch (e: unknown) {
                if (e instanceof Error && e.name !== "AbortError") {
                    console.error("Forward geocode failed:", e);
                }
            }
        }, 500);

        return () => {
            clearTimeout(t);
            ctrl.abort();
        };
    }, [address, city, district, province, country]);

    const addPackage = () => setPackages([...packages, { name: "", price: "", features: "" }]);
    const removePackage = (index: number) => setPackages(packages.filter((_, i) => i !== index));
    const updatePackage = (index: number, field: string, value: string) => {
        const updated = [...packages];
        updated[index] = { ...updated[index], [field]: value };
        setPackages(updated);
    };

    const handleSaveService = async () => {
        try {
            const userDataString = localStorage.getItem("user");
            if (!userDataString) throw new Error("Vendor not logged in");

            const userData = JSON.parse(userDataString);
            const vendorId = userData.userId;

            const formData = new FormData();
            formData.append("vendorId", vendorId);
            formData.append("serviceName", serviceName);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("capacity", capacity);
            formData.append("latitude", String(position?.[0] || ""));
            formData.append("longitude", String(position?.[1] || ""));
            formData.append("country", country);
            formData.append("state", province);
            formData.append("district", district);
            formData.append("city", city);
            formData.append("address", address);

            packages.forEach((pkg, i) => {
                formData.append(`packages[${i}][packageName]`, pkg.name);
                formData.append(`packages[${i}][price]`, pkg.price);
                formData.append(`packages[${i}][features]`, pkg.features);
            });

            photos.forEach((p) => formData.append("photos", p.file));

            const res = await fetch("http://localhost:5000/api/service/create", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error(`Failed to create service: ${res.statusText}`);
            const data = await res.json();
            toast.success("Service created successfully!");
            console.log("Created service:", data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err);
                toast.error(err.message || "Error creating service");
            } else {
                console.error(err);
                toast.error("Error creating service");
            }
        }
    };

    return (
        <div className="max-w-2xl w-full space-y-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-4">1. Service Details</h1>

            <div className="flex gap-6">
                <div className="flex-1">
                    <label className="block mb-2">Service Name</label>
                    <input
                        name="serviceName"
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                    />
                </div>

                <div className="flex-1">
                    <label className="block mb-2">Select Category</label>
                    <input
                        name="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-6">
                <div className="flex-1">
                    <label className="block mb-2">Description</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                    />
                </div>

                <div className="flex-1">
                    <label className="block mb-2">Capacity</label>
                    <input
                        name="capacity"
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                    />
                </div>
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-4">2. Service Location</h1>
            <p className="text-m mb-2">
                Pick the location on the map.
            </p>

            {/* Clickable map (controlled by position) */}
            <Map
                onPick={handlePick}
                position={position}
                onPositionChange={setPosition}
                height={320}
            />


            {/* Editable location fields */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2">Country</label>
                    <input
                        name="country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>
                <div>
                    <label className="block mb-2">Province/State</label>
                    <input
                        name="province"
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                <div>
                    <label className="block mb-2">District</label>
                    <input
                        name="district"
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>
                <div>
                    <label className="block mb-2">City</label>
                    <input
                        name="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2">Address</label>
                    <input
                        name="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>
            </div>

            {/* Pricing Packages Section  */}

            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-4">3. Pricing Packages</h1>

                <p className="text-m mb-2">
                    Add one or more pricing options for your service.
                </p>
                <button
                    type="button"
                    onClick={addPackage}
                    className="inline-flex items-center gap-2 text-purple-600"
                >
                    <span className="text-lg leading-none">+</span>
                    <span>Add new</span>
                </button>

                {packages.map((pkg, index) => (
                    <div
                        key={index}
                        className="mb-4 flex flex-col gap-6"
                    >
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2">Package Name</label>
                                    <input
                                        type="text"
                                        value={pkg.name}
                                        onChange={(e) => updatePackage(index, "name", e.target.value)}
                                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Price</label>
                                    <input
                                        type="number"
                                        value={pkg.price}
                                        onChange={(e) => updatePackage(index, "price", e.target.value)}
                                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2">Features</label>
                                <textarea
                                    value={pkg.features}
                                    onChange={(e) => updatePackage(index, "features", e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removePackage(index)}
                                        className="text-red-600 text-sm"
                                    >
                                        Remove Package
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* photographs section */}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-4">4. Photographs</h1>
            <p className="text-m mb-2">
                Upload images that showcase your service.
            </p>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDropPhotos}
                className="rounded-lg border-2 border-dashed border-purple-300 p-6 text-center"
            >
                <p className="text-sm text-gray-600 mb-3">
                    Drag & drop images here, or
                </p>
                <label
                    htmlFor={photoInputId}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 cursor-pointer"
                >
                    <span className="text-lg leading-none">+</span>
                    <span>Add images</span>
                </label>
                <input
                    id={photoInputId}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onPhotosChange}
                    className="hidden"
                />
                <p className="mt-2 text-xs text-gray-500">
                    Up to 6 images. JPG, PNG, or WebP recommended.
                </p>
            </div>

            {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((p, i) => (
                        <div
                            key={i}
                            className="relative aspect-square overflow-hidden rounded-lg border border-purple-200"
                        >
                            <img
                                src={p.url}
                                alt={`Photo ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removePhoto(i)}
                                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-600 rounded-full w-7 h-7 flex items-center justify-center text-base"
                                aria-label="Remove photo"
                                title="Remove"
                            >
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-4 pb-60 pt-6">
                <DefaultButton
                    btnLabel="Save Service"
                    className="mt-2"
                    handleClick={handleSaveService}
                />
            </div>
        </div>
    );
}

