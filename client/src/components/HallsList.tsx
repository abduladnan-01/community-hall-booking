import React from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, Check, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import { Hall } from '../types';

interface HallsListProps {
  halls: Hall[];
  isLoading: boolean;
  onViewDetails: (hall: Hall) => void;
  onBookHall: (hall: Hall) => void;
}

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#590907]/90 border border-[#E8D2B5]/50 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5]" />
              <span className="label-tag text-[#E8D2B5] font-semibold">
                PREMIER VENUES
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white tracking-tight">
              Available Halls & Suites
            </h2>

            <p className="text-[#A5A79B] text-sm sm:text-base font-light">
              Elegantly proportioned spaces designed for community milestones, executive gatherings, and memorable celebrations.
            </p>
          </div>

        {/* Halls Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface rounded-xl border border-border h-[480px] animate-pulse" />
            ))}
          </div>
        ) : halls.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-xl border border-border">
            <ShieldAlert className="w-10 h-10 text-accent mx-auto mb-3" />
            <p className="text-foreground">No halls currently available. Please check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {halls.map((hall, idx) => (
              <motion.div
                key={hall.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group bg-surface rounded-xl border border-border overflow-hidden hover:border-accent/60 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 flex flex-col"
              >
                {/* Hall Image with Aspect Ratio & Zoom effect */}
                <div className="relative h-64 overflow-hidden bg-background">
                  <img
                    src={hall.image_url}
                    alt={hall.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />
                  
                  {/* Capacity Badge */}
                  <div className="absolute top-4 left-4 bg-[#0e1620]/85 backdrop-blur-md border border-[#A5A79B]/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <Users className="w-3.5 h-3.5 text-[#E8D2B5]" />
                    <span className="text-xs font-medium text-[#E8D2B5]">{hall.capacity} Guests</span>
                  </div>

                  {/* Flagship Badge for Main Hall */}
                  {hall.name === 'Main Hall' && (
                    <div className="absolute top-4 right-4 bg-[#590907] border border-[#E8D2B5]/50 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider text-[#E8D2B5] shadow-md">
                      Heritage Ballroom
                    </div>
                  )}

                  {/* Price Tag with Warm Cream & Gold accent */}
                  <div className="absolute bottom-4 right-4 bg-[#0e1620]/95 backdrop-blur-md border border-[#E8D2B5]/50 px-3.5 py-1.5 rounded-lg shadow-lg">
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
                      className="w-full py-2.5 px-3 rounded-md bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 transform active:scale-95"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

