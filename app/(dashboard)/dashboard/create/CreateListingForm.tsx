"use client";

import { useState, useRef } from "react";
import { useFormState } from "react-dom";
import dynamic from "next/dynamic";
import { createListingAction, type CreateListingState } from "@/app/actions/listing";

const LocationPicker = dynamic(() => import("@/components/layout/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-xl bg-gray-100" />
  ),
});

const initialState: CreateListingState = {};

interface UploadedImage {
  url: string;
  preview: string;
  name: string;
}

export default function CreateListingForm() {
  const [state, formAction] = useFormState(createListingAction, initialState);
  const [lat, setLat] = useState(23.8103);
  const [lng, setLng] = useState(90.4125);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setUploadError(data.error || "Upload failed");
          continue;
        }
        setUploadedImages((prev) => [
          ...prev,
          {
            url: data.url,
            preview: URL.createObjectURL(file),
            name: file.name,
          },
        ]);
      } catch {
        setUploadError("Network error during upload");
      }
    }
    setUploading(false);
    // Reset file input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {state?.error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="price" className="mb-1 block text-sm font-medium">
          Price (BDT)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min={0}
          required
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="address" className="mb-1 block text-sm font-medium">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">
          Property Location
        </label>
        <LocationPicker lat={lat} lng={lng} onChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
        <input type="hidden" name="latitude" value={lat} />
        <input type="hidden" name="longitude" value={lng} />
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Latitude</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Longitude</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
              className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-700"
            />
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="area_sqft" className="mb-1 block text-sm font-medium">
            Area (sq ft)
          </label>
          <input
            id="area_sqft"
            name="area_sqft"
            type="number"
            min={0}
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="bedrooms" className="mb-1 block text-sm font-medium">
            Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={0}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="bathrooms" className="mb-1 block text-sm font-medium">
            Bathrooms
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min={0}
            defaultValue={0}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Property Photos
        </label>
        <div
          className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <svg className="mx-auto mb-2 h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium text-gray-600">
            {uploading ? "Uploading..." : "Click to upload photos"}
          </p>
          <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP or GIF • Max 5MB each</p>
        </div>

        {uploadError && (
          <p className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">{uploadError}</p>
        )}

        {/* Previews */}
        {uploadedImages.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {uploadedImages.map((img, i) => (
              <div key={i} className="group relative overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <img
                  src={img.preview}
                  alt={img.name}
                  className="aspect-[4/3] w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-0 shadow transition group-hover:opacity-100"
                >
                  ✕
                </button>
                {/* Hidden input to submit the uploaded URL */}
                <input type="hidden" name="image_urls" value={img.url} />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading images..." : "Create listing"}
      </button>
    </form>
  );
}
