export interface Hall {
  id: number;
  name: string;
  slug: string;
  capacity: number;
  price_per_session: number;
  description: string;
  short_description?: string;
  suitable_for: string;
  facilities: string[];
  image_url: string;
  gallery: string[];
  rules?: string;
  cancellation_policy?: string;
  available_sessions: string[];
  is_active: boolean;
  created_at?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Completed';

export interface Booking {
  id: number;
  booking_id: string;
  user_id?: number | null;
  hall_id: number;
  hall_name?: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  event_type: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  additional_requirements?: string;
  total_amount: number;
  status: BookingStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  created_at: string;
  booking_count?: number;
}

export interface Facility {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
}

export interface EmailNotification {
  id: number;
  booking_id?: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  email_type: string;
  body_html: string;
  status: string;
  error_message?: string;
  sent_at: string;
}

export interface BuildingSettings {
  building_name?: string;
  building_address?: string;
  building_phone?: string;
  building_email?: string;
  opening_hours?: string;
  building_facilities?: string[];
  admin_email?: string;
  notification_recipients?: string;
  [key: string]: any;
}

export interface AdminOverviewData {
  metrics: {
    totalHalls: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    totalUsers: number;
    totalRevenue: number;
  };
  recentBookings: Booking[];
  hallStats: Array<{
    name: string;
    booking_count: number;
    hall_revenue: number;
  }>;
}

