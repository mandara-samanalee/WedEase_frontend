'use client';

import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useEffect, useMemo, useState } from 'react';

// Fix default marker icons for CDN use
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export type PickedAddress = {
  lat: number;
  lon: number;
  country: string;
  province: string;
  district: string;
  city: string;
  addressLine: string;
  raw?: Record<string, unknown>;
};

type MapProps = {
  onPick?: (addr: PickedAddress) => void;
  // Controlled position from parent (optional)
  position?: [number, number] | null;
  onPositionChange?: (pos: [number, number]) => void;
  initialCenter?: [number, number];
  height?: number | string;
  zoom?: number;
};

function Recenter({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [map, position]);
  return null;
}

function LocationPicker({
  onPick,
  onPositionChange,
}: {
  onPick?: (addr: PickedAddress) => void;
  onPositionChange?: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      onPositionChange?.([lat, lng]);

      try {
        const url = new URL('https://nominatim.openstreetmap.org/reverse');
        url.searchParams.set('format', 'jsonv2');
        url.searchParams.set('lat', String(lat));
        url.searchParams.set('lon', String(lng));
        url.searchParams.set('zoom', '18');
        url.searchParams.set('addressdetails', '1');

        const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
        const data = await res.json();

        const a = data?.address || {};
        const country = a.country || '';
        const province = a.state || a.region || '';
        const district = a.district || a.state_district || a.county || '';
        const city = a.city || a.town || a.village || a.municipality || '';
        const street =
          [a.house_number, a.road].filter(Boolean).join(' ').trim() ||
          a.neighbourhood ||
          a.suburb ||
          '';
        const addressLine =
          [street, a.postcode].filter(Boolean).join(', ') || data?.display_name || '';

        onPick?.({
          lat,
          lon: lng,
          country,
          province,
          district,
          city,
          addressLine,
          raw: data,
        });
      } catch (err) {
        console.error('Reverse geocode failed:', err);
      }
    },
  });

  return null;
}

const Map = ({
  onPick,
  position: controlledPos = null,
  onPositionChange,
  initialCenter = [20, 0],
  height = 320,
  zoom = 2,
}: MapProps) => {
  const [internalPos, setInternalPos] = useState<[number, number] | null>(null);

  const position = useMemo(() => controlledPos ?? internalPos, [controlledPos, internalPos]);

  const handlePosChange = (pos: [number, number]) => {
    if (onPositionChange) onPositionChange(pos);
    else setInternalPos(pos);
  };

  return (
    <MapContainer
      center={position ?? initialCenter}
      zoom={zoom}
      scrollWheelZoom
      worldCopyJump
      style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
      className="rounded-lg border border-purple-200"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationPicker onPick={onPick} onPositionChange={handlePosChange} />
      <Recenter position={position} />
      {position && <Marker position={position} />}
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(Map), { ssr: false });
