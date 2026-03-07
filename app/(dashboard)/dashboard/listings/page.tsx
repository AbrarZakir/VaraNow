import Link from "next/link";
import { getMyListingsAction } from "@/app/actions/property";
import PropertyCard from "@/components/property/PropertyCard";

export default async function ListingsPage() {
  const { data: listings, error } = await getMyListingsAction();
  const properties = listings ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Listings</h1>
        <Link
          href="/dashboard/create"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create listing
        </Link>
      </div>
      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {properties.length === 0 ? (
        <p className="text-gray-500">You have no listings yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
