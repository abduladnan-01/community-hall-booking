import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Landmark,
  ShieldCheck,
  Mail,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Hall, Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  halls: Hall[];
  selectedHallId?: number | null;
  onBookingSuccess?: (booking: Booking) => void;
  onViewEmailLogs?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  halls,
  selectedHallId,
  onBookingSuccess,
  onViewEmailLogs
}) => {
  const { user } = useAuth();

  // Form State
  const [hallId, setHallId] = useState<number>(selectedHallId || (halls[0]?.id || 1));
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('19:00');
  const [guestCount, setGuestCount] = useState<number>(50);
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Status & Feedback State
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    checked: boolean;
    available: boolean;
    message?: string;
  }>({ checked: false, available: true });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Sync initial props
  useEffect(() => {
    if (selectedHallId) {
      setHallId(selectedHallId);
    } else if (halls.length > 0 && !hallId) {
      setHallId(halls[0].id);
    }
  }, [selectedHallId, halls]);

  // Autofill user details if authenticated
  useEffect(() => {
    if (user) {
      if (!userName) setUserName(user.name);
      if (!userEmail) setUserEmail(user.email);
      if (!userPhone && user.phone) setUserPhone(user.phone);
    }
  }, [user]);

  // Set default date to 3 days in advance if empty
  useEffect(() => {
    if (!bookingDate) {
      const future = new Date();
      future.setDate(future.getDate() + 3);
      setBookingDate(future.toISOString().split('T')[0]);
    }
  }, [bookingDate]);

  const selectedHall = halls.find(h => h.id === Number(hallId)) || halls[0];

  // Dynamic price calculation
  const calculateEstimatedPrice = () => {
    if (!selectedHall) return 0;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const durationHours = Math.max(1, (eh * 60 + em - (sh * 60 + sm)) / 60);
    const sessions = Math.max(1, Math.ceil(durationHours / 5));
    return selectedHall.price_per_session * sessions;
  };

  // Real-time conflict checking when hall, date, or times change
  useEffect(() => {
    let active = true;

    async function verifySlot() {
      if (!hallId || !bookingDate || !startTime || !endTime) return;
      
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      if (eh * 60 + em <= sh * 60 + sm) {
        setAvailabilityStatus({
          checked: true,
          available: false,
          message: 'End time must be later than start time.'
        });
        return;
      }

      setIsCheckingAvailability(true);
      try {
        const res = await api.checkAvailability({
          hall_id: Number(hallId),
          booking_date: bookingDate,
          start_time: startTime,
          end_time: endTime
        });
        if (active) {
          setAvailabilityStatus({
            checked: true,
            available: res.available,
            message: res.message
          });
        }
      } catch (err: any) {
        if (active) {
          setAvailabilityStatus({
            checked: true,
            available: false,
            message: err.message
          });
        }
      } finally {
        if (active) setIsCheckingAvailability(false);
      }
    }

    const timer = setTimeout(verifySlot, 400);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [hallId, bookingDate, startTime, endTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedHall) {
      setErrorMsg('Please select a valid hall.');
      return;
    }

    if (guestCount > selectedHall.capacity) {
      setErrorMsg(`Guest count (${guestCount}) exceeds hall capacity (${selectedHall.capacity}).`);
      return;
    }

    if (availabilityStatus.checked && !availabilityStatus.available) {
      setErrorMsg(availabilityStatus.message || 'The selected slot is unavailable.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createBooking({
        hall_id: selectedHall.id,
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        event_type: eventType,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        guest_count: Number(guestCount),
        additional_requirements: additionalRequirements
      });

      setCreatedBooking(res.booking);
      if (onBookingSuccess) {
        onBookingSuccess(res.booking);
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#dca545', '#f5d485', '#ffffff']
        });
      } catch {}

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedBooking(null);
    setErrorMsg(null);
    onClose();
  };

  if (!isOpen) return null;

  const estimatedPrice = calculateEstimatedPrice();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8">
        
        {/* Backdrop */}
        <div className="fixed inset-0" onClick={handleReset} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-[#121b27] border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-6"
        >
          {/* Header in Deep Burgundy & Warm Cream */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#0d1520]/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#590907] border border-[#E8D2B5]/50 text-[#E8D2B5]">
                <Landmark className="w-5 h-5 text-[#E8D2B5]" />
              </div>
              <div>
                <span className="label-tag text-[#E8D2B5] font-semibold">RESERVATION PORTAL</span>
                <h2 className="text-xl font-headline font-bold text-white">Book Riverside Community Hall</h2>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-full bg-surface hover:bg-surface-raised border border-border text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen */}
          {createdBooking ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-[#590907]/30 border-2 border-[#E8D2B5] rounded-full flex items-center justify-center mx-auto text-[#E8D2B5] shadow-lg shadow-[#590907]/30">
                <CheckCircle2 className="w-8 h-8 text-[#E8D2B5]" />
              </div>

              <div className="space-y-2">
                <span className="label-tag text-[#E8D2B5] font-semibold">BOOKING SUBMITTED SUCCESSFULLY</span>
                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-white">
                  Reservation Reference: <span className="text-[#E8D2B5]">{createdBooking.booking_id}</span>
                </h3>
                <p className="text-sm text-[#A5A79B] max-w-md mx-auto">
                  A booking confirmation notification has been dispatched to{' '}
                  <span className="text-white font-medium">{createdBooking.user_email}</span>.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-surface p-5 rounded-xl border border-border text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between border-b border-border/60 pb-1.5">
                  <span className="text-[#A5A79B]">Hall:</span>
                  <span className="font-semibold text-white">{selectedHall?.name}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-1.5">
                  <span className="text-[#A5A79B]">Date & Hours:</span>
                  <span className="font-semibold text-white">{createdBooking.booking_date} ({createdBooking.start_time} - {createdBooking.end_time})</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-1.5">
                  <span className="text-[#A5A79B]">Guests:</span>
                  <span className="font-semibold text-white">{createdBooking.guest_count} Attendees</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-1.5">
                  <span className="text-[#A5A79B]">Estimated Amount:</span>
                  <span className="font-bold text-[#E8D2B5]">₹{createdBooking.total_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#A5A79B]">Initial Status:</span>
                  <span className="font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded">
                    {createdBooking.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {onViewEmailLogs && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewEmailLogs();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-surface-raised border border-border hover:border-accent/60 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <Mail className="w-4 h-4 text-accent" />
                    <span>View Sent Email Log</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-accent text-[#0e1620] text-xs font-bold uppercase tracking-wider hover:bg-[#e4b74b] transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Hall Selector */}
              <div>
                <label className="label-tag text-[#A5A79B] block mb-1.5">Select Hall / Suite *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {halls.map((h) => (
                    <button
                      type="button"
                      key={h.id}
                      onClick={() => setHallId(h.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        Number(hallId) === h.id
                          ? 'border-[#E8D2B5] bg-[#590907]/35 shadow-sm shadow-[#590907]/20'
                          : 'border-border bg-surface hover:border-[#E8D2B5]/40'
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">{h.name}</span>
                      <span className="block text-[11px] text-[#E8D2B5] font-semibold mt-0.5">
                        ₹{h.price_per_session.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-[#A5A79B] mt-0.5">
                        Max {h.capacity} guests
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Sarah Thompson"
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg px-3 py-2 text-xs text-white placeholder-muted-foreground/60 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg px-3 py-2 text-xs text-white placeholder-muted-foreground/60 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+44 7911 123456"
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg px-3 py-2 text-xs text-white placeholder-muted-foreground/60 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Event Type & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Event Type *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg px-3 py-2 text-xs text-white outline-none transition-colors"
                  >
                    <option value="Wedding Reception">Wedding Reception</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Corporate Workshop / Meeting">Corporate Workshop / Meeting</option>
                    <option value="Community Townhall">Community Townhall</option>
                    <option value="Anniversary Gathering">Anniversary Gathering</option>
                    <option value="Exhibition / Cultural Event">Exhibition / Cultural Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Booking Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg px-3 py-2 text-xs text-white outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Time Slots & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg px-3 py-2 text-xs text-white outline-none transition-colors [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">End Time *</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg px-3 py-2 text-xs text-white outline-none transition-colors [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">
                    Guests (Max {selectedHall?.capacity || 150}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedHall?.capacity || 200}
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg px-3 py-2 text-xs text-white outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Real-time Overlap & Availability Feedback */}
              <div className="py-1">
                {isCheckingAvailability ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                    <span>Verifying hall availability against existing reservations...</span>
                  </div>
                ) : availabilityStatus.checked ? (
                  availabilityStatus.available ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>This date and time slot is currently available!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg border border-red-500/20">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>{availabilityStatus.message || 'Double booking prevented: Time slot conflict.'}</span>
                    </div>
                  )
                ) : null}
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="label-tag text-muted-foreground block mb-1">Special Requirements / Setup Notes</label>
                <textarea
                  rows={2}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. Stage microphone, round banquet tables, projection screen, catering prep counter..."
                  className="w-full bg-surface border border-border focus:border-accent rounded-lg px-3 py-2 text-xs text-white placeholder-muted-foreground/60 outline-none transition-colors"
                />
              </div>

              {/* Price Calculation Summary & Submit Button */}
              <div className="bg-[#0f1722] p-4 rounded-xl border border-accent/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                    Estimated Booking Amount
                  </span>
                  <span className="text-xl font-bold text-accent">
                    ₹{estimatedPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Based on venue session rates
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || (availabilityStatus.checked && !availabilityStatus.available)}
                  className="px-6 py-3 rounded-md bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-accent/25 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Double-booking prevention active. Confirmation email dispatched upon submission.</span>
              </div>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

