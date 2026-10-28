import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 0,
      quote: "The hall was perfect for our family celebration. Everything was clean, spacious, and well organized.",
      author: "Sarah T.",
      event: "Family Reunion Banquet",
      venue: "Heritage Main Hall",
      date: "October 2026",
      rating: 5
    },
    {
      id: 1,
      quote: "The booking process was simple, and the staff were very helpful.",
      author: "David R.",
      event: "Charity Gala Evening",
      venue: "Grand Ballroom & Terrace",
      date: "September 2026",
      rating: 5
    },
    {
      id: 2,
      quote: "The facilities were excellent, and the hall was perfect for our event.",
      author: "Emma W.",
      event: "Golden Anniversary Reception",
      venue: "Riverside Function Suite",
      date: "August 2026",
      rating: 5
    },
    {
      id: 3,
      quote: "The AV system and projector in the meeting room made our executive workshop seamless and productive.",
      author: "Marcus K.",
      event: "Regional Non-Profit Summit",
      venue: "Executive Seminar Room",
      date: "July 2026",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slides every 5.5s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section
      className="py-24 sm:py-32 bg-[#0d141d]/75 border-t border-border/40 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[300px] bg-[#590907]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header in Deep Burgundy & Warm Cream */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#590907]/90 border border-[#E8D2B5]/50 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5]" />
            <span className="label-tag text-[#E8D2B5] font-semibold">
              COMMUNITY VOICES & STORIES
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white tracking-tight">
            Memories Made at Riverside
          </h2>

          <p className="text-[#A5A79B] text-sm sm:text-base font-light">
            Read what community members and event hosts have experienced in our hall.
          </p>
        </div>

        {/* Featured Interactive Slides Carousel */}
        <div className="max-w-4xl mx-auto relative mb-12">
          <div className="relative min-h-[290px] sm:min-h-[250px] bg-surface rounded-3xl border border-[#E8D2B5]/40 p-8 sm:p-12 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Large Decorative Quote Icon */}
            <Quote className="w-24 h-24 text-[#590907]/20 absolute top-4 right-6 pointer-events-none" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="space-y-6"
              >
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1.5">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-accent fill-accent"
                    />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-[#E8D2B5] bg-[#590907]/80 px-2 py-0.5 rounded-full border border-[#E8D2B5]/30">
                    Verified Host
                  </span>
                </div>

                {/* Main Quote in Warm Cream */}
                <p className="text-[#E8D2B5] text-lg sm:text-2xl font-light italic leading-relaxed">
                  "{current.quote}"
                </p>

                {/* Author Info */}
                <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-lg font-headline font-bold text-white block">
                      — {current.author}
                    </span>
                    <span className="text-xs text-[#A5A79B]">
                      {current.event} · <span className="text-accent">{current.venue}</span>
                    </span>
                  </div>

                  <span className="text-[11px] uppercase tracking-wider text-[#A5A79B]/80 font-mono">
                    {current.date}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Previous / Next Slide Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            {/* Slide Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-8 bg-accent'
                      : 'w-2 bg-[#A5A79B]/50 hover:bg-[#E8D2B5]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full bg-surface hover:bg-[#590907] border border-[#E8D2B5]/40 text-[#E8D2B5] flex items-center justify-center transition-all shadow-md active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full bg-surface hover:bg-[#590907] border border-[#E8D2B5]/40 text-[#E8D2B5] flex items-center justify-center transition-all shadow-md active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
