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

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    let map: import("leaflet").Map | null = null;
    import("leaflet").then((L) => {
      map = L.default.map(containerRef.current!).setView(
        [center.lat, center.lng],
        zoom
      );
      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);
      markers.forEach((m) => {
        L.default.marker([m.latitude, m.longitude])
          .bindPopup(m.title)
          .addTo(map!);
      });
    });
    return () => {
      map?.remove();
    };
  }, [markers, center.lat, center.lng, zoom]);

  return <div ref={containerRef} className={className} />;
}
