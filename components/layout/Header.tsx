import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ChatNotification from "@/components/chat/ChatNotification";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          {user && (
            <Link href="/dashboard" className="text-gray-600 transition-colors hover:text-blue-600">
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <ChatNotification />
              <Link
                href="/dashboard"
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-black hover:shadow-md"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-black hover:shadow-md"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
