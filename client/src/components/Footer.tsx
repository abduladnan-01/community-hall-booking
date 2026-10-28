import React from 'react';
import { Landmark, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { BuildingSettings } from '../types';

interface FooterProps {
  buildingSettings: BuildingSettings;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  buildingSettings,
  onOpenBooking,
  onOpenAdmin,
  onOpenTracker
}) => {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a0f16] border-t border-border/60 text-muted-foreground pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border/40">
          
          {/* Col 1 & 2: Branding & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#590907] border border-[#E8D2B5]/50 flex items-center justify-center text-[#E8D2B5] shadow-md shadow-[#590907]/30">
                <Landmark className="w-5 h-5 text-[#E8D2B5]" />
              </div>
              <div>
                <h3 className="font-headline text-2xl font-bold text-white tracking-tight">
                  Riverside Community Hall
                </h3>
                <span className="text-[9px] uppercase tracking-[0.16em] text-[#E8D2B5] font-semibold block">
                  Oakridge, Gloucestershire
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm font-light text-[#A5A79B]">
              Providing premier banquet halls, conference spaces, and community facilities designed to bring people together in celebration, purpose, and camaraderie.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-[#A5A79B] hover:text-[#E8D2B5] border border-border/60 hover:border-[#E8D2B5]/40 px-3 py-1 rounded-md transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8D2B5]" />
                <span>Authorized Admin Portal</span>
              </button>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="label-tag text-white font-semibold">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#home"
                  onClick={(e) => { e.preventDefault(); handleScroll('#home'); }}
                  className="hover:text-accent transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#halls"
                  onClick={(e) => { e.preventDefault(); handleScroll('#halls'); }}
                  className="hover:text-accent transition-colors"
                >
                  Halls & Suites
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-accent transition-colors text-left"
                >
                  Bookings Status
                </button>
              </li>
              <li>
                <a
                  href="#facilities"
                  onClick={(e) => { e.preventDefault(); handleScroll('#facilities'); }}
                  className="hover:text-accent transition-colors"
                >
                  Facilities
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  onClick={(e) => { e.preventDefault(); handleScroll('#gallery'); }}
                  className="hover:text-accent transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleScroll('#contact'); }}
                  className="hover:text-accent transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hall Spaces */}
          <div className="space-y-3">
            <h4 className="label-tag text-white font-semibold">Available Spaces</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenBooking} className="hover:text-accent transition-colors text-left">
                  The Main Hall (150 Cap)
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-accent transition-colors text-left">
                  The Meeting Room (30 Cap)
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-accent transition-colors text-left">
                  The Function Hall (80 Cap)
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-accent transition-colors text-left">
                  Catering Prep Kitchen
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-accent transition-colors text-left">
                  Outdoor Landscaped Grounds
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Details */}
          <div className="space-y-3">
            <h4 className="label-tag text-white font-semibold">Contact & Enquiries</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>{buildingSettings.building_address || '12 High Street, Oakridge, GL54 6AB'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a href={`tel:${buildingSettings.building_phone || '9353916328'}`} className="text-white hover:text-[#E8D2B5] transition-colors">
                  {buildingSettings.building_phone || '9353916328'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a href={`mailto:${buildingSettings.building_email || 'faruqh042@gmail.com'}`} className="truncate text-white hover:text-[#E8D2B5] transition-colors">
                  {buildingSettings.building_email || 'faruqh042@gmail.com'}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Contact Highlights Bar */}
        <div className="py-4 my-2 border-b border-border/40 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2 text-white font-medium">
              <span className="label-tag text-[#A5A79B]">Direct Line:</span>
              <a href="tel:9353916328" className="text-[#E8D2B5] font-semibold hover:underline">
                9353916328
              </a>
            </span>
            <span className="flex items-center gap-2 text-white font-medium">
              <span className="label-tag text-[#A5A79B]">Enquiries:</span>
              <a href="mailto:faruqh042@gmail.com" className="text-[#E8D2B5] font-semibold hover:underline">
                faruqh042@gmail.com
              </a>
            </span>
          </div>
          <span className="text-[11px] text-[#A5A79B]">Riverside Community Hall Information Desk</span>
        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-muted-foreground/80">
          <p>© 2026 Riverside Community Hall. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Hire</span>
            <span>Accessibility Guide</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

