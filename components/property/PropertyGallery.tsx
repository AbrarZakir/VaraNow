import type { PropertyImage } from "@/types";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="relative flex aspect-[21/9] w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-overlay">
           <svg className="h-32 w-32 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <p className="relative z-10 text-lg font-medium tracking-tight text-indigo-900/60">
          No facility images provided
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-200">
        <img
          src={images[0].url}
          alt={title}
          className="aspect-[21/9] w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(1, 5).map((img) => (
            <div key={img.id} className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <img
                src={img.url}
                alt=""
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
