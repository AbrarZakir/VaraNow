import Link from "next/link";
import { getMyListingsAction } from "@/app/actions/property";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyCardOwnerMenu from "@/components/property/PropertyCardOwnerMenu";
import Pagination from "@/components/layout/Pagination";

const PAGE_SIZE = 12;

interface ListingsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const page =
    typeof searchParams.page === "string"
      ? Math.max(1, Number(searchParams.page))
      : 1;
  const offset = (page - 1) * PAGE_SIZE;

  const { data: listings, count, error, imageMap } = await getMyListingsAction({
    limit: PAGE_SIZE,
    offset,
  });
  const properties = listings ?? [];
  const images = imageMap ?? {};
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

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
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCardOwnerMenu key={p.id} propertyId={p.id}>
                <PropertyCard property={p} imageUrl={images[p.id]} />
              </PropertyCardOwnerMenu>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/dashboard/listings"
          />
        </>
      )}
    </div>
  );
}
