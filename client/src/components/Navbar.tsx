import React, { useState, useEffect } from 'react';
import { Menu, X, Landmark, ShieldCheck, User as UserIcon, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenBooking: (hallId?: number) => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
  onOpenEmailViewer: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAuth,
  onOpenAdmin,
  onOpenTracker,
  onOpenEmailViewer,
  activeSection
}) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Halls', href: '#halls' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f1722]/90 backdrop-blur-md border-b border-border shadow-lg py-3'
          : 'bg-[#0f1722]/60 backdrop-blur-sm border-b border-border/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
            {/* Left: Community Hall Logo & Wordmark with Deep Burgundy & Warm Cream Crest */}
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-lg bg-[#590907] border border-[#E8D2B5]/50 flex items-center justify-center text-[#E8D2B5] group-hover:border-[#E8D2B5] transition-all shadow-md shadow-[#590907]/40">
                <Landmark className="w-5 h-5 text-[#E8D2B5]" />
              </div>
              <div>
                <span className="block font-headline text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#E8D2B5] transition-colors">
                  Riverside Community Hall
                </span>
                <span className="block text-[9px] uppercase tracking-[0.18em] text-[#A5A79B] font-medium -mt-0.5">
                  Heritage · Gathering · Community
                </span>
              </div>
            </a>

          {/* Right: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  activeSection === link.href.slice(1)
                    ? 'text-[#E8D2B5] font-semibold'
                    : 'text-foreground/80 hover:text-[#E8D2B5]'
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* Booking Tracker shortcut */}
            <button
              onClick={onOpenTracker}
              className="text-xs text-[#A5A79B] hover:text-[#E8D2B5] flex items-center gap-1.5 transition-colors py-1 px-2.5 rounded-full border border-border hover:border-[#E8D2B5]/40"
              title="Track existing reservation status"
            >
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>Track Booking</span>
            </button>

            {/* Email Inspector Shortcut */}
            <button
              onClick={onOpenEmailViewer}
              className="text-xs text-[#A5A79B] hover:text-[#E8D2B5] flex items-center gap-1 transition-colors py-1 px-2 rounded-full border border-border/60 hover:border-[#E8D2B5]/40"
              title="View sent email notifications"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[11px]">Email Logs</span>
            </button>

            {/* Auth / Admin Button */}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#590907] border border-[#E8D2B5]/60 text-[#E8D2B5] text-xs font-semibold hover:bg-[#781512] transition-all shadow-md shadow-[#590907]/30"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#E8D2B5]" />
                    <span>Admin Console</span>
                  </button>
                ) : (
                  <span className="text-xs text-[#A5A79B] flex items-center gap-1.5 px-2 py-1 bg-surface rounded border border-border">
                    <UserIcon className="w-3.5 h-3.5 text-[#E8D2B5]" />
                    <span className="max-w-[100px] truncate text-white">{user.name.split(' ')[0]}</span>
                  </span>
                )}
                <button
                  onClick={logout}
                  className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs text-foreground/90 hover:text-accent font-medium px-2.5 py-1.5 rounded border border-border hover:border-accent/50 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Book a Hall CTA Button */}
            <button
              onClick={() => onOpenBooking()}
              className="px-5 py-2 rounded-md bg-accent text-[#0f1722] text-xs font-bold uppercase tracking-wider hover:bg-[#e4b74b] transition-all transform active:scale-95 shadow-md shadow-accent/20 flex items-center gap-1.5"
            >
              <span>Book a Hall</span>
              <span className="text-sm">→</span>
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 rounded bg-accent text-[#0f1722] text-xs font-bold uppercase tracking-wider"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground/80 hover:text-white rounded-md bg-surface border border-border"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface/98 border-b border-border px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground/90 hover:text-accent hover:bg-surface-raised transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTracker(); }}
              className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-muted-foreground hover:text-white bg-surface-raised rounded-md border border-border"
            >
              <Calendar className="w-4 h-4 text-accent" />
              <span>Track Reservation Status</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenEmailViewer(); }}
              className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-muted-foreground hover:text-white bg-surface-raised rounded-md border border-border"
            >
              <span className="h-2 w-2 rounded-full bg-accent"></span>
              <span>Live Email Notification Logs</span>
            </button>

            {user ? (
              <div className="flex items-center justify-between py-2 px-3 bg-surface-raised rounded-md border border-border">
                <span className="text-xs text-foreground font-medium">Signed in: {user.name}</span>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                      className="px-2.5 py-1 text-xs bg-accent text-[#0f1722] font-bold rounded"
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="p-1 text-muted-foreground hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-surface-raised border border-border hover:border-accent rounded-md"
              >
                Sign In / Admin Login
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-accent text-[#0f1722] rounded-md shadow-md"
            >
              Book a Hall →
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

