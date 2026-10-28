# 🏛️ Riverside Community Hall · Booking & Management System

A modern, responsive, full-stack **Community Hall Booking and Management System** engineered with React, Vite, TypeScript, Tailwind CSS, Framer Motion, Node.js, Express, and SQLite with built-in email notification dispatch.

---

## ✨ Features & Architecture

### 🎨 1. Design System & Aesthetics
- **Theme Colors**: Navy (`hsl(215, 25%, 10%)`), Rich Gold (`hsl(43, 65%, 58%)`), and Warm Ivory (`hsl(40, 25%, 92%)`).
- **Typography**: 
  - Headlines: *Cormorant Garamond*, italic, 700 weight
  - Body: *Inter*, 300–400 weight
  - Labels: *Inter*, 500 weight, uppercase, 10px, letter spacing `0.14em`
- **Visual Style**: High-resolution architectural evening photography, ambient gold glows, frosted glass cards, and fluid Framer Motion transitions.

### 🧭 2. Navigation & Sticky Navbar
- Transparent navy background with backdrop blur.
- Riverside Community Hall gold architectural logo & wordmark.
- Desktop & mobile drawer navigation (`Home`, `Halls`, `Facilities`, `Gallery`, `Contact`, `Book a Hall`).
- Quick actions: **Track Booking**, **Live Email Logs**, and **Sign In / Admin Console**.

### 🌟 3. Hero Section
- Full-screen evening exterior imagery with atmospheric warm glow through tall windows.
- Label: `"YOUR SPACE · YOUR COMMUNITY"`.
- Headline: *"A Space for Every Occasion."*.
- Action buttons: `Book a Hall →` and `Explore Our Halls`.
- Interactive feature chips: *Spacious Venues*, *Affordable Pricing*, *Flexible Booking*, *Modern Facilities*, *Community Friendly*.

### 🏛️ 4. Available Halls (Dynamic & Admin-Editable)
1. **Main Hall**: Capacity 150 · ₹5,000 / session · Elevated stage, acoustic sound system, lighting, banquet tables & chairs.
2. **Meeting Room**: Capacity 30 · ₹1,500 / session · 4K laser projector, fiber Wi-Fi, conference telephony, tables & chairs.
3. **Function Hall**: Capacity 80 · ₹3,000 / session · Catering prep area, surround sound, flexible party seating.
- Each hall features: High-resolution photography, capacity badge, key facilities, session price, **View Details** modal, and **Book Now** trigger.

### 🖼️ 5. Hall Gallery
- Masonry-style desktop layout and single-column mobile view with 6 curated categories:
  - *Main Community Hall Interior*
  - *Wedding Hall with Decorated Stage*
  - *Meeting Room with Conference Tables*
  - *Function Hall with Banquet Seating*
  - *Community Hall Exterior*
  - *Hall with Catering Facilities*
- Hover effects with image zoom, dark gradient overlay, and interactive **Lightbox Modal**.

### 📖 6. Hall Details Dossier
- Dedicated dossier modal with multi-photo gallery carousel, comprehensive venue descriptions, room capacity, included facilities, rules & regulations, cancellation policies, and available standard booking sessions.
- Full building overview:
  - **Address**: 12 High Street, Oakridge, GL54 6AB
  - **Phone**: +44 1234 567 890
  - **Email**: info@riversidehall.org.uk
  - **Building facilities**: Main event hall, Meeting room, Function room, Kitchen & catering area, Washrooms, Accessible entrance, Parking facilities, AV equipment.

### 📝 7. Interactive Booking Engine & Conflict Prevention
- Multi-step booking form: Full Name, Email, Phone, Hall Selection, Event Type, Date, Start Time, End Time, Guests, and Special Requirements.
- **Double-Booking Prevention**: Backend and frontend real-time conflict query preventing overlapping reservations for the same hall and date.
- **Dynamic Pricing Calculator**: Estimates booking price based on duration and hall session rates.
- **Asynchronous Email Dispatches**:
  - User receives pending approval notice
  - Admin receives instant reservation alert
- **Confetti Celebration**: Visual reward on successful submission.
- **Booking Reference**: Unique human-friendly ID (e.g., `RCH-2026-A8F2`).
- **Reservation Tracker**: Patrons can search by booking ID or email to view live status or cancel reservations.

