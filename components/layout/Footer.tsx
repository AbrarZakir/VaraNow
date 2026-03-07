import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-600">
        <Link href="/" className="font-semibold text-gray-900">
          VaraNow
        </Link>
        <span className="mx-2">—</span>
        Bangladesh Property Marketplace
      </div>
    </footer>
  );
}
