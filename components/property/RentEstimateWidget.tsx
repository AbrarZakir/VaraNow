import { getRentEstimateAction } from "@/app/actions/rent-estimate";

interface Props {
  areaSqft: number;
  latitude: number;
  longitude: number;
  propertyType: string;
}

export default async function RentEstimateWidget({
  areaSqft,
  latitude,
  longitude,
  propertyType,
}: Props) {
  // Fetch estimation based on geographic coordinates
  const { data, error } = await getRentEstimateAction({
    area_sqft: areaSqft,
    latitude,
    longitude,
  });

  if (error || !data || data.count === 0) {
    return (
      <div className="rounded border border-gray-200 bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-900">Area Rent Estimate</h3>
        <p className="text-sm text-gray-500">
          Not enough data in this area (within 5km) to provide an accurate rent estimate right now.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded border border-blue-200 bg-blue-50 p-4">
      <h3 className="mb-2 font-semibold text-blue-900">Area Rent Estimate</h3>
      <p className="mb-3 text-sm text-blue-800">
        Based on <strong>{data.count}</strong> recently listed rentals within a 5km radius:
      </p>
      <div className="flex flex-wrap gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Average
          </p>
          <p className="text-lg font-medium text-gray-900">
            BDT {Math.round(data.average).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Min
          </p>
          <p className="text-lg font-medium text-gray-900">
            BDT {data.min.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Max
          </p>
          <p className="text-lg font-medium text-gray-900">
            BDT {data.max.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
