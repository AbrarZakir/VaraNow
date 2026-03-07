import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex gap-4">
          <Link href="/dashboard" className="font-medium">
            Dashboard
          </Link>
          <Link href="/dashboard/listings">My Listings</Link>
          <Link href="/dashboard/saved">Saved</Link>
          <Link href="/dashboard/create">Create Listing</Link>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="text-sm text-gray-600 underline">
            Sign out
          </button>
        </form>
      </nav>
      <div className="p-4">{children}</div>
    </section>
  );
}
