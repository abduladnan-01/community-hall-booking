import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "The hall was perfect for our family celebration. Everything was clean, spacious, and well organized.",
      author: "Sarah T.",
      event: "Family Reunion Banquet",
      date: "October 2026"
    },
    {
      quote: "The booking process was simple, and the staff were very helpful.",
      author: "David R.",
      event: "Charity Gala Evening",
      date: "September 2026"
    },
    {
      quote: "The facilities were excellent, and the hall was perfect for our event.",
      author: "Emma W.",
      event: "Golden Anniversary Reception",
      date: "August 2026"
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#0d141d]/70 border-t border-border/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header in Deep Burgundy & Warm Cream */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#590907]/90 border border-[#E8D2B5]/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5]" />
            <span className="label-tag text-[#E8D2B5] font-semibold">
              COMMUNITY VOICES
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white tracking-tight">
            Memories Made at Riverside
          </h2>

          <p className="text-[#A5A79B] text-sm sm:text-base font-light">
            Read what community members and event hosts have experienced in our hall.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-surface rounded-2xl border border-border p-8 flex flex-col justify-between hover:border-[#E8D2B5]/50 transition-all duration-300 shadow-lg relative group"
            >
              <Quote className="w-8 h-8 text-[#590907]/40 absolute top-6 right-6 group-hover:text-[#590907]/70 transition-colors" />

              <div className="space-y-4">
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-accent fill-accent"
                    />
                  ))}
                </div>

                {/* Quote in Warm Cream */}
                <p className="text-[#E8D2B5] text-sm sm:text-base leading-relaxed italic font-light pt-2">
                  "{t.quote}"
                </p>
              </div>

              {/* Author in Sage & White */}
              <div className="pt-6 border-t border-border/60 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-base font-headline font-bold text-white block">
                    — {t.author}
                  </span>
                  <span className="text-xs text-[#A5A79B] block -mt-0.5">
                    {t.event}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#A5A79B]/80">
                  {t.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