### 🛡️ 8. Secure Admin Dashboard (`/admin`)
- **Authorized Administrator Email**: `abdulayman077@gmail.com`.
- **Backend Authorization**: JWT token verification + strict role check (`req.user.role === 'admin'` and email match).
- **Overview Metrics**: Total halls, Total bookings, Pending reviews, Confirmed bookings, Total registered patrons, and Total revenue (₹).
- **Booking Management**: Search, date filter, hall filter, status filter, customer dossier modal, 1-click **Approve** (triggers confirmation email), **Reject** with reason (triggers rejection email), and **Cancel**.
- **Hall Management**: Create new halls, edit existing pricing/capacities/descriptions, delete halls, and toggle availability.
- **Patron Management**: Search registered users, contact info, and booking counts.
- **Email & Template Settings**: Customize primary administrator email, alert recipients, edit HTML/text email templates, and inspect the real-time delivery log table.
- **Building Settings**: Edit address, phone, email, and listed building facilities.

### ✉️ 9. Email Notification System
- Responsive, branded HTML email templates matching the navy & gold design.
- Integrates with **Nodemailer**:
  - Supports live SMTP configuration via `.env`
  - In-app **Email Notification Viewer** to inspect formatted HTML emails sent to patrons in real-time.
- Stores delivery status (`sent`, `failed`), timestamps, recipient details, and error messages in the `email_notifications` table.

### 📍 10. Facilities, Testimonials & Contact
- **Curated Experiences**: Wedding & Reception Facilities, Community Events, Meetings & Workshops, Birthday Celebrations, Catering Services, Audio & Visual Equipment.
- **Testimonials**: 5-star cards from Sarah T., David R., and Emma W.
- **Booking CTA**: Full-width gold section with `"Plan Your Next Event With Us."` and `"Check Availability →"`.
- **Contact & Location**: Address, phone, operating hours, responsive interactive map, and inquiry submission form.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js LTS (v20+ or v24+)

### 1. Launch the Server (API & Frontend)
```bash
# Navigate to the project directory
cd riverside-community-hall

# Start the Express server (serves the built frontend on port 5000)
npm run start:server
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

### 2. Development Mode (Hot-Reloading)
To run client and server simultaneously during active development:

```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev:server

# Terminal 2: Frontend Vite Dev Server (Port 5173 with auto-proxy to 5000)
npm run dev:client
```
Open **[http://localhost:5173](http://localhost:5173)**.

---

## 🔑 Administrator Credentials & Security

- **Authorized Administrator Email**: `abdulayman077@gmail.com`
- **Admin Password**: `adnanfaruqraaziq`
- **Strict Security**: Direct 1-click access has been removed. You must provide the valid administrator email and password in the Sign In modal to access the Admin Controller and management endpoints.

---

## 📦 Directory Structure
```
riverside-community-hall/
├── client/                     # Frontend (React + Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/         # Hero, HallsList, HallGallery, BookingModal, etc.
│   │   │   └── admin/          # Admin Dashboard & sub-controllers
│   │   ├── context/            # AuthContext (JWT session & user state)
│   │   ├── services/           # REST API client
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Root application orchestrator
│   │   └── index.css           # Design system CSS variables & typography
│   └── dist/                   # Production build
├── server/                     # Backend (Node.js + Express + SQLite + Nodemailer)
│   ├── data/
│   │   └── riverside.db        # SQLite database file
│   └── src/
│       ├── routes/             # Auth, Halls, Bookings, Admin, Settings, Inquiries
│       ├── authMiddleware.js   # JWT & role authorization for abdulayman077@gmail.com
│       ├── db.js               # node:sqlite tables & seeding
│       ├── emailService.js     # Nodemailer dispatch & HTML templates
│       └── index.js            # Express app entry point
├── render.yaml                 # Render Blueprint configuration
└── package.json                # Root monorepo scripts
```

---

## ☁️ Deployment on Render

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `riverside-community-hall`).
2. Push your code:
   ```bash
   git remote add origin https://github.com/<your-username>/riverside-community-hall.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [Render Dashboard](https://dashboard.render.com).
4. Click **New +** ➔ **Web Service** and connect your GitHub repository.
5. Configure the service:
   - **Name**: `riverside-community-hall`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV` = `production`
     - `PORT` = `10000` (Render assigns this automatically)
6. Click **Deploy Web Service**! Render will build the Vite frontend into `client/dist`, install Express dependencies, and launch the single unified service.

