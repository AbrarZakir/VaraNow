import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-gray-900">
          VaraNow
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/search" className="text-gray-600 hover:text-gray-900">
            Search
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}
