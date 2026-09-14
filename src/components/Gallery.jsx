import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { fileUrl } from '../services/api.js';

/**
 * Photo/video gallery grid with lightbox viewer.
 * items: [{ _id, title, image, videoUrl, type, description }]
 */
export default function Gallery({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % items.length);
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeIndex, items.length]);

  if (!items.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={item._id || i}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-navy-50 focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-label={`View ${item.title}`}
          >
            {item.type === 'video' ? (
              <div className="flex h-full w-full items-center justify-center bg-navy-900">
                <Play className="h-10 w-10 text-white" />
              </div>
            ) : (
              <img
                src={fileUrl(item.image)}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-3 pt-8 text-left">
              <p className="text-xs font-semibold text-white">{item.title}</p>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && items[activeIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 p-4" role="dialog" aria-modal="true" aria-label={items[activeIndex].title}>
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setActiveIndex(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setActiveIndex((activeIndex - 1 + items.length) % items.length)}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="max-h-[85vh] max-w-5xl">
            {items[activeIndex].type === 'video' && items[activeIndex].videoUrl ? (
              <iframe
                src={items[activeIndex].videoUrl}
                title={items[activeIndex].title}
                className="aspect-video w-full rounded-lg"
                allowFullScreen
              />
            ) : (
              <img src={fileUrl(items[activeIndex].image)} alt={items[activeIndex].title} className="max-h-[85vh] rounded-lg object-contain" />
            )}
            <p className="mt-3 text-center text-white">{items[activeIndex].title}</p>
            {items[activeIndex].description && <p className="mt-1 text-center text-sm text-navy-200">{items[activeIndex].description}</p>}
          </div>
          <button
            className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setActiveIndex((activeIndex + 1) % items.length)}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
