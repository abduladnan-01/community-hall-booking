import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Hall } from '../types';

interface GalleryItem {
  id: number;
  category: string;
  hallName: string;
  imageUrl: string;
  hallSlug?: string;
}

interface HallGalleryProps {
  onViewHallBySlug: (slug: string) => void;
  halls: Hall[];
}

export const HallGallery: React.FC<HallGalleryProps> = ({ onViewHallBySlug, halls }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      category: 'Main Community Hall Interior',
      hallName: 'The Grand Assembly & Vaulted Ceiling',
      imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'main-hall'
    },
    {
      id: 2,
      category: 'Wedding Hall with Decorated Stage',
      hallName: 'Bridal Pavilion & Staged Elegance',
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'main-hall'
    },
    {
      id: 3,
      category: 'Meeting Room with Conference Tables',
      hallName: 'Executive Strategy & Seminar Suite',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'meeting-room'
    },
    {
      id: 4,
      category: 'Function Hall with Banquet Seating',
      hallName: 'Riverside Terrace & Banquet Suite',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'function-hall'
    },
    {
      id: 5,
      category: 'Community Hall Exterior',
      hallName: 'Illuminated Heritage Grounds & Gardens',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'main-hall'
    },
    {
      id: 6,
      category: 'Hall with Catering Facilities',
      hallName: 'Commercial Culinary & Prep Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'function-hall'
    }
  ];

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % galleryItems.length);
  };

  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#0d141d]/60 border-y border-border/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-accent/30 shadow-sm">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="label-tag text-accent font-semibold">
              VISUAL SHOWCASE
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white tracking-tight">
            Hall Gallery & Spaces
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base font-light">
            Explore the distinctive architecture, bespoke settings, and versatile arrangements across our historic hall.
          </p>
        </div>

        {/* Masonry-Style Layout on Desktop / Single Column on Mobile */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="break-inside-avoid group relative rounded-xl overflow-hidden border border-border bg-surface cursor-pointer shadow-lg hover:border-accent/60 transition-all duration-500"
              onClick={() => setSelectedImageIndex(idx)}
            >
              {/* Image with zoom transition */}
              <div className="relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.category}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Dark Overlay with smooth opacity transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1620] via-[#0e1620]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />

                {/* Overlay Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-full bg-background/80 backdrop-blur-md border border-border text-accent">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="space-y-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="label-tag text-accent block">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-headline font-bold text-white">
                      {item.hallName}
                    </h3>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.hallSlug) {
                            onViewHallBySlug(item.hallSlug);
                          } else {
                            setSelectedImageIndex(idx);
                          }
                        }}
                        className="py-1.5 px-3 rounded bg-accent text-[#0e1620] text-xs font-bold uppercase tracking-wider hover:bg-[#e4b74b] transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-surface border border-border text-muted-foreground hover:text-white z-20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface/80 border border-border text-white hover:border-accent z-20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface/80 border border-border text-white hover:border-accent z-20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content */}
            <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center">
              <img
                src={galleryItems[selectedImageIndex].imageUrl}
                alt={galleryItems[selectedImageIndex].category}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl border border-border"
              />
              <div className="mt-4 text-center">
                <span className="label-tag text-accent font-semibold block mb-1">
                  {galleryItems[selectedImageIndex].category}
                </span>
                <h4 className="text-xl font-headline text-white font-bold">
                  {galleryItems[selectedImageIndex].hallName}
                </h4>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

