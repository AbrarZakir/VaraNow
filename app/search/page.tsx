import { searchListingsAction } from "@/app/actions/property";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters from "@/components/property/PropertyFilters";
import MapWrapper from "@/components/layout/MapWrapper";

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = searchParams;
  const type = typeof params.type === "string" ? params.type : undefined;
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const minPrice =
    typeof params.minPrice === "string" ? Number(params.minPrice) : undefined;
  const maxPrice =
    typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;
  const minBedrooms =
    typeof params.minBedrooms === "string"
      ? Number(params.minBedrooms)
      : undefined;
  const limit = typeof params.limit === "string" ? Number(params.limit) : 50;
  const offset =
    typeof params.offset === "string" ? Number(params.offset) : 0;

  const filters = {
    type: type as "buy" | "rent" | undefined,
    category: category as "apartment" | "house" | "land" | undefined,
    minPrice: Number.isNaN(minPrice) ? undefined : minPrice,
    maxPrice: Number.isNaN(maxPrice) ? undefined : maxPrice,
    minBedrooms: Number.isNaN(minBedrooms) ? undefined : minBedrooms,
    limit,
    offset,
  };

  const { data: listings, error } = await searchListingsAction(filters);
  const properties = listings ?? [];
  const markers = properties.map((p) => ({
    id: p.id,
    latitude: p.latitude,
    longitude: p.longitude,
    title: p.title,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">Search properties</h1>
      <div className="mb-6">
        <PropertyFilters />
      </div>
      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {properties.length === 0 ? (
              <p className="col-span-2 text-gray-500">No listings found.</p>
            ) : (
              properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          {markers.length > 0 && (
            <div className="sticky top-4">
              <MapWrapper markers={markers} className="h-72 rounded-lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
