import Link from "next/link";
import { getMyListingsAction } from "@/app/actions/property";
import { getSavedListAction } from "@/app/actions/bookmark";
import { getNotificationsAction } from "@/app/actions/notification";
import PropertyCard from "@/components/property/PropertyCard";

export default async function DashboardPage() {
  const [listingsResult, savedResult, notificationsResult] = await Promise.all([
    getMyListingsAction(),
    getSavedListAction(),
    getNotificationsAction({ limit: 5 }),
  ]);

  const myListings = listingsResult.data ?? [];
  const saved = savedResult.data ?? [];
  const notifications = notificationsResult.data ?? [];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Dashboard</h1>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <section>
          <h2 className="mb-3 font-medium">
            <Link href="/dashboard/listings" className="hover:underline">
              My Listings
            </Link>
          </h2>
          <p className="text-sm text-gray-600">
            {myListings.length} {myListings.length === 1 ? "listing" : "listings"}.
          </p>
          <Link
            href="/dashboard/create"
            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
          >
            Create listing →
          </Link>
        </section>
        <section>
          <h2 className="mb-3 font-medium">
            <Link href="/dashboard/saved" className="hover:underline">
              Saved
            </Link>
          </h2>
          <p className="text-sm text-gray-600">
            {saved.length} saved {saved.length === 1 ? "property" : "properties"}.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-medium">Notifications</h2>
          <p className="text-sm text-gray-600">
            {notifications.filter((n) => !n.read_at).length} unread.
          </p>
          {notifications.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm">
              {notifications.slice(0, 3).map((n) => (
                <li
                  key={n.id}
                  className={n.read_at ? "text-gray-500" : "font-medium"}
                >
                  {n.title}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {myListings.length > 0 && (
        <section>
          <h2 className="mb-3 font-medium">Your listings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {myListings.slice(0, 4).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          {myListings.length > 4 && (
            <Link
              href="/dashboard/listings"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              View all →
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
