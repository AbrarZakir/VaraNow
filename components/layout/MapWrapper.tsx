"use client";

import { useEffect, useRef } from "react";

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
}

interface MapWrapperProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export default function MapWrapper({
  markers,
  center = { lat: 23.8103, lng: 90.4125 },
  zoom = 10,
  className = "h-64 w-full",
}: MapWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    const container = containerRef.current;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !container) return;

      // Destroy any existing map instance before creating a new one
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.default.map(container).setView([center.lat, center.lng], zoom);
      mapRef.current = map;

      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      markers.forEach((m) => {
        L.default.marker([m.latitude, m.longitude])
          .bindPopup(m.title)
          .addTo(map);
      });
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [markers, center.lat, center.lng, zoom]);

  return <div ref={containerRef} className={className} />;
}
