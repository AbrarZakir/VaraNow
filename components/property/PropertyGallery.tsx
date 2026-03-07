import type { PropertyImage } from "@/types";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        No images
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-lg bg-gray-100">
        <img
          src={images[0].url}
          alt={title}
          className="h-auto w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(1, 5).map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt=""
              className="aspect-video rounded object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
