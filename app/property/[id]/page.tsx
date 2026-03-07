import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyDetailAction } from "@/app/actions/property";
import { isBookmarkedAction } from "@/app/actions/bookmark";
import PropertyGallery from "@/components/property/PropertyGallery";
import BookmarkButton from "@/components/property/BookmarkButton";
import RentEstimateWidget from "@/components/property/RentEstimateWidget";
import NearbyLandmarks from "@/components/property/NearbyLandmarks";

interface PropertyPageProps {
  params: { id: string };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { data, error } = await getPropertyDetailAction(params.id);
  if (error || !data) notFound();

  const { data: bookmarked } = await isBookmarkedAction(params.id);

  const { property, images, owner } = data;
  const price = Number(property.price).toLocaleString();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      
      {/* Title Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
           <div className="mb-2 flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              For {property.type}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              {property.category}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            {property.title}
          </h1>
          <p className="mt-2 flex items-center text-lg text-gray-500">
             <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.address}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <p className="text-3xl font-extrabold text-blue-700">
            <span className="text-xl font-bold text-gray-400">৳</span> {price}
          </p>
          <div className="mt-4 flex gap-3">
             <a
              href={`/api/properties/${params.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow"
            >
              Export PDF
            </a>
            <BookmarkButton propertyId={property.id} initialBookmarked={bookmarked} />
          </div>
        </div>
      </div>

      {/* Hero Gallery */}
      <div className="mb-12">
        <PropertyGallery images={images} title={property.title} />
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Quick Metrics */}
          <section className="grid grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center p-6 text-center">
               <span className="mb-1 text-3xl font-bold text-gray-900">{property.bedrooms}</span>
               <span className="text-sm font-medium uppercase tracking-wider text-gray-500">Bedrooms</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 text-center">
               <span className="mb-1 text-3xl font-bold text-gray-900">{property.bathrooms}</span>
               <span className="text-sm font-medium uppercase tracking-wider text-gray-500">Bathrooms</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 text-center">
               <span className="mb-1 text-3xl font-bold text-gray-900">{property.area_sqft}</span>
               <span className="text-sm font-medium uppercase tracking-wider text-gray-500">Square Feet</span>
            </div>
          </section>

          {/* Description */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">About this property</h2>
            <div className="rounded-2xl bg-white p-8 border border-gray-100 shadow-sm">
               <p className="whitespace-pre-wrap leading-relaxed text-gray-600">
                {property.description || "No description provided."}
               </p>
               {owner && (
                <div className="mt-8 flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-sm">
                    {owner.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Listed Exclusively By</p>
                    <p className="text-lg font-semibold text-blue-700">{owner.full_name}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Widgets */}
        <div className="space-y-6 lg:col-span-1">
          <div className="sticky top-[100px] space-y-6">
            <RentEstimateWidget
              areaSqft={property.area_sqft}
              latitude={property.latitude}
              longitude={property.longitude}
              propertyType={property.type}
            />
            <NearbyLandmarks
              latitude={property.latitude}
              longitude={property.longitude}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
