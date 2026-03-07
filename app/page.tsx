import Link from "next/link";
import { getFeaturedListings, getMapMarkersAction } from "@/app/actions/property";
import PropertyCard from "@/components/property/PropertyCard";
import MapWrapper from "@/components/layout/MapWrapper";

export default async function HomePage() {
  const [listingsResult, mapResult] = await Promise.all([
    getFeaturedListings(8),
    getMapMarkersAction(),
  ]);
  const listings = listingsResult.data ?? [];
  const markers = mapResult.data ?? [];

  return (
    <div>
      <section className="bg-gray-100 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Find your place in Bangladesh
          </h1>
          <p className="mb-6 text-gray-600">
            Search and list properties for buy or rent.
          </p>
          <Link
            href="/search"
            className="inline-block rounded bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Search properties
          </Link>
        </div>
      </section>

      {listings.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <h2 className="mb-4 text-xl font-semibold">Featured listings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {listings.slice(0, 4).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {markers.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <h2 className="mb-4 text-xl font-semibold">Explore on map</h2>
          <MapWrapper markers={markers} className="h-80 w-full rounded-lg" />
        </section>
      )}
    </div>
  );
}
