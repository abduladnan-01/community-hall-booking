import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAdminSuccess }) => {
  const { login, register, isAdmin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password, phone);
      } else {
        await login(email, password);
      }
      onClose();
      if (email.trim().toLowerCase() === 'abdulayman077@gmail.com' && onAdminSuccess) {
        onAdminSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#121b27] border border-border rounded-2xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="label-tag text-[#E8D2B5] font-semibold">
                {isRegister ? 'JOIN RIVERSIDE' : 'PORTAL SIGN IN'}
              </span>
              <h2 className="text-2xl font-headline font-bold text-white">
                {isRegister ? 'Create an Account' : 'Sign In to Riverside'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-surface hover:bg-surface-raised border border-border text-muted-foreground hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Secure Login Notice */}
          <div className="p-3.5 rounded-xl bg-[#590907]/25 border border-[#590907]/50 flex items-start gap-2.5 text-xs text-[#E8D2B5]">
            <ShieldCheck className="w-4 h-4 text-[#E8D2B5] flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="block text-white">Administrator Access Protected</strong>
              Admin privileges require authorized credentials (<span className="text-[#E8D2B5] font-mono">abdulayman077@gmail.com</span>) and administrator password.
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="label-tag text-muted-foreground block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-muted-foreground/60 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label-tag text-muted-foreground block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-surface border border-border focus:border-accent rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-muted-foreground/60 outline-none"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="label-tag text-muted-foreground block mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7911 123456"
                    className="w-full bg-surface border border-border focus:border-accent rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-muted-foreground/60 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label-tag text-muted-foreground block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-border focus:border-accent rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-muted-foreground/60 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isRegister ? 'Complete Registration' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setErrorMsg(null); }}
              className="text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              {isRegister
                ? 'Already have an account? Sign in here'
                : "Don't have an account? Create one now"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

