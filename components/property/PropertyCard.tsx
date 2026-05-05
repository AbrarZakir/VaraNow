"use client";

import Link from "next/link";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  imageUrl?: string;
}

export default function PropertyCard({ property, imageUrl }: PropertyCardProps) {
  const price = Number(property.price).toLocaleString();
  
  // Define fallback gradients just so UI doesn't look empty when missing an image
  const fallbacks = [
    "from-blue-100 to-indigo-100",
    "from-emerald-100 to-teal-100",
    "from-rose-100 to-orange-100",
    "from-purple-100 to-fuchsia-100"
  ];
  const bgGradient = fallbacks[property.id.charCodeAt(0) % fallbacks.length];

  return (
    <Link
      href={`/property/${property.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
    >
      <div className={`aspect-[4/3] w-full relative overflow-hidden ${imageUrl ? "bg-gray-100" : `bg-gradient-to-br ${bgGradient}`}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // If image fails to load, hide it and show gradient fallback
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-overlay">
            <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-900 shadow-sm backdrop-blur-sm">
          For {property.type}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
        </div>
        
        <p className="mb-4 text-sm font-medium text-gray-500 line-clamp-1">
          {property.address}
        </p>

        <div className="mt-auto">
          <div className="mb-4 grid grid-cols-3 gap-2 border-y border-gray-100 py-3 text-center text-sm">
            <div className="flex flex-col items-center">
              <span className="font-bold text-gray-700">{property.bedrooms}</span>
              <span className="text-xs text-gray-500">Beds</span>
            </div>
            <div className="flex flex-col items-center border-l border-gray-100">
              <span className="font-bold text-gray-700">{property.bathrooms}</span>
              <span className="text-xs text-gray-500">Baths</span>
            </div>
            <div className="flex flex-col items-center border-l border-gray-100">
              <span className="font-bold text-gray-700">{property.area_sqft}</span>
              <span className="text-xs text-gray-500">Sqft</span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Price</p>
              <p className="text-xl font-extrabold text-blue-700">
                <span className="text-sm font-bold text-gray-500">৳</span> {price}
              </p>
            </div>
            <span className="text-xs font-medium capitalize text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              {property.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
