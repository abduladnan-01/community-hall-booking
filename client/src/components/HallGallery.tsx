import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, X, ChevronLeft, ChevronRight, Maximize2, Layers } from 'lucide-react';
import { Hall } from '../types';

interface GalleryItem {
  id: number;
  category: string;
  hallName: string;
  imageUrl: string;
  hallSlug?: string;
  filterTag: string;
}

interface HallGalleryProps {
  onViewHallBySlug: (slug: string) => void;
  halls: Hall[];
}

export const HallGallery: React.FC<HallGalleryProps> = ({ onViewHallBySlug, halls }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [slideDirection, setSlideDirection] = useState<number>(1);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      category: 'Main Community Hall Interior',
      hallName: 'The Grand Assembly & Vaulted Ceiling',
      imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'main-hall',
      filterTag: 'Main Hall'
    },
    {
      id: 2,
      category: 'Wedding Hall with Decorated Stage',
      hallName: 'Bridal Pavilion & Staged Elegance',
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'main-hall',
      filterTag: 'Weddings'
    },
    {
      id: 3,
      category: 'Meeting Room with Conference Tables',
      hallName: 'Executive Strategy & Seminar Suite',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'meeting-room',
      filterTag: 'Meetings'
    },
    {
      id: 4,
      category: 'Function Hall with Banquet Seating',
      hallName: 'Riverside Terrace & Banquet Suite',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'function-hall',
      filterTag: 'Celebrations'
    },
    {
      id: 5,
      category: 'Community Hall Exterior',
      hallName: 'Illuminated Heritage Grounds & Gardens',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'main-hall',
      filterTag: 'Exterior'
    },
    {
      id: 6,
      category: 'Hall with Catering Facilities',
      hallName: 'Commercial Culinary & Prep Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      hallSlug: 'function-hall',
      filterTag: 'Dining & Kitchen'
    }
  ];

  const filterTabs = ['All', 'Main Hall', 'Weddings', 'Meetings', 'Celebrations', 'Exterior', 'Dining & Kitchen'];

  const filteredItems = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.filterTag === activeFilter);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedImageIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, filteredItems.length]);

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setSlideDirection(1);
    setSelectedImageIndex((selectedImageIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setSlideDirection(-1);
    setSelectedImageIndex((selectedImageIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#0d141d]/60 border-y border-border/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#590907]/90 border border-[#E8D2B5]/50 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5]" />
            <span className="label-tag text-[#E8D2B5] font-semibold">
              VISUAL SHOWCASE & TOURS
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white tracking-tight">
            Hall Gallery & Spaces
          </h2>

          <p className="text-[#A5A79B] text-sm sm:text-base font-light">
            Explore the distinctive architecture, bespoke settings, and versatile arrangements across our historic hall.
          </p>
        </div>

        {/* Moving Filter Pills Navigation with Animated Background Slider */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === tab
                  ? 'text-[#0e1620]'
                  : 'text-[#E8D2B5] hover:text-white bg-surface/70 border border-[#A5A79B]/30'
              }`}
            >
              {activeFilter === tab && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 rounded-full bg-accent shadow-lg shadow-accent/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* Masonry-Style Layout on Desktop / Single Column on Mobile */}
        <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-border bg-surface cursor-pointer shadow-lg hover:border-[#E8D2B5]/60 transition-all duration-500 hover:-translate-y-1.5"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1620] via-[#0e1620]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none" />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <div className="flex justify-end">
                      <span className="p-2.5 rounded-full bg-[#0e1620]/80 backdrop-blur-md border border-[#E8D2B5]/40 text-[#E8D2B5] shadow-lg">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="space-y-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="label-tag text-accent font-semibold block">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-headline font-bold text-white leading-snug">
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
                          className="py-1.5 px-3.5 rounded bg-accent text-[#0e1620] text-xs font-bold uppercase tracking-wider hover:bg-[#e4b74b] transition-all flex items-center gap-1.5 shadow-md transform active:scale-95"
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
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen Interactive Lightbox Modal with Slides */}
      <AnimatePresence>
        {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-lg"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-surface border border-[#E8D2B5]/40 text-[#E8D2B5] hover:text-white hover:bg-[#590907] z-30 transition-all shadow-xl"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Slide button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-surface/90 border border-[#E8D2B5]/40 text-[#E8D2B5] hover:bg-[#590907] z-30 transition-all shadow-2xl active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Slide button */}
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-surface/90 border border-[#E8D2B5]/40 text-[#E8D2B5] hover:bg-[#590907] z-30 transition-all shadow-2xl active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Sliding Image Container */}
            <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center relative z-20">
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={selectedImageIndex}
                  custom={slideDirection}
                  initial={{ opacity: 0, x: slideDirection > 0 ? 120 : -120 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection > 0 ? -120 : 120 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex flex-col items-center"
                >
                  <img
                    src={filteredItems[selectedImageIndex].imageUrl}
                    alt={filteredItems[selectedImageIndex].category}
                    className="max-h-[68vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-[#E8D2B5]/40"
                  />

                  <div className="mt-5 text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="label-tag text-accent font-semibold">
                        {filteredItems[selectedImageIndex].category}
                      </span>
                      <span className="text-xs text-[#A5A79B] font-mono">
                        ({selectedImageIndex + 1} of {filteredItems.length})
                      </span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-headline text-white font-bold">
                      {filteredItems[selectedImageIndex].hallName}
                    </h4>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
