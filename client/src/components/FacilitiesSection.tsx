import React from 'react';
import { motion } from 'framer-motion';
import {
  PartyPopper,
  Users,
  Briefcase,
  Cake,
  UtensilsCrossed,
  Volume2,
  Sparkles,
  Check,
  Building2,
  Wifi,
  Sparkle
} from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const experiences = [
    {
      title: 'Wedding & Reception Facilities',
      icon: PartyPopper,
      tag: 'Grand Celebrations',
      description: 'A romantic atmosphere with elevated stage architecture, grand banquet table configurations, ambient dance floor illumination, and private bridal dressing suites.',
      features: ['Bridal Suite', 'Stage Archway Placement', 'Bespoke Lighting Profiles']
    },
    {
      title: 'Community Events',
      icon: Users,
      tag: 'Civic & Cultural',
      description: 'Expansive open floorplans engineered for public town halls, art exhibitions, cultural holiday festivities, and local neighborhood assemblies.',
      features: ['Tiered Staging', 'High Capacity Seating', 'Accessible Entrances']
    },
    {
      title: 'Meetings & Workshops',
      icon: Briefcase,
      tag: 'Corporate & Learning',
      description: 'Distraction-free executive boardroom acoustics, dual 4K laser projection, high-speed fiber internet, and dedicated presenter lecterns.',
      features: ['4K Digital Projection', 'Conference Audio', 'Tea & Coffee Staging']
    },
    {
      title: 'Birthday Celebrations',
      icon: Cake,
      tag: 'Milestone Parties',
      description: 'Lively celebration layouts with customizable party seating, direct access to the landscaped terrace, and sound systems for live music or DJ mixers.',
      features: ['Outdoor Patio Flow', 'Festive Ambient Presets', 'Flexible Seating']
    },
    {
      title: 'Catering Services',
      icon: UtensilsCrossed,
      tag: 'Hospitality & Prep',
      description: 'Fully certified commercial staging kitchen, commercial refrigeration, hot buffet warming islands, and dedicated supplier load-in bays.',
      features: ['Commercial Refrigeration', 'Warming Buffets', 'Dedicated Service Bay']
    },
    {
      title: 'Audio & Visual Equipment',
      icon: Volume2,
      tag: 'Production Technology',
      description: 'State-of-the-art multi-zone PA audio, wireless UHF handheld microphones, dimmable architectural spots, and simple plug-and-play Bluetooth inputs.',
      features: ['Wireless Microphones', 'Multi-zone Sound', 'Intelligent Stage Spots']
    }
  ];

  const marqueeHighlights = [
    '✨ Grand Heritage Elevated Stage',
    '🎙️ High-Fidelity Multi-Zone PA Audio',
    '📽️ Dual 4K Laser Projection',
    '🍳 Commercial Catering & Culinary Prep Kitchen',
    '📶 Ultra-Fast Wi-Fi 6 Across All Halls',
    '♿ Step-Free Accessible Entrances & Washrooms',
    '🚗 Dedicated On-Site Free Parking Facilities',
    '🌿 Landscaped Garden Terrace for Open-Air Receptions',
    '💡 Dimmable Ambient Architectural Chandeliers'
  ];

  return (
    <section id="facilities" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#590907]/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#590907]/90 border border-[#E8D2B5]/50 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5]" />
            <span className="label-tag text-[#E8D2B5] font-semibold">
              EXPERIENCES & CAPABILITIES
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white tracking-tight">
            Facilities & Curated Experiences
          </h2>

          <p className="text-[#A5A79B] text-sm sm:text-base font-light">
            Every hall is supported by world-class amenities, thoughtful accessibility, and professional technical equipment.
          </p>
        </div>

        {/* Continuous Moving Ticker Tape */}
        <div className="mb-16 overflow-hidden py-3 bg-[#0e1620]/80 border-y border-[#E8D2B5]/30 rounded-xl backdrop-blur-md">
          <div className="animate-marquee">
            {[...marqueeHighlights, ...marqueeHighlights].map((item, idx) => (
              <span
                key={idx}
                className="mx-6 text-xs sm:text-sm font-medium text-[#E8D2B5] whitespace-nowrap tracking-wide flex items-center gap-2"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Cards Grid with Stagger & Hover Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group p-8 rounded-2xl bg-surface border border-border hover:border-[#E8D2B5]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#590907]/20 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#590907]/25 border border-[#E8D2B5]/30 group-hover:border-[#E8D2B5] flex items-center justify-center text-[#E8D2B5] transition-colors shadow-inner group-hover:scale-110 transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="label-tag text-[#E8D2B5] font-semibold block mb-1">
                      {exp.tag}
                    </span>
                    <h3 className="text-xl font-headline font-bold text-white group-hover:text-[#E8D2B5] transition-colors">
                      {exp.title}
                    </h3>
                  </div>

                  <p className="text-[#A5A79B] text-xs sm:text-sm leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-border/60 mt-6 space-y-2">
                  {exp.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[#E8D2B5]">
                      <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
