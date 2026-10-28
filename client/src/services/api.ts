import { Hall, Booking, User, BuildingSettings, AdminOverviewData, EmailNotification } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('riverside_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    return handleResponse(res);
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Halls
  async getHalls(): Promise<{ halls: Hall[] }> {
    const res = await fetch(`${API_BASE}/halls`);
    return handleResponse(res);
  },

  async getHall(idOrSlug: string | number): Promise<{ hall: Hall }> {
    const res = await fetch(`${API_BASE}/halls/${idOrSlug}`);
    return handleResponse(res);
  },

  async getHallAvailability(id: number, date: string): Promise<{ booked_slots: Array<{ start_time: string; end_time: string; status: string; event_type: string }> }> {
    const res = await fetch(`${API_BASE}/halls/${id}/availability?date=${encodeURIComponent(date)}`);
    return handleResponse(res);
  },

  // Bookings
  async checkAvailability(payload: { hall_id: number; booking_date: string; start_time: string; end_time: string }): Promise<{ available: boolean; message: string; conflict?: any }> {
    const res = await fetch(`${API_BASE}/bookings/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async createBooking(payload: Partial<Booking>): Promise<{ message: string; booking: Booking }> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async lookupBookings(query: string): Promise<{ bookings: Booking[] }> {
    const res = await fetch(`${API_BASE}/bookings/lookup?query=${encodeURIComponent(query)}`);
    return handleResponse(res);
  },

  async cancelBooking(bookingId: string, email?: string): Promise<{ message: string; booking: Booking }> {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email })
    });
    return handleResponse(res);
  },

  // Settings
  async getSettings(): Promise<{ settings: BuildingSettings }> {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse(res);
  },

  async updateSettings(settings: Partial<BuildingSettings>): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse(res);
  },

  // Contact / Inquiries
  async submitInquiry(payload: { name: string; email: string; subject: string; message: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // Admin Controller APIs
  async getAdminOverview(): Promise<AdminOverviewData> {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getAdminBookings(filters?: { search?: string; date?: string; hall_id?: string | number; status?: string }): Promise<{ bookings: Booking[] }> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.hall_id) params.append('hall_id', String(filters.hall_id));
    if (filters?.status) params.append('status', filters.status);

    const res = await fetch(`${API_BASE}/admin/bookings?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async approveBooking(id: number): Promise<{ message: string; booking: Booking }> {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async rejectBooking(id: number, reason?: string): Promise<{ message: string; booking: Booking }> {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse(res);
  },

  async cancelAdminBooking(id: number): Promise<{ message: string; booking: Booking }> {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateBookingStatus(id: number, status: string): Promise<{ message: string; booking: Booking }> {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async createHall(payload: Partial<Hall>): Promise<{ message: string; hall: Hall }> {
    const res = await fetch(`${API_BASE}/admin/halls`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async updateHall(id: number, payload: Partial<Hall>): Promise<{ message: string; hall: Hall }> {
    const res = await fetch(`${API_BASE}/admin/halls/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async deleteHall(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/admin/halls/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async toggleHallActive(id: number): Promise<{ message: string; is_active: boolean }> {
    const res = await fetch(`${API_BASE}/admin/halls/${id}/toggle-active`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getAdminUsers(search?: string): Promise<{ users: User[] }> {
    const url = search ? `${API_BASE}/admin/users?search=${encodeURIComponent(search)}` : `${API_BASE}/admin/users`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getEmailSettings(): Promise<{ settings: Record<string, string> }> {
    const res = await fetch(`${API_BASE}/admin/email-settings`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async updateEmailSettings(settings: Record<string, any>): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/admin/email-settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse(res);
  },

  async getEmailLogs(): Promise<{ logs: EmailNotification[] }> {
    const res = await fetch(`${API_BASE}/admin/email-logs`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  // Public notification inspector (view email received by user)
  async getRecentNotifications(email?: string, booking_id?: string): Promise<{ notifications: EmailNotification[] }> {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (booking_id) params.append('booking_id', booking_id);
    const res = await fetch(`${API_BASE}/notifications/recent?${params.toString()}`);
    return handleResponse(res);
  }
};

