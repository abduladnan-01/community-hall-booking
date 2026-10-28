import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Clock,
  Shield,
  FileText,
  MapPin,
  Phone,
  Mail,
  Check,
  Calendar,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Hall, BuildingSettings } from '../types';

interface HallDetailsModalProps {
  hall: Hall | null;
  buildingSettings: BuildingSettings;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (hall: Hall) => void;
}

export const HallDetailsModal: React.FC<HallDetailsModalProps> = ({
  hall,
  buildingSettings,
  isOpen,
  onClose,
  onBookNow
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !hall) return null;

  const images = [hall.image_url, ...(hall.gallery || [])].filter(Boolean);

  const buildingFacilities = buildingSettings.building_facilities || [
    'Main event hall',
    'Meeting room',
    'Function room',
    'Kitchen and catering area',
    'Washrooms',
    'Accessible entrance',
    'Parking facilities',
    'Audio and visual equipment'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8">
        
        {/* Modal Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Content Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl bg-[#121b27] border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#0d1520]/80">
            <div>
              <span className="label-tag text-[#E8D2B5] font-semibold bg-[#590907] px-2.5 py-0.5 rounded-full border border-[#E8D2B5]/40 inline-block mb-1">
                {hall.suitable_for}
              </span>
              <h2 className="text-2xl font-headline font-bold text-white">{hall.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-surface hover:bg-surface-raised border border-border text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
            
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden border border-border bg-background">
                <img
                  src={images[activeImageIndex] || hall.image_url}
                  alt={hall.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-md border border-border px-3 py-1 rounded text-xs text-muted-foreground">
                  Photo {activeImageIndex + 1} of {images.length}
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImageIndex === idx ? 'border-accent scale-105' : 'border-border/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-surface p-4 rounded-xl border border-border">
                <Users className="w-5 h-5 text-[#E8D2B5] mb-2" />
                <span className="label-tag text-[#A5A79B] block">Max Capacity</span>
                <span className="text-lg font-bold text-white">{hall.capacity} Guests</span>
              </div>

              <div className="bg-surface p-4 rounded-xl border border-[#E8D2B5]/40">
                <Sparkles className="w-5 h-5 text-[#E8D2B5] mb-2" />
                <span className="label-tag text-[#A5A79B] block">Session Rate</span>
                <span className="text-lg font-bold text-[#E8D2B5]">₹{hall.price_per_session.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-surface p-4 rounded-xl border border-border">
                <Clock className="w-5 h-5 text-[#A5A79B] mb-2" />
                <span className="label-tag text-[#A5A79B] block">Sessions</span>
                <span className="text-sm font-semibold text-white">{hall.available_sessions?.length || 3} Available</span>
              </div>

              <div className="bg-surface p-4 rounded-xl border border-border">
                <MapPin className="w-5 h-5 text-[#E8D2B5] mb-2" />
                <span className="label-tag text-[#A5A79B] block">Location</span>
                <span className="text-sm font-semibold text-white">Main Complex</span>
              </div>
            </div>

            {/* Full Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-headline font-bold text-white">Venue Description</h3>
              <p className="text-[#A5A79B] text-sm sm:text-base leading-relaxed font-light">
                {hall.description}
              </p>
            </div>

            {/* Facilities Included */}
            <div className="space-y-3">
              <h3 className="text-xl font-headline font-bold text-white">Included Hall Facilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {hall.facilities.map((fac) => (
                  <div key={fac} className="flex items-center gap-2 p-2.5 rounded-lg bg-surface border border-border text-xs text-foreground/90">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Booking Sessions */}
            {hall.available_sessions && hall.available_sessions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-headline font-bold text-white">Standard Booking Sessions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hall.available_sessions.map((sess, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-surface/80 border border-border">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium text-white">{sess}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules & Cancellation Policies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-surface/60 p-5 rounded-xl border border-border space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <Shield className="w-4 h-4" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Rules & Regulations</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {hall.rules || 'Please respect sound volume limits after 23:00. The hall must be restored to clean order following your event. No unauthorized open flames.'}
                </p>
              </div>

              <div className="bg-surface/60 p-5 rounded-xl border border-border space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <FileText className="w-4 h-4" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Cancellation Policy</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {hall.cancellation_policy || 'Full refund if cancelled at least 14 days prior to booking date. 50% refund between 7 and 13 days. Non-refundable within 7 days.'}
                </p>
              </div>
            </div>

            {/* Building Details Section */}
            <div className="bg-[#0f1722] p-6 rounded-xl border border-accent/30 space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <Building className="w-5 h-5 text-accent" />
                  <h4 className="font-headline text-lg font-bold text-white">
                    {buildingSettings.building_name || 'Riverside Community Hall'}
                  </h4>
                </div>
                <span className="label-tag text-accent font-semibold">VENUE OVERVIEW</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{buildingSettings.building_address || '12 High Street, Oakridge, GL54 6AB'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{buildingSettings.building_phone || '+44 1234 567 890'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{buildingSettings.building_email || 'info@riversidehall.org.uk'}</span>
                </div>
              </div>

              <div>
                <span className="label-tag text-muted-foreground block mb-2">Full Building Facilities</span>
                <div className="flex flex-wrap gap-2">
                  {buildingFacilities.map((bf) => (
                    <span key={bf} className="px-2.5 py-1 rounded bg-surface border border-border text-[11px] text-foreground/80">
                      {bf}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Bottom Footer CTA */}
          <div className="px-6 py-4 border-t border-border bg-[#0d1520] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Session Pricing</span>
              <span className="text-xl font-bold text-accent">₹{hall.price_per_session.toLocaleString('en-IN')}</span>
              <span className="text-xs text-muted-foreground ml-1">/ standard session</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookNow(hall);
                }}
                className="px-6 py-2.5 rounded-md bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95 shadow-lg shadow-accent/20 flex items-center gap-2"
              >
                <span>Book This Hall</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

