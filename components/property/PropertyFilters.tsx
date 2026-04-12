"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TYPES = [
  { value: "", label: "Any" },
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
];
const CATEGORIES = [
  { value: "", label: "Any" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "land", label: "Land" },
];

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams();
    const type = (data.get("type") as string) || "";
    const category = (data.get("category") as string) || "";
    const minPrice = (data.get("minPrice") as string) || "";
    const maxPrice = (data.get("maxPrice") as string) || "";
    const minBedrooms = (data.get("minBedrooms") as string) || "";
    const minBathrooms = (data.get("minBathrooms") as string) || "";
    const location = (data.get("location") as string) || "";
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minBedrooms) params.set("minBedrooms", minBedrooms);
    if (minBathrooms) params.set("minBathrooms", minBathrooms);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="filter-location" className="mb-1 block text-sm font-medium">
          Location
        </label>
        <input
          id="filter-location"
          name="location"
          type="text"
          placeholder="City, neighborhood..."
          defaultValue={searchParams.get("location") ?? ""}
          className="w-40 rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="filter-type" className="mb-1 block text-sm font-medium">
          Type
        </label>
        <select
          id="filter-type"
          name="type"
          defaultValue={searchParams.get("type") ?? ""}
          className="rounded border border-gray-300 px-3 py-2"
        >
          {TYPES.map((o) => (
            <option key={o.value || "any"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-category" className="mb-1 block text-sm font-medium">
          Category
        </label>
        <select
          id="filter-category"
          name="category"
          defaultValue={searchParams.get("category") ?? ""}
          className="rounded border border-gray-300 px-3 py-2"
        >
          {CATEGORIES.map((o) => (
            <option key={o.value || "any"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-minPrice" className="mb-1 block text-sm font-medium">
          Min price
        </label>
        <input
          id="filter-minPrice"
          name="minPrice"
          type="number"
          min={0}
          defaultValue={searchParams.get("minPrice") ?? ""}
          className="w-28 rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="filter-maxPrice" className="mb-1 block text-sm font-medium">
          Max price
        </label>
        <input
          id="filter-maxPrice"
          name="maxPrice"
          type="number"
          min={0}
          defaultValue={searchParams.get("maxPrice") ?? ""}
          className="w-28 rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="filter-bedrooms" className="mb-1 block text-sm font-medium">
          Min beds
        </label>
        <input
          id="filter-bedrooms"
          name="minBedrooms"
          type="number"
          min={0}
          defaultValue={searchParams.get("minBedrooms") ?? ""}
          className="w-20 rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="filter-bathrooms" className="mb-1 block text-sm font-medium">
          Min baths
        </label>
        <input
          id="filter-bathrooms"
          name="minBathrooms"
          type="number"
          min={0}
          defaultValue={searchParams.get("minBathrooms") ?? ""}
          className="w-20 rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Apply
      </button>
    </form>
  );
}
