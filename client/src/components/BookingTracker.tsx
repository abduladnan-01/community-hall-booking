import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Ban,
  Loader2
} from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';

interface BookingTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingTracker: React.FC<BookingTrackerProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setCancelSuccessMsg(null);

    try {
      const res = await api.lookupBookings(query);
      setBookings(res.bookings);
      if (res.bookings.length === 0) {
        setErrorMsg('No reservations found matching this Booking ID or Email address.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to search bookings.');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm(`Are you sure you wish to cancel booking ${bookingId}?`)) return;

    setCancellingId(bookingId);
    try {
      await api.cancelBooking(bookingId);
      setCancelSuccessMsg(`Booking ${bookingId} has been successfully cancelled.`);
      // Refresh current list
      const res = await api.lookupBookings(query);
      setBookings(res.bookings);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Declined</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface border border-border text-white">
            {status}
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#121b27] border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#0d1520]/80">
            <div>
              <span className="label-tag text-accent font-semibold">RESERVATION TRACKER</span>
              <h2 className="text-xl font-headline font-bold text-white">Track Your Booking Status</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-surface hover:bg-surface-raised border border-border text-muted-foreground hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Booking ID (e.g. RCH-2026-1001) or Email Address"
                  className="w-full bg-surface border border-border focus:border-accent rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-muted-foreground/60 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-lg bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
              </button>
            </form>

            {cancelSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{cancelSuccessMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Results List */}
            {bookings && bookings.length > 0 && (
              <div className="space-y-4">
                <h3 className="label-tag text-muted-foreground">Found {bookings.length} Reservation(s)</h3>
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-xl bg-surface border border-border hover:border-accent/40 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-accent tracking-wider block">
                          {b.booking_id}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">{b.hall_name || 'Riverside Hall'}</h4>
                        <span className="text-xs text-muted-foreground">{b.event_type}</span>
                      </div>
                      {getStatusBadge(b.status)}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/60">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>{b.booking_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span>{b.start_time} - {b.end_time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-accent" />
                        <span>{b.guest_count} Guests</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block -mb-0.5">Estimated Cost</span>
                        <span className="text-sm font-bold text-accent">₹{b.total_amount.toLocaleString('en-IN')}</span>
                      </div>

                      {b.status !== 'Cancelled' && b.status !== 'Rejected' && (
                        <button
                          onClick={() => handleCancelBooking(b.booking_id)}
                          disabled={cancellingId === b.booking_id}
                          className="px-3 py-1.5 rounded bg-surface-raised hover:bg-red-500/20 text-xs font-medium text-red-300 border border-red-500/30 transition-all flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>

                    {b.rejection_reason && (
                      <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                        <strong>Reason:</strong> {b.rejection_reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

