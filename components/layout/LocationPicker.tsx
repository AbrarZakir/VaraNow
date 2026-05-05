"use client";

import { useEffect, useRef } from "react";

interface LocationPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    const container = containerRef.current;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !container) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Fix default marker icon paths (common Next.js/webpack issue)
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.default.map(container).setView([lat, lng], 13);
      mapRef.current = map;

      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      // Initial marker
      const marker = L.default.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;
      marker.bindPopup("📍 Drag me or click map").openPopup();

      // Drag marker to update
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange(parseFloat(pos.lat.toFixed(7)), parseFloat(pos.lng.toFixed(7)));
      });

      // Click map to move marker
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onChange(
          parseFloat(e.latlng.lat.toFixed(7)),
          parseFloat(e.latlng.lng.toFixed(7))
        );
      });
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep marker in sync when lat/lng change externally (e.g. typed in input)
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.panTo([lat, lng]);
    }
  }, [lat, lng]);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="h-64 w-full rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      />
      <p className="text-xs text-gray-500">
        📍 Click on the map or drag the pin to set the property location.
      </p>
    </div>
  );
}
