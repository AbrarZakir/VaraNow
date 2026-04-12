"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createListingAction, type CreateListingState } from "@/app/actions/listing";

const initialState: CreateListingState = {};

export default function CreateListingForm() {
  const [state, formAction] = useFormState(createListingAction, initialState);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  function addImageField() {
    setImageUrls((prev) => [...prev, ""]);
  }

  function removeImageField(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function updateImageUrl(index: number, value: string) {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="latitude" className="mb-1 block text-sm font-medium">
            Latitude
          </label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            required
            defaultValue={23.8103}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="longitude" className="mb-1 block text-sm font-medium">
            Longitude
          </label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            required
            defaultValue={90.4125}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Default: Dhaka. You can change or add a map picker later.
      </p>
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
      <div>
        <label className="mb-1 block text-sm font-medium">
          Image URLs
        </label>
        <div className="space-y-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                name="image_urls"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => updateImageUrl(index, e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="rounded border border-gray-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImageField}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Add another image
        </button>
      </div>
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Create listing
      </button>
    </form>
  );
}
