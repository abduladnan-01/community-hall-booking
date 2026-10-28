import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreClick }) => {
  const chips = [
    'Spacious Venues',
    'Affordable Pricing',
    'Flexible Booking',
    'Modern Facilities',
    'Community Friendly'
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Architectural Venue Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2200&q=85"
          alt="Riverside Community Hall exterior evening"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-pulse transition-transform duration-10000"
          style={{ animationDuration: '30s' }}
        />
        {/* Dark navy gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1620] via-[#0e1620]/80 to-[#0e1620]/65" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0e1620]/40 to-[#0e1620]/90" />
      </div>

      {/* Decorative Gold & Deep Burgundy Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[550px] h-[320px] bg-[#590907]/25 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 translate-x-1/2 w-[500px] h-[280px] bg-accent/15 blur-[130px] rounded-full pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Label: YOUR SPACE · YOUR COMMUNITY in Deep Burgundy with Warm Cream Beige */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#590907]/90 border border-[#E8D2B5]/50 backdrop-blur-md shadow-lg shadow-[#590907]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5]" />
            <span className="label-tag text-[#E8D2B5] font-semibold tracking-[0.16em]">
              YOUR SPACE · YOUR COMMUNITY
            </span>
          </div>

          {/* Headline: Cormorant Garamond, italic, 700 weight with Warm Cream & Gold accent */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold text-white tracking-tight leading-[1.08] text-balance">
            A Space for <span className="cream-gradient-text">Every Occasion.</span>
          </h1>

          {/* Description in Muted Sage Gray with Warm Cream clarity */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#A5A79B] font-light leading-relaxed">
            Discover the perfect venue for weddings, celebrations, meetings, and community gatherings.
          </p>

          {/* Buttons: Book a Hall → and Explore Our Halls */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBookClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-accent text-[#0e1620] text-xs font-bold uppercase tracking-wider hover:bg-[#e4b74b] transition-all transform active:scale-95 shadow-lg shadow-accent/25 flex items-center justify-center gap-2 group border border-[#E8D2B5]/40"
            >
              <span>Book a Hall</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#590907]/40 hover:bg-[#590907]/70 border border-[#E8D2B5]/40 text-[#E8D2B5] text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-sm shadow-md"
            >
              Explore Our Halls
            </button>
          </div>

          {/* Feature Chips with Muted Sage Gray & Warm Cream accents */}
          <div className="pt-10 border-t border-border/40 mt-12 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
              {chips.map((chip, idx) => (
                <motion.div
                  key={chip}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface/80 border border-[#A5A79B]/40 backdrop-blur-sm text-xs font-medium text-[#E8D2B5] shadow-sm hover:border-[#E8D2B5]/60 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A5A79B] flex-shrink-0" />
                  <span>{chip}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Subtle Bottom Fade to section below */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

