import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface BookingCTAProps {
  onCheckAvailability: () => void;
}

export const BookingCTA: React.FC<BookingCTAProps> = ({ onCheckAvailability }) => {
  return (
    <section className="relative py-20 bg-gradient-to-r from-[#c59a35] via-[#e5b34f] to-[#c59a35] text-[#0e1620] overflow-hidden shadow-2xl">
      {/* Background Subtle Moving Radial Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Moving Shimmer Beam across the gold section */}
      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer pointer-events-none" />

      {/* Decorative Floating Sparkle Orbs */}
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 left-12 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 10, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-6 right-16 w-32 h-32 bg-[#590907]/15 rounded-full blur-2xl pointer-events-none"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          {/* Top Pill in Deep Burgundy & Warm Cream with subtle bounce */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#590907] border border-[#E8D2B5]/60 text-[#E8D2B5] font-semibold text-[10px] uppercase tracking-[0.16em] shadow-lg shadow-[#590907]/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5] animate-spin" style={{ animationDuration: '8s' }} />
            <span>RESERVE YOUR DATE TODAY</span>
          </motion.div>

          {/* Headline: Cormorant Garamond, italic, 700 weight */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-headline font-bold text-[#0e1620] tracking-tight">
            Plan Your Next Event With Us.
          </h2>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#1f2937] font-medium leading-relaxed">
            Find the perfect space for your celebration, meeting, or community gathering.
          </p>

          {/* Button: Check Availability with Deep Burgundy & Warm Cream */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCheckAvailability}
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-xl bg-[#590907] text-[#E8D2B5] hover:bg-[#781512] border border-[#E8D2B5]/50 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-2xl group"
            >
              <span>Check Availability</span>
              <ArrowRight className="w-4 h-4 text-[#E8D2B5] group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </div>

          {/* Below the button */}
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#343d35] pt-2">
            Flexible Booking · Affordable Rates · Modern Facilities
          </p>
        </motion.div>
      </div>
    </section>
  );
};
