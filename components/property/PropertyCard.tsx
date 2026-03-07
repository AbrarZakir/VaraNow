import Link from "next/link";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const price = Number(property.price).toLocaleString();
  return (
    <Link
      href={`/property/${property.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {property.title}
        </h3>
        <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {property.type}
        </span>
      </div>
      <p className="mb-2 text-sm text-gray-600 line-clamp-2">
        {property.address}
      </p>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
        <span>BDT {price}</span>
        <span>{property.area_sqft} sq ft</span>
        <span>{property.bedrooms} bed</span>
        <span>{property.bathrooms} bath</span>
      </div>
    </Link>
  );
}
