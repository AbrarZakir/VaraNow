import { getSavedListAction } from "@/app/actions/bookmark";
import PropertyCard from "@/components/property/PropertyCard";
import Pagination from "@/components/layout/Pagination";

const PAGE_SIZE = 12;

interface SavedPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SavedPage({ searchParams }: SavedPageProps) {
  const page =
    typeof searchParams.page === "string"
      ? Math.max(1, Number(searchParams.page))
      : 1;
  const offset = (page - 1) * PAGE_SIZE;

  const { data: saved, count, error } = await getSavedListAction({
    limit: PAGE_SIZE,
    offset,
  });
  const list = saved ?? [];
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

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
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(({ property }) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/dashboard/saved"
          />
        </>
      )}
    </div>
  );
}
