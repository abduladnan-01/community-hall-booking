import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreClick }) => {
  const slides: HeroSlide[] = [
    {
      id: 0,
      title: 'Architectural Heritage Grounds',
      subtitle: 'Warm evening ambiance & landscaped gardens',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2200&q=85',
      tag: 'Grand Exterior'
    },
    {
      id: 1,
      title: 'The Heritage Grand Ballroom',
      subtitle: 'Elevated stage, vaulted ceiling & acoustic architecture',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=85',
      tag: 'Main Event Hall'
    },
    {
      id: 2,
      title: 'Bridal Pavilion & Staged Elegance',
      subtitle: 'Bespoke banquet seating & warm ambient lighting',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2200&q=85',
      tag: 'Wedding Receptions'
    },
    {
      id: 3,
      title: 'Riverside Terrace & Banquet Suite',
      subtitle: 'Flexible celebratory layouts & culinary prep flow',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85',
      tag: 'Celebration Suites'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slides every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const chips = [
    'Spacious Venues',
    'Affordable Pricing',
    'Flexible Booking',
    'Modern Facilities',
    'Community Friendly',
    'Stage & Audio System',
    'Commercial Prep Kitchen',
    'Accessible Parking'
  ];

  return (
    <section
      id="home"
      className="relative min-h-[96vh] flex items-center justify-center pt-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Animated Image Slideshow with Ken Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-layered dark navy & deep burgundy gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1620] via-[#0e1620]/75 to-[#0e1620]/60" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0e1620]/40 to-[#0e1620]/85" />
      </div>

      {/* Decorative Gold & Deep Burgundy Ambient Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.4, 0.25]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[350px] bg-[#590907]/30 blur-[150px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.28, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 right-1/4 translate-x-1/2 w-[550px] h-[300px] bg-accent/20 blur-[140px] rounded-full pointer-events-none"
      />

      {/* Floating Golden & Warm Cream Ambient Dust Particles */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-accent/50"
            style={{
              width: (i % 3) * 2 + 3,
              height: (i % 3) * 2 + 3,
              left: `${(i * 5.5 + 4)}%`,
              top: `${(i * 13) % 80 + 10}%`,
              boxShadow: '0 0 10px rgba(220, 165, 69, 0.7)'
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0.2, 0.85, 0.2]
            }}
            transition={{
              duration: 5 + (i % 4) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i * 0.35)
            }}
          />
        ))}
      </div>

      {/* Manual Slide Navigation Buttons */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0e1620]/70 hover:bg-[#590907] border border-[#E8D2B5]/40 text-[#E8D2B5] items-center justify-center backdrop-blur-md transition-all transform hover:scale-110 active:scale-95 shadow-xl group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0e1620]/70 hover:bg-[#590907] border border-[#E8D2B5]/40 text-[#E8D2B5] items-center justify-center backdrop-blur-md transition-all transform hover:scale-110 active:scale-95 shadow-xl group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Label with Sparkles and Gentle Float */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#590907]/90 border border-[#E8D2B5]/50 backdrop-blur-md shadow-lg shadow-[#590907]/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="label-tag text-[#E8D2B5] font-semibold tracking-[0.16em]">
              YOUR SPACE · YOUR COMMUNITY
            </span>
          </motion.div>

          {/* Dynamic Slide Badge indicator */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-widest text-accent bg-[#0e1620]/80 px-3 py-0.5 rounded-full border border-accent/30 backdrop-blur-sm">
              {slides[currentSlide].tag}
            </span>
          </div>

          {/* Main Headline: Cormorant Garamond, italic, 700 weight with Cream Gradient */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold text-white tracking-tight leading-[1.08] text-balance">
            A Space for <span className="cream-gradient-text">Every Occasion.</span>
          </h1>

          {/* Description in Muted Sage Gray */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#A5A79B] font-light leading-relaxed">
            Discover the perfect venue for weddings, celebrations, meetings, and community gatherings.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onBookClick}
              className="w-full sm:w-auto px-8 py-4 rounded-md bg-accent text-[#0e1620] text-xs font-bold uppercase tracking-wider hover:bg-[#e4b74b] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2.5 group border border-[#E8D2B5]/40"
            >
              <span>Book a Hall</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-4 rounded-md bg-[#590907]/60 hover:bg-[#590907]/90 border border-[#E8D2B5]/40 text-[#E8D2B5] text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-sm shadow-md"
            >
              Explore Our Halls
            </motion.button>
          </div>

          {/* Interactive Slide Controls & Thumbnail Indicators */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-[#0e1620]/80 px-4 py-2 rounded-full border border-border/60 backdrop-blur-md">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`relative flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    idx === currentSlide
                      ? 'bg-[#590907] text-[#E8D2B5] shadow-sm border border-[#E8D2B5]/40'
                      : 'text-[#A5A79B] hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${idx === currentSlide ? 'bg-accent animate-ping' : 'bg-[#A5A79B]'}`} />
                  <span className="hidden sm:inline">{slide.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Continuous Moving Marquee of Features running across the base of the Hero */}
      <div className="absolute bottom-6 left-0 right-0 overflow-hidden py-3 bg-[#0e1620]/90 backdrop-blur-md border-y border-border/40 z-10">
        <div className="animate-marquee">
          {[...chips, ...chips, ...chips].map((chip, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 mx-4 px-3.5 py-1 rounded-full bg-surface/70 border border-[#A5A79B]/30 text-xs font-medium text-[#E8D2B5] whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              <span>{chip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={onExploreClick}
        className="hidden lg:flex absolute bottom-20 left-1/2 -translate-x-1/2 z-10 items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#A5A79B] hover:text-[#E8D2B5] cursor-pointer transition-colors"
      >
        <span>Explore</span>
        <ChevronDown className="w-3.5 h-3.5 text-accent" />
      </motion.div>

      {/* Bottom gradient fade into Halls section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
