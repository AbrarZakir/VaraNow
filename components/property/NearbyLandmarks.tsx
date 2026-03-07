import { getDistance } from "@/lib/utils/distance";

// Mock database of major landmarks
const MOCK_LANDMARKS = [
  { id: "1", name: "Central Metro Station", type: "Transit", lat: 23.8105, lng: 90.4126 },
  { id: "2", name: "City Hospital", type: "Health", lat: 23.8153, lng: 90.4195 },
  { id: "3", name: "International School", type: "Education", lat: 23.8012, lng: 90.4031 },
  { id: "4", name: "Downtown Mall", type: "Shopping", lat: 23.8201, lng: 90.4255 },
  { id: "5", name: "National University", type: "Education", lat: 23.7933, lng: 90.4077 },
];

interface Props {
  latitude: number;
  longitude: number;
}

export default function NearbyLandmarks({ latitude, longitude }: Props) {
  // Calculate distance for each mock landmark
  const landmarksWithDistance = MOCK_LANDMARKS.map((landmark) => {
    const distanceKm = getDistance(latitude, longitude, landmark.lat, landmark.lng);
    return { ...landmark, distanceKm };
  })
    // Filter to landmarks within a realistic radius (e.g. 10km)
    .filter((l) => l.distanceKm <= 10)
    // Sort by closest
    .sort((a, b) => a.distanceKm - b.distanceKm)
    // Only show top 3 closest
    .slice(0, 3);

  if (landmarksWithDistance.length === 0) {
    return null; // Don't render if nothing is nearby
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <h3 className="mb-3 font-semibold text-gray-900">Nearby Essentials</h3>
      <ul className="space-y-3">
        {landmarksWithDistance.map((landmark) => (
          <li key={landmark.id} className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{landmark.name}</span>
              <span className="text-sm font-semibold text-gray-900">
                {landmark.distanceKm < 1
                  ? `${Math.round(landmark.distanceKm * 1000)} m`
                  : `${landmark.distanceKm.toFixed(1)} km`}
              </span>
            </div>
            <span className="text-xs text-gray-500">{landmark.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
