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
  const imageMap = listingsResult.imageMap ?? {};
  const markers = mapResult.data ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-6 py-32 text-center text-white sm:py-40">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Find Your Place in <span className="text-blue-400">Bangladesh</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-blue-100 sm:text-xl">
            Discover the most exclusive properties, apartments, and land tailored to your lifestyle and budget.
          </p>
          
          <form action="/search" method="GET" className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl bg-white/10 p-3 shadow-xl backdrop-blur-md sm:flex-row">
            <input
              type="text"
              name="location"
              placeholder="Search by city, neighborhood, or address..."
              className="w-full flex-1 rounded-xl border-none bg-white px-5 py-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-4 font-bold tracking-wide text-white shadow-md transition-all hover:bg-blue-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Listings */}
      {listings.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Listings</h2>
              <p className="mt-2 text-gray-600">Hand-picked premium properties just for you.</p>
            </div>
            <Link href="/search" className="hidden font-medium text-blue-600 hover:text-blue-700 hover:underline sm:block">
              View all properties &rarr;
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {listings.slice(0, 4).map((p) => (
              <PropertyCard key={p.id} property={p} imageUrl={imageMap[p.id]} />
            ))}
          </div>
          <Link href="/search" className="mt-8 block w-full rounded-xl bg-blue-50 py-3 text-center font-medium text-blue-600 transition-colors hover:bg-blue-100 sm:hidden">
            View all properties
          </Link>
        </section>
      )}

      {/* Map Section */}
      {markers.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Explore Interactive Map</h2>
              <p className="mt-2 text-gray-600">Browse properties by visualizing their exact coordinates and neighborhoods.</p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-xl">
              <MapWrapper markers={markers} className="h-[500px] w-full" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
