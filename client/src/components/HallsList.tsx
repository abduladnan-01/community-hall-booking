import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Sparkles, Check, ArrowRight, Eye, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { Hall } from '../types';

interface HallsListProps {
  halls: Hall[];
  isLoading: boolean;
  onViewDetails: (hall: Hall) => void;
  onBookHall: (hall: Hall) => void;
}

const HallCard: React.FC<{
  hall: Hall;
  idx: number;
  onViewDetails: (hall: Hall) => void;
  onBookHall: (hall: Hall) => void;
}> = ({ hall, idx, onViewDetails, onBookHall }) => {
  // Extract all available slides for this hall
  const allImages = Array.from(
    new Set([hall.image_url, ...(hall.gallery && hall.gallery.length > 0 ? hall.gallery : [])])
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection(1);
    setActiveImageIdx((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection(-1);
    setActiveImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.15 }}
      whileHover={{ y: -6 }}
      className="group bg-surface rounded-2xl border border-border overflow-hidden hover:border-[#E8D2B5]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#590907]/20 flex flex-col"
    >
      {/* Hall Image with Interactive Mini Slides */}
      <div className="relative h-64 overflow-hidden bg-background">
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.img
            key={activeImageIdx}
            src={allImages[activeImageIdx]}
            alt={`${hall.name} angle ${activeImageIdx + 1}`}
            custom={slideDirection}
            initial={{ opacity: 0, x: slideDirection > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection > 0 ? -50 : 50 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30 pointer-events-none" />

        {/* Previous & Next Mini Slide Arrows (Visible on multiple photos) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous hall photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0e1620]/80 hover:bg-[#590907] border border-[#E8D2B5]/40 text-[#E8D2B5] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg backdrop-blur-sm z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next hall photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0e1620]/80 hover:bg-[#590907] border border-[#E8D2B5]/40 text-[#E8D2B5] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg backdrop-blur-sm z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Slide Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-[#0e1620]/70 px-2 py-1 rounded-full backdrop-blur-sm">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlideDirection(i > activeImageIdx ? 1 : -1);
                    setActiveImageIdx(i);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === activeImageIdx ? 'w-4 bg-accent' : 'bg-[#A5A79B]/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Capacity Badge */}
        <div className="absolute top-4 left-4 bg-[#0e1620]/85 backdrop-blur-md border border-[#A5A79B]/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md z-10">
          <Users className="w-3.5 h-3.5 text-[#E8D2B5]" />
          <span className="text-xs font-medium text-[#E8D2B5]">{hall.capacity} Guests</span>
        </div>

        {/* Flagship Badge */}
        {hall.name === 'Main Hall' && (
          <div className="absolute top-4 right-4 bg-[#590907] border border-[#E8D2B5]/50 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider text-[#E8D2B5] shadow-md z-10">
            Heritage Ballroom
          </div>
        )}

        {/* Price Tag with Warm Cream & Gold accent */}
        <div className="absolute bottom-4 right-4 bg-[#0e1620]/95 backdrop-blur-md border border-[#E8D2B5]/50 px-3.5 py-1.5 rounded-lg shadow-lg z-10">
          <span className="text-[10px] uppercase tracking-wider text-[#A5A79B] block -mb-1">From</span>
          <span className="text-base font-bold text-[#E8D2B5]">₹{hall.price_per_session.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-[#A5A79B] ml-1">/ session</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          <div>
            <span className="label-tag text-[#E8D2B5] font-semibold block mb-1">
              {hall.suitable_for}
            </span>
            <h3 className="text-2xl font-headline font-bold text-white group-hover:text-[#E8D2B5] transition-colors">
              {hall.name}
            </h3>
          </div>

          <p className="text-[#A5A79B] text-xs leading-relaxed line-clamp-2 font-light">
            {hall.short_description || hall.description}
          </p>

          {/* Facilities Chips in Muted Sage Gray & Cream */}
          <div className="pt-2">
            <div className="label-tag text-[#A5A79B] mb-2">Key Facilities</div>
            <div className="flex flex-wrap gap-1.5">
              {hall.facilities.slice(0, 4).map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-raised border border-[#A5A79B]/30 text-[11px] text-[#E8D2B5]"
                >
                  <Check className="w-3 h-3 text-[#A5A79B]" />
                  <span>{f}</span>
                </span>
              ))}
              {hall.facilities.length > 4 && (
                <span className="text-[11px] text-[#A5A79B] self-center px-1">
                  +{hall.facilities.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-4 border-t border-border/60 grid grid-cols-2 gap-3">
          <button
            onClick={() => onViewDetails(hall)}
            className="w-full py-2.5 px-3 rounded-md bg-surface-raised hover:bg-surface-raised/80 border border-border hover:border-accent/40 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            <span>View Details</span>
          </button>

          <button
            onClick={() => onBookHall(hall)}
            className="w-full py-2.5 px-3 rounded-md bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 transform active:scale-95 group-hover:shadow-lg group-hover:shadow-accent/20"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const HallsList: React.FC<HallsListProps> = ({
  halls,
  isLoading,
  onViewDetails,
  onBookHall
}) => {
  return (
    <section id="halls" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#590907]/90 border border-[#E8D2B5]/50 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5]" />
            <span className="label-tag text-[#E8D2B5] font-semibold">
              PREMIER VENUES
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white tracking-tight">
            Available Halls & Suites
          </h2>

          <p className="text-[#A5A79B] text-sm sm:text-base font-light">
            Elegantly proportioned spaces designed for community milestones, executive gatherings, and memorable celebrations. Slide photos on each card to explore.
          </p>
        </div>

        {/* Halls Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface rounded-2xl border border-border h-[480px] animate-pulse" />
            ))}
          </div>
        ) : halls.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border">
            <ShieldAlert className="w-10 h-10 text-accent mx-auto mb-3" />
            <p className="text-foreground">No halls currently available. Please check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {halls.map((hall, idx) => (
              <HallCard
                key={hall.id}
                hall={hall}
                idx={idx}
                onViewDetails={onViewDetails}
                onBookHall={onBookHall}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
