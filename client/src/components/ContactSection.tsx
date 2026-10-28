import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { BuildingSettings } from '../types';
import { api } from '../services/api';

interface ContactSectionProps {
  buildingSettings: BuildingSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ buildingSettings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await api.submitInquiry({ name, email, subject, message });
      setSuccessMsg(res.message || 'Your inquiry has been submitted. We will contact you soon!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#590907]/90 border border-[#E8D2B5]/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E8D2B5]" />
            <span className="label-tag text-[#E8D2B5] font-semibold">
              GET IN TOUCH
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-headline font-bold text-white tracking-tight">
            Visit Our Community Hall
          </h2>

          <p className="text-[#A5A79B] text-sm sm:text-base font-light">
            We welcome in-person walkthroughs, planning sessions, and questions regarding your upcoming event.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Building Details & Map (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Address */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#590907]/25 border border-[#E8D2B5]/30 flex items-center justify-center text-[#E8D2B5]">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="label-tag text-[#A5A79B] block">Building Address</span>
                <p className="text-sm font-semibold text-[#E8D2B5]">
                  {buildingSettings.building_address || '12 High Street, Oakridge, GL54 6AB'}
                </p>
              </div>

              {/* Opening Hours */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
                <div className="w-9 h-9 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-accent">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="label-tag text-muted-foreground block">Operating Hours</span>
                <p className="text-sm font-semibold text-white">
                  {buildingSettings.opening_hours || 'Monday – Sunday: 07:30 AM – 11:30 PM'}
                </p>
              </div>

              {/* Phone */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#590907]/25 border border-[#E8D2B5]/30 flex items-center justify-center text-[#E8D2B5]">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="label-tag text-[#A5A79B] block">Telephone</span>
                <a
                  href={`tel:${buildingSettings.building_phone || '9353916328'}`}
                  className="text-sm font-semibold text-white hover:text-[#E8D2B5] transition-colors block"
                >
                  {buildingSettings.building_phone || '9353916328'}
                </a>
              </div>

              {/* Email */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#590907]/25 border border-[#E8D2B5]/30 flex items-center justify-center text-[#E8D2B5]">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="label-tag text-[#A5A79B] block">Inquiries Email</span>
                <a
                  href={`mailto:${buildingSettings.building_email || 'faruqh042@gmail.com'}`}
                  className="text-sm font-semibold text-white hover:text-[#E8D2B5] transition-colors block truncate"
                >
                  {buildingSettings.building_email || 'faruqh042@gmail.com'}
                </a>
              </div>

            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-border shadow-xl h-72 sm:h-80 relative bg-surface">
              <iframe
                title="Riverside Community Hall Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?q=Oakridge,%20Gloucestershire,%20UK&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full grayscale contrast-125 opacity-85 hover:opacity-100 transition-opacity"
              />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md border border-border px-3.5 py-1.5 rounded-lg shadow-md flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-white">Oakridge, GL54 6AB</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (5 cols) */}
          <div className="lg:col-span-5 bg-surface p-7 sm:p-9 rounded-2xl border border-border shadow-2xl relative">
            <div className="mb-6 space-y-1">
              <span className="label-tag text-accent font-semibold block">SEND AN INQUIRY</span>
              <h3 className="text-2xl font-headline font-bold text-white">Contact the Administrator</h3>
              <p className="text-xs text-muted-foreground">
                Inquiries are routed directly to the hall management team.
              </p>
            </div>

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-tag text-muted-foreground block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jonathan Hayes"
                  className="w-full bg-background border border-border focus:border-accent rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/60 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="label-tag text-muted-foreground block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jonathan@example.com"
                  className="w-full bg-background border border-border focus:border-accent rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/60 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="label-tag text-muted-foreground block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Wedding Reception Inquiry for Autumn 2026"
                  className="w-full bg-background border border-border focus:border-accent rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/60 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="label-tag text-muted-foreground block mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your event, expected attendees, or any special requests..."
                  className="w-full bg-background border border-border focus:border-accent rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/60 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-lg bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95 disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Administrator</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};

