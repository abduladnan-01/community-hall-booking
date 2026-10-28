import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LayoutDashboard,
  CalendarCheck,
  Building,
  Users,
  Mail,
  Sliders,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  RefreshCw,
  LogOut,
  Send,
  ShieldCheck,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Hall, Booking, User, BuildingSettings, AdminOverviewData, EmailNotification } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshHalls?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onRefreshHalls }) => {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'halls' | 'users' | 'emails' | 'settings'>('overview');

  // Overview Data
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  // Bookings Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('');
  const [bookingDateFilter, setBookingDateFilter] = useState('');
  const [bookingHallFilter, setBookingHallFilter] = useState('');
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [viewBookingDetails, setViewBookingDetails] = useState<Booking | null>(null);

  // Halls Data
  const [halls, setHalls] = useState<Hall[]>([]);
  const [editingHall, setEditingHall] = useState<Partial<Hall> | null>(null);
  const [showHallModal, setShowHallModal] = useState(false);

  // Users Data
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');

  // Email Settings & Logs
  const [emailSettings, setEmailSettings] = useState<Record<string, string>>({});
  const [emailLogs, setEmailLogs] = useState<EmailNotification[]>([]);
  const [previewEmailLog, setPreviewEmailLog] = useState<EmailNotification | null>(null);

  // Building Settings
  const [buildingSettings, setBuildingSettings] = useState<BuildingSettings>({});

  // Feedback notifications
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Fetch all initial data
  const loadData = async () => {
    try {
      setIsLoadingOverview(true);
      const [ovData, bkData, hlData, usData, emSet, emLogs, bldSet] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminBookings(),
        api.getHalls(),
        api.getAdminUsers(),
        api.getEmailSettings(),
        api.getEmailLogs(),
        api.getSettings()
      ]);

      setOverview(ovData);
      setBookings(bkData.bookings);
      setHalls(hlData.halls);
      setUsers(usData.users);
      setEmailSettings(emSet.settings);
      setEmailLogs(emLogs.logs);
      setBuildingSettings(bldSet.settings);
    } catch (err: any) {
      showNotice(err.message || 'Failed to load administrator records.', 'error');
    } finally {
      setIsLoadingOverview(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadData();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  // Security gate: strictly authorize admin email
  if (!isAdmin || user?.email.toLowerCase() !== 'abdulayman077@gmail.com') {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-surface p-8 rounded-2xl border border-red-500/40 text-center max-w-md space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-headline font-bold text-white">Access Denied</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Only the authorized administrator (<strong className="text-white">abdulayman077@gmail.com</strong>) has access to this management dashboard.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-surface-raised border border-border text-white text-xs font-semibold hover:border-accent"
          >
            Return to Public Portal
          </button>
        </div>
      </div>
    );
  }

  // --- Handlers: Bookings ---
  const handleFilterBookings = async () => {
    try {
      const res = await api.getAdminBookings({
        search: bookingSearch,
        status: bookingStatusFilter,
        date: bookingDateFilter,
        hall_id: bookingHallFilter
      });
      setBookings(res.bookings);
    } catch (err: any) {
      showNotice(err.message, 'error');
    }
  };

  const handleApproveBooking = async (id: number) => {
    try {
      const res = await api.approveBooking(id);
      showNotice(res.message);
      loadData();
    } catch (err: any) {
      showNotice(err.message, 'error');
    }
  };

  const handleOpenRejectModal = (b: Booking) => {
    setSelectedBookingForAction(b);
    setRejectionReason('Schedule conflict or hall maintenance on this date.');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedBookingForAction) return;
    try {
      const res = await api.rejectBooking(selectedBookingForAction.id, rejectionReason);
      showNotice(res.message);
      setShowRejectModal(false);
      setSelectedBookingForAction(null);
      loadData();
    } catch (err: any) {
      showNotice(err.message, 'error');
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A cancellation notice will be emailed.')) return;
    try {
      const res = await api.cancelAdminBooking(id);
      showNotice(res.message);
      loadData();
    } catch (err: any) {
      showNotice(err.message, 'error');
    }
  };

  // --- Handlers: Halls ---
  const handleSaveHall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHall) return;

    try {
      if (editingHall.id) {
        await api.updateHall(editingHall.id, editingHall);
        showNotice(`Hall "${editingHall.name}" updated successfully.`);
      } else {
        await api.createHall(editingHall);
        showNotice(`Hall "${editingHall.name}" created successfully.`);
      }
      setShowHallModal(false);
      setEditingHall(null);
      loadData();
      if (onRefreshHalls) onRefreshHalls();
    } catch (err: any) {
      showNotice(err.message, 'error');
    }
  };

  const handleDeleteHall = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? Associated bookings will be affected.`)) return;
    try {
      await api.deleteHall(id);
      showNotice(`Hall "${name}" deleted.`);
      loadData();
      if (onRefreshHalls) onRefreshHalls();
    } catch (err: any) {
      showNotice(err.message, 'error');
    }
  };

  const handleToggleHall = async (id: number) => {
    try {
      const res = await api.toggleHallActive(id);
      showNotice(`Hall status updated to ${res.is_active ? 'Active' : 'Inactive'}.`);
      loadData();
      if (onRefreshHalls) onRefreshHalls();
    } catch (err: any) {
      showNotice(err.message, 'error');
    }
  };

  // --- Handlers: Settings & Templates ---
  const handleSaveEmailSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateEmailSettings(emailSettings);
      showNotice('Email configuration and templates updated successfully.');
    } catch (err: any) {
      showNotice(err.message, 'error');
    }
  };

  const handleSaveBuildingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(buildingSettings);
      showNotice('Building address and facility information updated.');
    } catch (err: any) {
      showNotice(err.message, 'error');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
        
        {/* Main Dashboard Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-7xl h-[94vh] bg-[#0f1722] border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Top Bar */}
          <div className="px-6 py-3.5 border-b border-border bg-[#0a1017] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-headline font-bold text-white">Administrator Controller</h1>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30">
                    Official Admin
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Authorized as: <strong className="text-white">{user?.email}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={loadData}
                className="p-1.5 rounded-lg bg-surface hover:bg-surface-raised border border-border text-muted-foreground hover:text-white transition-colors"
                title="Refresh All Records"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingOverview ? 'animate-spin text-accent' : ''}`} />
              </button>
              <button
                onClick={logout}
                className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-red-500/20 text-muted-foreground hover:text-red-300 text-xs flex items-center gap-1 border border-border"
                title="Sign out of Admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-surface hover:bg-surface-raised border border-border text-muted-foreground hover:text-white"
                title="Close Dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {feedbackMsg && (
            <div
              className={`px-6 py-2 text-xs flex items-center gap-2 border-b ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                  : 'bg-red-500/20 text-red-200 border-red-500/40'
              }`}
            >
              {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Main Layout: Left Navigation + Right Content */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-56 border-r border-border bg-[#0b121a] p-3 flex flex-col justify-between">
              <div className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: overview?.metrics.pendingBookings },
                  { id: 'halls', label: 'Halls & Spaces', icon: Building, badge: overview?.metrics.totalHalls },
                  { id: 'users', label: 'Registered Users', icon: Users, badge: overview?.metrics.totalUsers },
                  { id: 'emails', label: 'Email Notifications', icon: Mail },
                  { id: 'settings', label: 'Building & Settings', icon: Sliders },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-accent/15 text-accent font-semibold border border-accent/40 shadow-sm'
                          : 'text-foreground/80 hover:text-white hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-accent" />
                        <span>{tab.label}</span>
                      </div>
                      {typeof tab.badge === 'number' && tab.badge > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          tab.id === 'bookings' && tab.badge > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-surface text-muted-foreground'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-surface/60 border border-border/80 text-[11px] text-muted-foreground space-y-1">
                <span className="font-semibold text-white block">System Status</span>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SQLite Online</span>
                </div>
                <div>v1.0.0 · Production</div>
              </div>
            </aside>

            {/* Right Work Area */}
            <main className="flex-1 overflow-y-auto p-6 bg-[#0e1620]">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-headline font-bold text-white">Dashboard Overview</h2>
                    <p className="text-xs text-muted-foreground">High-level metrics and current venue operational status.</p>
                  </div>

                  {/* 6 Key Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="p-4 rounded-xl bg-surface border border-border">
                      <Building className="w-5 h-5 text-accent mb-2" />
                      <span className="label-tag text-muted-foreground block">Total Halls</span>
                      <span className="text-2xl font-bold text-white">{overview?.metrics.totalHalls || 0}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface border border-border">
                      <CalendarCheck className="w-5 h-5 text-accent mb-2" />
                      <span className="label-tag text-muted-foreground block">Total Bookings</span>
                      <span className="text-2xl font-bold text-white">{overview?.metrics.totalBookings || 0}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface border border-amber-500/30">
                      <Clock className="w-5 h-5 text-amber-400 mb-2" />
                      <span className="label-tag text-amber-400 block">Pending Review</span>
                      <span className="text-2xl font-bold text-amber-400">{overview?.metrics.pendingBookings || 0}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface border border-emerald-500/30">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                      <span className="label-tag text-emerald-400 block">Confirmed</span>
                      <span className="text-2xl font-bold text-emerald-400">{overview?.metrics.confirmedBookings || 0}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface border border-border">
                      <Users className="w-5 h-5 text-accent mb-2" />
                      <span className="label-tag text-muted-foreground block">Total Users</span>
                      <span className="text-2xl font-bold text-white">{overview?.metrics.totalUsers || 0}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface border border-accent/40 bg-accent/5">
                      <DollarSign className="w-5 h-5 text-accent mb-2" />
                      <span className="label-tag text-accent block">Total Revenue</span>
                      <span className="text-xl font-bold text-accent">
                        ₹{(overview?.metrics.totalRevenue || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Hall Revenue Breakdown & Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Hall Stats (5 cols) */}
                    <div className="lg:col-span-5 bg-surface p-5 rounded-2xl border border-border space-y-4">
                      <h3 className="text-base font-headline font-bold text-white">Hall Utilization & Revenue</h3>
                      <div className="space-y-3">
                        {overview?.hallStats.map((hs) => (
                          <div key={hs.name} className="p-3 rounded-lg bg-surface-raised border border-border/80 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-white block">{hs.name}</span>
                              <span className="text-[11px] text-muted-foreground">{hs.booking_count} confirmed reservation(s)</span>
                            </div>
                            <span className="text-sm font-bold text-accent">₹{hs.hall_revenue.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Bookings (7 cols) */}
                    <div className="lg:col-span-7 bg-surface p-5 rounded-2xl border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-headline font-bold text-white">Recent Booking Applications</h3>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="text-xs text-accent hover:underline flex items-center gap-1"
                        >
                          <span>Manage All</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {overview?.recentBookings.map((b) => (
                          <div
                            key={b.id}
                            className="p-3 rounded-lg bg-surface-raised border border-border/80 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-accent font-semibold">{b.booking_id}</span>
                                <span className="text-white font-medium">{b.user_name}</span>
                              </div>
                              <span className="text-muted-foreground">{b.hall_name} · {b.booking_date} ({b.start_time} - {b.end_time})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                                b.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-surface text-muted-foreground'
                              }`}>
                                {b.status}
                              </span>
                              {b.status === 'Pending' && (
                                <button
                                  onClick={() => handleApproveBooking(b.id)}
                                  className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded border border-emerald-500/40 text-[10px] font-semibold"
                                >
                                  Approve
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BOOKINGS MANAGEMENT */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-headline font-bold text-white">Booking Management</h2>
                      <p className="text-xs text-muted-foreground">Search, filter, approve, reject, and inspect reservations.</p>
                    </div>

                    <button
                      onClick={handleFilterBookings}
                      className="px-3.5 py-1.5 bg-accent text-[#0e1620] hover:bg-[#e4b74b] rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Apply Filters</span>
                    </button>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-surface p-4 rounded-xl border border-border">
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">Search Keywords</label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={bookingSearch}
                          onChange={(e) => setBookingSearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleFilterBookings()}
                          placeholder="Search ID, name, email..."
                          className="w-full bg-surface-raised border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">Filter by Status</label>
                      <select
                        value={bookingStatusFilter}
                        onChange={(e) => setBookingStatusFilter(e.target.value)}
                        className="w-full bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                      >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">Filter by Hall</label>
                      <select
                        value={bookingHallFilter}
                        onChange={(e) => setBookingHallFilter(e.target.value)}
                        className="w-full bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                      >
                        <option value="">All Halls</option>
                        {halls.map((h) => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">Filter by Date</label>
                      <input
                        type="date"
                        value={bookingDateFilter}
                        onChange={(e) => setBookingDateFilter(e.target.value)}
                        className="w-full bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Bookings Table */}
                  <div className="bg-surface rounded-xl border border-border overflow-x-auto shadow-lg">
                    <table className="w-full text-left text-xs text-muted-foreground">
                      <thead className="bg-[#0b121a] text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                        <tr>
                          <th className="py-3 px-4">Booking ID</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Hall</th>
                          <th className="py-3 px-4">Event Date & Time</th>
                          <th className="py-3 px-4">Guests</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-muted-foreground">
                              No bookings found matching the current filters.
                            </td>
                          </tr>
                        ) : (
                          bookings.map((b) => (
                            <tr key={b.id} className="hover:bg-surface-raised/50 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-accent">
                                {b.booking_id}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-white block">{b.user_name}</span>
                                <span className="text-[11px] block">{b.user_email}</span>
                                <span className="text-[11px] block text-muted-foreground">{b.user_phone}</span>
                              </td>
                              <td className="py-3.5 px-4 text-white font-medium">
                                {b.hall_name || 'Riverside Hall'}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="text-white block font-medium">{b.booking_date}</span>
                                <span className="text-[11px] block">{b.start_time} - {b.end_time}</span>
                                <span className="text-[10px] text-accent block">{b.event_type}</span>
                              </td>
                              <td className="py-3.5 px-4 text-white">
                                {b.guest_count}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-accent">
                                ₹{b.total_amount.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  b.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                  b.status === 'Pending' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                                  b.status === 'Rejected' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                                  'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                                <button
                                  onClick={() => setViewBookingDetails(b)}
                                  className="p-1 rounded bg-surface hover:bg-surface-raised text-muted-foreground hover:text-white border border-border"
                                  title="View full booking & user details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {b.status === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveBooking(b.id)}
                                      className="px-2 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded border border-emerald-500/40 text-[10px] font-bold uppercase"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleOpenRejectModal(b)}
                                      className="px-2 py-1 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded border border-red-500/40 text-[10px] font-bold uppercase"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {b.status === 'Confirmed' && (
                                  <button
                                    onClick={() => handleCancelBooking(b.id)}
                                    className="px-2 py-1 bg-slate-500/20 text-slate-300 hover:bg-red-500/20 hover:text-red-300 rounded border border-border text-[10px] font-medium"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: HALL MANAGEMENT */}
              {activeTab === 'halls' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-headline font-bold text-white">Hall Management</h2>
                      <p className="text-xs text-muted-foreground">Add new halls, edit pricing, manage facilities, and set availability.</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingHall({
                          name: '',
                          capacity: 100,
                          price_per_session: 3500,
                          description: '',
                          suitable_for: 'Community & Private Events',
                          facilities: ['Sound System', 'Tables', 'Chairs'],
                          image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
                          gallery: [],
                          rules: 'Standard hall rules apply.',
                          cancellation_policy: 'Full refund 14 days prior.',
                          available_sessions: ['Morning Session', 'Evening Session']
                        });
                        setShowHallModal(true);
                      }}
                      className="px-3.5 py-2 bg-accent text-[#0e1620] hover:bg-[#e4b74b] rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Hall</span>
                    </button>
                  </div>

                  {/* Halls Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {halls.map((hall) => (
                      <div
                        key={hall.id}
                        className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col justify-between shadow-lg"
                      >
                        <div className="relative h-44">
                          <img src={hall.image_url} alt={hall.name} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 bg-background/85 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white border border-border">
                            Capacity: {hall.capacity}
                          </div>
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={() => handleToggleHall(hall.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                hall.is_active
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
                              }`}
                            >
                              {hall.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </div>
                          <div className="absolute bottom-3 right-3 bg-surface-raised/90 border border-accent/40 px-2.5 py-1 rounded text-accent font-bold text-xs">
                            ₹{hall.price_per_session.toLocaleString('en-IN')} / session
                          </div>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="label-tag text-accent font-semibold block">{hall.suitable_for}</span>
                            <h3 className="text-lg font-headline font-bold text-white">{hall.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{hall.description}</p>

                            <div className="flex flex-wrap gap-1 mt-3">
                              {hall.facilities.slice(0, 4).map((f) => (
                                <span key={f} className="px-1.5 py-0.5 rounded bg-background text-[10px] text-foreground/80 border border-border">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-border flex items-center justify-between">
                            <button
                              onClick={() => {
                                setEditingHall(hall);
                                setShowHallModal(true);
                              }}
                              className="px-3 py-1.5 rounded bg-surface-raised hover:bg-surface-raised/80 border border-border text-xs text-white font-medium flex items-center gap-1.5"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-accent" />
                              <span>Edit Details</span>
                            </button>

                            <button
                              onClick={() => handleDeleteHall(hall.id, hall.name)}
                              className="p-1.5 rounded bg-surface-raised hover:bg-red-500/20 border border-border text-muted-foreground hover:text-red-300"
                              title="Delete Hall"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: USER MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-headline font-bold text-white">Registered Users & Patrons</h2>
                      <p className="text-xs text-muted-foreground">Contact information and customer booking history.</p>
                    </div>

                    <div className="relative w-64">
                      <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={async (e) => {
                          setUserSearch(e.target.value);
                          const res = await api.getAdminUsers(e.target.value);
                          setUsers(res.users);
                        }}
                        placeholder="Search patrons by name or email..."
                        className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-lg">
                    <table className="w-full text-left text-xs text-muted-foreground">
                      <thead className="bg-[#0b121a] text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                        <tr>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Phone</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Bookings Count</th>
                          <th className="py-3 px-4">Registered Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-surface-raised/40 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-white">{u.name}</td>
                            <td className="py-3.5 px-4 font-mono text-accent">{u.email}</td>
                            <td className="py-3.5 px-4">{u.phone || '—'}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.role === 'admin' ? 'bg-accent/20 text-accent border border-accent/40' : 'bg-surface text-muted-foreground'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-white font-bold">{u.booking_count || 0}</td>
                            <td className="py-3.5 px-4 text-[11px]">{new Date(u.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: EMAIL SETTINGS & LOGS */}
              {activeTab === 'emails' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-headline font-bold text-white">Email Notification Engine</h2>
                    <p className="text-xs text-muted-foreground">
                      Configure administrator recipients, customize email templates, and view live delivery history.
                    </p>
                  </div>

                  {/* Settings & Recipient Form */}
                  <form onSubmit={handleSaveEmailSettings} className="bg-surface p-6 rounded-2xl border border-border space-y-5">
                    <h3 className="text-base font-headline font-bold text-white">Notification Recipients & Sender Config</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-tag text-muted-foreground block mb-1">Administrator Primary Email</label>
                        <input
                          type="email"
                          value={emailSettings.admin_email || 'abdulayman077@gmail.com'}
                          onChange={(e) => setEmailSettings({ ...emailSettings, admin_email: e.target.value })}
                          className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="label-tag text-muted-foreground block mb-1">Booking Alert Recipients (Comma-separated)</label>
                        <input
                          type="text"
                          value={emailSettings.notification_recipients || 'abdulayman077@gmail.com'}
                          onChange={(e) => setEmailSettings({ ...emailSettings, notification_recipients: e.target.value })}
                          className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <h4 className="label-tag text-accent font-semibold">Editable Email Templates</h4>

                      <div>
                        <label className="label-tag text-muted-foreground block mb-1">Booking Confirmation Template</label>
                        <textarea
                          rows={4}
                          value={emailSettings.email_template_confirmation || ''}
                          onChange={(e) => setEmailSettings({ ...emailSettings, email_template_confirmation: e.target.value })}
                          className="w-full bg-surface-raised border border-border rounded-lg p-3 text-xs text-white font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="label-tag text-muted-foreground block mb-1">Booking Pending Template</label>
                        <textarea
                          rows={3}
                          value={emailSettings.email_template_pending || ''}
                          onChange={(e) => setEmailSettings({ ...emailSettings, email_template_pending: e.target.value })}
                          className="w-full bg-surface-raised border border-border rounded-lg p-3 text-xs text-white font-mono outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Save Email Configuration
                    </button>
                  </form>

                  {/* Delivery History */}
                  <div className="bg-surface p-6 rounded-2xl border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-headline font-bold text-white">Dispatched Email Audit Log ({emailLogs.length})</h3>
                      <button
                        onClick={async () => {
                          const res = await api.getEmailLogs();
                          setEmailLogs(res.logs);
                        }}
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Logs</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-muted-foreground">
                        <thead className="bg-[#0b121a] text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                          <tr>
                            <th className="py-2.5 px-3">Sent At</th>
                            <th className="py-2.5 px-3">Recipient</th>
                            <th className="py-2.5 px-3">Subject</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Inspect</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {emailLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-surface-raised/40">
                              <td className="py-2.5 px-3">{new Date(log.sent_at).toLocaleString()}</td>
                              <td className="py-2.5 px-3 text-white font-medium">{log.recipient_email}</td>
                              <td className="py-2.5 px-3 text-accent truncate max-w-[220px]">{log.subject}</td>
                              <td className="py-2.5 px-3 uppercase text-[10px]">{log.email_type}</td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  {log.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => setPreviewEmailLog(log)}
                                  className="p-1 rounded bg-surface hover:bg-surface-raised border border-border text-muted-foreground hover:text-white"
                                  title="View rendered email preview"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: BUILDING SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h2 className="text-2xl font-headline font-bold text-white">Riverside Building & Public Information</h2>
                    <p className="text-xs text-muted-foreground">
                      Update facility address, phone, email, and listed building amenities presented across the website.
                    </p>
                  </div>

                  <form onSubmit={handleSaveBuildingSettings} className="bg-surface p-6 rounded-2xl border border-border space-y-5">
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">Building Name</label>
                      <input
                        type="text"
                        value={buildingSettings.building_name || 'Riverside Community Hall'}
                        onChange={(e) => setBuildingSettings({ ...buildingSettings, building_name: e.target.value })}
                        className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">Address</label>
                      <input
                        type="text"
                        value={buildingSettings.building_address || '12 High Street, Oakridge, GL54 6AB'}
                        onChange={(e) => setBuildingSettings({ ...buildingSettings, building_address: e.target.value })}
                        className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-tag text-muted-foreground block mb-1">Telephone</label>
                        <input
                          type="text"
                          value={buildingSettings.building_phone || '+44 1234 567 890'}
                          onChange={(e) => setBuildingSettings({ ...buildingSettings, building_phone: e.target.value })}
                          className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="label-tag text-muted-foreground block mb-1">Email</label>
                        <input
                          type="email"
                          value={buildingSettings.building_email || 'info@riversidehall.org.uk'}
                          onChange={(e) => setBuildingSettings({ ...buildingSettings, building_email: e.target.value })}
                          className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">Opening Hours</label>
                      <input
                        type="text"
                        value={buildingSettings.opening_hours || 'Monday – Sunday: 07:30 AM – 11:30 PM'}
                        onChange={(e) => setBuildingSettings({ ...buildingSettings, opening_hours: e.target.value })}
                        className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">
                        Building Facilities (One per line)
                      </label>
                      <textarea
                        rows={6}
                        value={(buildingSettings.building_facilities || []).join('\n')}
                        onChange={(e) => {
                          const list = e.target.value.split('\n').filter(Boolean);
                          setBuildingSettings({ ...buildingSettings, building_facilities: list });
                        }}
                        className="w-full bg-surface-raised border border-border rounded-lg p-3 text-xs text-white outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Save Building Details
                    </button>
                  </form>
                </div>
              )}

            </main>
          </div>

        </motion.div>

        {/* MODAL: Edit / Add Hall */}
        {showHallModal && editingHall && (
          <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
            <div className="bg-[#121b27] border border-border rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-headline font-bold text-white">
                  {editingHall.id ? `Edit ${editingHall.name}` : 'Add New Community Hall'}
                </h3>
                <button onClick={() => setShowHallModal(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveHall} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label-tag text-muted-foreground block mb-1">Hall Name *</label>
                    <input
                      type="text"
                      required
                      value={editingHall.name || ''}
                      onChange={(e) => setEditingHall({ ...editingHall, name: e.target.value })}
                      className="w-full bg-surface border border-border rounded px-3 py-2 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="label-tag text-muted-foreground block mb-1">Suitable For *</label>
                    <input
                      type="text"
                      required
                      value={editingHall.suitable_for || ''}
                      onChange={(e) => setEditingHall({ ...editingHall, suitable_for: e.target.value })}
                      className="w-full bg-surface border border-border rounded px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label-tag text-muted-foreground block mb-1">Capacity (Persons) *</label>
                    <input
                      type="number"
                      required
                      value={editingHall.capacity || 50}
                      onChange={(e) => setEditingHall({ ...editingHall, capacity: Number(e.target.value) })}
                      className="w-full bg-surface border border-border rounded px-3 py-2 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="label-tag text-muted-foreground block mb-1">Price per Session (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editingHall.price_per_session || 3000}
                      onChange={(e) => setEditingHall({ ...editingHall, price_per_session: Number(e.target.value) })}
                      className="w-full bg-surface border border-border rounded px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    value={editingHall.image_url || ''}
                    onChange={(e) => setEditingHall({ ...editingHall, image_url: e.target.value })}
                    className="w-full bg-surface border border-border rounded px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingHall.description || ''}
                    onChange={(e) => setEditingHall({ ...editingHall, description: e.target.value })}
                    className="w-full bg-surface border border-border rounded px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Facilities (Comma-separated)</label>
                  <input
                    type="text"
                    value={(editingHall.facilities || []).join(', ')}
                    onChange={(e) => {
                      const facs = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setEditingHall({ ...editingHall, facilities: facs });
                    }}
                    className="w-full bg-surface border border-border rounded px-3 py-2 text-white outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowHallModal(false)}
                    className="px-4 py-2 rounded bg-surface hover:bg-surface-raised text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-accent text-[#0e1620] hover:bg-[#e4b74b] text-xs font-bold uppercase tracking-wider"
                  >
                    Save Hall
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Reject Booking with Reason */}
        {showRejectModal && selectedBookingForAction && (
          <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
            <div className="bg-[#121b27] border border-border rounded-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-headline font-bold text-white">
                  Decline Booking Request: {selectedBookingForAction.booking_id}
                </h3>
                <button onClick={() => setShowRejectModal(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Provide a reason for rejection. This explanation will be included in the formal email notice sent to{' '}
                <strong className="text-white">{selectedBookingForAction.user_email}</strong>.
              </p>

              <div>
                <label className="label-tag text-muted-foreground block mb-1">Reason for Rejection</label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-surface border border-border rounded px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded bg-surface text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-5 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase"
                >
                  Confirm Rejection & Send Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: View Full Booking & Customer Details */}
        {viewBookingDetails && (
          <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
            <div className="bg-[#121b27] border border-border rounded-2xl max-w-lg w-full p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div>
                  <span className="font-mono text-xs text-accent font-bold">{viewBookingDetails.booking_id}</span>
                  <h3 className="text-xl font-headline font-bold text-white">Reservation Dossier</h3>
                </div>
                <button onClick={() => setViewBookingDetails(null)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-surface p-3 rounded-lg border border-border space-y-1">
                  <span className="label-tag text-accent font-semibold block">Customer Information</span>
                  <div className="text-white font-medium">{viewBookingDetails.user_name}</div>
                  <div className="text-muted-foreground">{viewBookingDetails.user_email} · {viewBookingDetails.user_phone}</div>
                </div>

                <div className="bg-surface p-3 rounded-lg border border-border space-y-1">
                  <span className="label-tag text-accent font-semibold block">Event & Venue Information</span>
                  <div className="text-white font-medium">{viewBookingDetails.hall_name}</div>
                  <div className="text-muted-foreground">Type: {viewBookingDetails.event_type}</div>
                  <div className="text-muted-foreground">Date: {viewBookingDetails.booking_date} ({viewBookingDetails.start_time} - {viewBookingDetails.end_time})</div>
                  <div className="text-muted-foreground">Guests: {viewBookingDetails.guest_count} attendees</div>
                  <div className="text-accent font-bold pt-1">Total Fee: ₹{viewBookingDetails.total_amount.toLocaleString('en-IN')}</div>
                </div>

                <div className="bg-surface p-3 rounded-lg border border-border space-y-1">
                  <span className="label-tag text-accent font-semibold block">Special Instructions / Requirements</span>
                  <p className="text-muted-foreground leading-relaxed">
                    {viewBookingDetails.additional_requirements || 'No special requirements specified.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setViewBookingDetails(null)}
                  className="px-5 py-2 rounded bg-surface hover:bg-surface-raised border border-border text-white text-xs font-semibold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Rendered HTML Email Inspector */}
        {previewEmailLog && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-[#121b27] border border-border rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden">
              <div className="px-6 py-3.5 border-b border-border bg-[#0a1017] flex justify-between items-center">
                <div>
                  <span className="text-xs text-muted-foreground">Email to: {previewEmailLog.recipient_email}</span>
                  <h4 className="text-sm font-bold text-accent">{previewEmailLog.subject}</h4>
                </div>
                <button onClick={() => setPreviewEmailLog(null)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-4 bg-[#0b1118]">
                <iframe
                  title="Sent Email Rendered HTML"
                  srcDoc={previewEmailLog.body_html}
                  className="w-full h-full border border-border rounded-lg bg-[#0e1620]"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </AnimatePresence>
  );
};

