import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface BookingCTAProps {
  onCheckAvailability: () => void;
}

export const BookingCTA: React.FC<BookingCTAProps> = ({ onCheckAvailability }) => {
  return (
    <section className="relative py-20 bg-gradient-to-r from-[#c59a35] via-[#dca545] to-[#c59a35] text-[#0e1620] overflow-hidden shadow-2xl">
      {/* Background Subtle Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Top Pill in Deep Burgundy & Warm Cream */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#590907] border border-[#E8D2B5]/60 text-[#E8D2B5] font-semibold text-[10px] uppercase tracking-[0.16em] shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5]" />
            <span>RESERVE YOUR DATE TODAY</span>
          </div>

          {/* Headline: Cormorant Garamond, italic, 700 weight */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-headline font-bold text-[#0e1620] tracking-tight">
            Plan Your Next Event With Us.
          </h2>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#1f2937] font-medium leading-relaxed">
            Find the perfect space for your celebration, meeting, or community gathering.
          </p>

          {/* Button: Check Availability → with Deep Burgundy & Warm Cream */}
          <div className="pt-2">
            <button
              onClick={onCheckAvailability}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-lg bg-[#590907] text-[#E8D2B5] hover:bg-[#781512] border border-[#E8D2B5]/40 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all transform active:scale-95 shadow-2xl group"
            >
              <span>Check Availability</span>
              <ArrowRight className="w-4 h-4 text-[#E8D2B5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Below the button in Muted Sage Gray & Deep Charcoal */}
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#343d35] pt-2">
            Flexible Booking · Affordable Rates · Modern Facilities
          </p>
        </motion.div>
      </div>
    </section>
  );
};

