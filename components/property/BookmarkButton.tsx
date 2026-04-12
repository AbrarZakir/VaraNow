"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBookmarkAction, removeBookmarkAction } from "@/app/actions/bookmark";

interface BookmarkButtonProps {
  propertyId: string;
  initialBookmarked: boolean;
  isAuthenticated: boolean;
}

export default function BookmarkButton({
  propertyId,
  initialBookmarked,
  isAuthenticated,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/property/${propertyId}`);
      return;
    }

    setLoading(true);
    if (bookmarked) {
      const { error } = await removeBookmarkAction(propertyId);
      if (!error) setBookmarked(false);
    } else {
      const { error } = await addBookmarkAction(propertyId);
      if (!error) setBookmarked(true);
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      aria-pressed={bookmarked}
    >
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
