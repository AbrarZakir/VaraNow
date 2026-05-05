"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteListingAction } from "@/app/actions/property";

interface Props {
  propertyId: string;
  redirectTo?: string;
}

export default function DeleteListingButton({ propertyId, redirectTo }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;
    startTransition(async () => {
      const { error } = await deleteListingAction(propertyId);
      if (error) {
        alert(error);
      } else if (redirectTo) {
        router.push(redirectTo);
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 hover:shadow disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete Listing"}
    </button>
  );
}
