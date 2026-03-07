import { getSavedListAction } from "@/app/actions/bookmark";
import PropertyCard from "@/components/property/PropertyCard";

export default async function SavedPage() {
  const { data: saved, error } = await getSavedListAction();
  const list = saved ?? [];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Saved Properties</h1>
      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {list.length === 0 ? (
        <p className="text-gray-500">No saved properties.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(({ property }) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
