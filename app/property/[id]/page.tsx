import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPropertyDetailAction } from "@/app/actions/property";
import { isBookmarkedAction } from "@/app/actions/bookmark";
import PropertyGallery from "@/components/property/PropertyGallery";
import BookmarkButton from "@/components/property/BookmarkButton";

interface PropertyPageProps {
  params: { id: string };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { data, error } = await getPropertyDetailAction(params.id);
  if (error || !data) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookmarked } = await isBookmarkedAction(params.id);

  const { property, images, owner } = data;
  const price = Number(property.price).toLocaleString();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {property.title}
          </h1>
          <p className="text-gray-600">{property.address}</p>
        </div>
        <BookmarkButton
          propertyId={property.id}
          initialBookmarked={bookmarked}
          isAuthenticated={!!user}
        />
      </div>

      <div className="mb-6">
        <PropertyGallery images={images} title={property.title} />
      </div>

      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <span className="rounded bg-gray-100 px-2 py-1 font-medium">
          {property.type}
        </span>
        <span className="rounded bg-gray-100 px-2 py-1">
          {property.category}
        </span>
        <span className="font-semibold text-gray-900">BDT {price}</span>
        <span>{property.area_sqft} sq ft</span>
        <span>{property.bedrooms} bed</span>
        <span>{property.bathrooms} bath</span>
      </div>

      {owner && (
        <p className="mb-4 text-sm text-gray-600">
          Listed by {owner.full_name}
        </p>
      )}

      <div className="mb-6">
        <h2 className="mb-2 font-semibold">Description</h2>
        <p className="whitespace-pre-wrap text-gray-700">
          {property.description || "No description."}
        </p>
      </div>

      <div className="flex gap-3">
        <a
          href={`/api/properties/${params.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Download PDF
        </a>
        <Link
          href="/search"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to search
        </Link>
      </div>
    </div>
  );
}
