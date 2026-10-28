import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HallsList } from './components/HallsList';
import { HallGallery } from './components/HallGallery';
import { HallDetailsModal } from './components/HallDetailsModal';
import { FacilitiesSection } from './components/FacilitiesSection';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { BookingCTA } from './components/BookingCTA';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { BookingTracker } from './components/BookingTracker';
import { AuthModal } from './components/AuthModal';
import { EmailNotificationViewerModal } from './components/EmailNotificationViewerModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgressBar, BackToTopButton } from './components/ScrollFeatures';
import { Hall, BuildingSettings } from './types';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';

export function App() {
  const { user, isAdmin } = useAuth();

  // State
  const [halls, setHalls] = useState<Hall[]>([]);
  const [isLoadingHalls, setIsLoadingHalls] = useState(true);
  const [buildingSettings, setBuildingSettings] = useState<BuildingSettings>({});
  const [activeSection, setActiveSection] = useState('home');

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedHallId, setPreselectedHallId] = useState<number | null>(null);

  const [detailsHall, setDetailsHall] = useState<Hall | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [emailViewerOpen, setEmailViewerOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  // Fetch halls and settings
  const loadInitialData = async () => {
    try {
      setIsLoadingHalls(true);
      const [hallsRes, settingsRes] = await Promise.all([
        api.getHalls(),
        api.getSettings()
      ]);
      setHalls(hallsRes.halls);
      setBuildingSettings(settingsRes.settings);
    } catch (err) {
      console.error('Failed to load halls or settings:', err);
    } finally {
      setIsLoadingHalls(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'halls', 'facilities', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenBooking = (hallId?: number) => {
    if (hallId) {
      setPreselectedHallId(hallId);
    } else if (halls.length > 0) {
      setPreselectedHallId(halls[0].id);
    }
    setBookingModalOpen(true);
  };

  const handleViewHallDetails = (hall: Hall) => {
    setDetailsHall(hall);
    setDetailsModalOpen(true);
  };

  const handleViewHallBySlug = (slug: string) => {
    const found = halls.find(h => h.slug === slug);
    if (found) {
      handleViewHallDetails(found);
    } else {
      handleOpenBooking();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/20 selection:text-accent">
      {/* Luxury Interactive Custom Cursor */}
      <CustomCursor />

      {/* Top Reading Scroll Progress Bar */}
      <ScrollProgressBar />
      
      {/* 2. Sticky Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAdmin={() => {
          if (isAdmin) {
            setAdminDashboardOpen(true);
          } else {
            setAuthModalOpen(true);
          }
        }}
        onOpenTracker={() => setTrackerModalOpen(true)}
        onOpenEmailViewer={() => setEmailViewerOpen(true)}
        activeSection={activeSection}
      />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          onBookClick={() => handleOpenBooking()}
          onExploreClick={() => {
            const el = document.getElementById('halls');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Available Halls */}
        <HallsList
          halls={halls}
          isLoading={isLoadingHalls}
          onViewDetails={handleViewHallDetails}
          onBookHall={(hall) => handleOpenBooking(hall.id)}
        />

        {/* 5. Hall Gallery */}
        <HallGallery
          onViewHallBySlug={handleViewHallBySlug}
          halls={halls}
        />

        {/* 10. Facilities & Experiences */}
        <FacilitiesSection />

        {/* 11. Testimonials */}
        <Testimonials />

        {/* 13. Full-Width Gold Booking CTA */}
        <BookingCTA
          onCheckAvailability={() => handleOpenBooking()}
        />

        {/* 12. Contact & Location */}
        <ContactSection
          buildingSettings={buildingSettings}
        />
      </main>

      {/* 14. Footer */}
      <Footer
        buildingSettings={buildingSettings}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => {
          if (isAdmin) {
            setAdminDashboardOpen(true);
          } else {
            setAuthModalOpen(true);
          }
        }}
        onOpenTracker={() => setTrackerModalOpen(true)}
      />

      {/* 6. Hall Details Page / Modal */}
      <HallDetailsModal
        hall={detailsHall}
        buildingSettings={buildingSettings}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onBookNow={(hall) => {
          setDetailsModalOpen(false);
          handleOpenBooking(hall.id);
        }}
      />

      {/* 7. Interactive Booking Form Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        halls={halls}
        selectedHallId={preselectedHallId}
        onViewEmailLogs={() => setEmailViewerOpen(true)}
      />

      {/* Booking Tracker Modal */}
      <BookingTracker
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
      />

      {/* Auth Modal (Sign In / Register / Admin Login) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAdminSuccess={() => setAdminDashboardOpen(true)}
      />

      {/* 8. Admin Controller Dashboard */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        onRefreshHalls={loadInitialData}
      />

      {/* 9. Live Email Notification Inspector */}
      <EmailNotificationViewerModal
        isOpen={emailViewerOpen}
        onClose={() => setEmailViewerOpen(false)}
      />

      {/* Floating Animated Back-to-Top Button */}
      <BackToTopButton />

    </div>
  );
}

