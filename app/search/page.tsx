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
  const location =
    typeof params.location === "string" ? params.location : undefined;
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
  const minBathrooms =
    typeof params.minBathrooms === "string"
      ? Number(params.minBathrooms)
      : undefined;
  const limit = typeof params.limit === "string" ? Number(params.limit) : 50;
  const offset =
    typeof params.offset === "string" ? Number(params.offset) : 0;

  const filters = {
    location,
    type: type as "buy" | "rent" | undefined,
    category: category as "apartment" | "house" | "land" | undefined,
    minPrice: Number.isNaN(minPrice) ? undefined : minPrice,
    maxPrice: Number.isNaN(maxPrice) ? undefined : maxPrice,
    minBedrooms: Number.isNaN(minBedrooms) ? undefined : minBedrooms,
    minBathrooms: Number.isNaN(minBathrooms) ? undefined : minBathrooms,
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
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
            Explore Properties
          </h1>
          <PropertyFilters />
        </div>
      </div>
      
      {error && (
        <div className="mx-auto mt-4 w-full max-w-7xl px-6">
          <p className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm border border-red-100">
            {error}
          </p>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col-reverse lg:flex-row">
        {/* Left side: Grid of listings */}
        <div className="w-full h-full p-6 lg:w-[60%] lg:pr-8">
          <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium text-gray-900">{properties.length} results found</span>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {properties.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50 py-24 text-center">
                <div className="mb-3 rounded-full bg-slate-100 p-4">
                   <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No listings found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters or searching a different area.</p>
              </div>
            ) : (
              properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))
            )}
          </div>
        </div>

        {/* Right side: Sticky Map */}
        <div className="h-[40vh] w-full border-b border-gray-200 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:w-[40%] lg:border-b-0 lg:border-l">
           {markers.length > 0 ? (
             <MapWrapper markers={markers} className="h-full w-full" />
           ) : (
             <div className="flex h-full w-full items-center justify-center bg-gray-50">
               <p className="text-gray-500">Map unavailable</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
