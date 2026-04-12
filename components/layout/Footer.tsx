import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 py-12 text-sm text-gray-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
        <div className="flex flex-col items-start space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md">
              V
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              VaraNow
            </span>
          </Link>
          <p className="leading-relaxed">
            The premier marketplace to find, rent, and list your next dream property across Bangladesh.
          </p>
        </div>
        
        <div>
          <h4 className="mb-4 font-semibold text-white">Explore</h4>
          <ul className="space-y-3">
            <li><Link href="/search?type=buy" className="hover:text-blue-400 transition-colors">Buy a Property</Link></li>
            <li><Link href="/search?type=rent" className="hover:text-blue-400 transition-colors">Rent a Property</Link></li>
            <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">My Dashboard</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="mb-4 font-semibold text-white">Company</h4>
           <ul className="space-y-3">
             <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
             <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
             <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact</Link></li>
           </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Legal</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="mx-auto mt-12 max-w-7xl border-t border-gray-800 px-6 pt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} VaraNow. All rights reserved.
      </div>
    </footer>
  );
}
