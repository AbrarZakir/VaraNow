import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md">
            V
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            VaraNow
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/search" className="text-gray-600 transition-colors hover:text-blue-600">
            Explore Properties
          </Link>
          <Link href="/dashboard" className="text-gray-600 transition-colors hover:text-blue-600">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-black hover:shadow-md"
          >
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
}
