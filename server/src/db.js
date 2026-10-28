import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.resolve(dataDir, 'riverside.db');
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS halls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      capacity INTEGER NOT NULL,
      price_per_session INTEGER NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT,
      suitable_for TEXT,
      facilities TEXT NOT NULL,
      image_url TEXT NOT NULL,
      gallery TEXT NOT NULL,
      rules TEXT,
      cancellation_policy TEXT,
      available_sessions TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      hall_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      user_phone TEXT NOT NULL,
      event_type TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      guest_count INTEGER NOT NULL,
      additional_requirements TEXT,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      rejection_reason TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      description TEXT,
      icon TEXT,
      is_building_facility INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS email_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT,
      recipient_email TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      email_type TEXT NOT NULL,
      body_html TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'sent',
      error_message TEXT,
      sent_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at TEXT NOT NULL
    );
  `);

  // Seed / update default admin user with required password
  const adminEmail = 'abdulayman077@gmail.com';
  const adminPassword = 'adnanfaruqraaziq';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(adminPassword, salt);

  const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
  if (!existingAdmin) {
    db.prepare(`
      INSERT INTO users (name, email, password_hash, phone, role, created_at)
      VALUES (?, ?, ?, ?, 'admin', ?)
    `).run('Authorized Administrator', adminEmail, hash, '+44 1234 567 890', new Date().toISOString());
    console.log(`[DB] Seeded admin user: ${adminEmail}`);
  } else {
    db.prepare('UPDATE users SET password_hash = ?, role = ? WHERE email = ?').run(hash, 'admin', adminEmail);
    console.log(`[DB] Updated admin credentials for: ${adminEmail}`);
  }

  // Seed regular demo user
  const demoEmail = 'guest@riversidehall.org.uk';
  const existingDemo = db.prepare('SELECT * FROM users WHERE email = ?').get(demoEmail);
  if (!existingDemo) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('Guest@123', salt);
    db.prepare(`
      INSERT INTO users (name, email, password_hash, phone, role, created_at)
      VALUES (?, ?, ?, ?, 'user', ?)
    `).run('Eleanor Vance', demoEmail, hash, '+44 7911 123456', new Date().toISOString());
  }

  // Seed initial halls if none exist
  const hallCount = db.prepare('SELECT COUNT(*) as count FROM halls').get().count;
  if (hallCount === 0) {
    const hallsData = [
      {
        name: 'Main Hall',
        slug: 'main-hall',
        capacity: 150,
        price_per_session: 5000,
        description: 'Our premier Main Hall offers a majestic architectural setting equipped with an elevated performance stage, professional acoustic sound treatment, intelligent stage lighting, and spacious banquet layouts. Perfectly proportioned for grand wedding receptions, formal banquets, milestone anniversaries, and high-capacity community celebrations.',
        short_description: 'Spacious grandeur featuring elevated stage, acoustic architecture, and full banquet setup.',
        suitable_for: 'Weddings, Receptions, and Large Events',
        facilities: JSON.stringify(['Stage', 'Sound System', 'Stage Lighting', 'Banquet Tables', 'Chairs', 'Air Conditioning', 'Dressing Rooms', 'Podium']),
        image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80',
        gallery: JSON.stringify([
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
        ]),
        rules: 'No open flames without prior permit. Music and live amplification must cease by 23:00. Hirer is responsible for leaving the venue in a tidy condition.',
        cancellation_policy: 'Full refund if cancelled at least 14 days prior to booking date. 50% refund between 7 and 13 days. Non-refundable within 7 days.',
        available_sessions: JSON.stringify([
          'Morning Session (08:00 - 13:00)',
          'Afternoon Session (13:30 - 18:30)',
          'Evening Session (19:00 - 23:30)',
          'Full Day (08:00 - 23:30)'
        ]),
        is_active: 1
      },
      {
        name: 'Meeting Room',
        slug: 'meeting-room',
        capacity: 30,
        price_per_session: 1500,
        description: 'An executive, distraction-free environment tailored for board meetings, interactive seminars, strategy workshops, and educational presentations. Equipped with ceiling-mounted 4K projection, high-speed fiber Wi-Fi, conference telephony, and ergonomic modular boardroom tables.',
        short_description: 'Sophisticated professional setting with 4K projection, conference telephony, and fiber Wi-Fi.',
        suitable_for: 'Meetings, Workshops, and Seminars',
        facilities: JSON.stringify(['Projector', 'Wi-Fi', 'Tables', 'Chairs', 'Whiteboard', 'Conference Phone', 'Tea/Coffee Station']),
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
        gallery: JSON.stringify([
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80'
        ]),
        rules: 'Quiet hours observed in consideration of adjacent spaces. Food allowed in designated refreshment counter only.',
        cancellation_policy: 'Full refund with 48 hours notice. 50% refund with 24 hours notice.',
        available_sessions: JSON.stringify([
          'Morning Session (09:00 - 13:00)',
          'Afternoon Session (13:30 - 17:30)',
          'Evening Session (18:00 - 22:00)'
        ]),
        is_active: 1
      },
      {
        name: 'Function Hall',
        slug: 'function-hall',
        capacity: 80,
        price_per_session: 3000,
        description: 'A vibrant, multifaceted space engineered for intimate parties, family reunions, birthday milestones, and social community banquets. Features direct access to the catering prep area, surround sound audio inputs, dimmable ambient mood lighting, and flexible furniture arrangements.',
        short_description: 'Warm, adaptable venue with direct catering access, audio inputs, and ambient lighting.',
        suitable_for: 'Birthdays, Family Gatherings, and Celebrations',
        facilities: JSON.stringify(['Catering Area', 'Sound System', 'Flexible Seating', 'Ambient Lighting', 'Bar Counter', 'Outdoor Patio Access']),
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
        gallery: JSON.stringify([
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80'
        ]),
        rules: 'Decorations must be attached using non-marking fixtures. Alcohol service requires standard community hall liquor acknowledgement.',
        cancellation_policy: 'Full refund if cancelled 7 days prior. 50% refund within 3 to 6 days.',
        available_sessions: JSON.stringify([
          'Lunch Session (11:00 - 16:00)',
          'Dinner Session (17:00 - 22:30)',
          'Full Day (11:00 - 22:30)'
        ]),
        is_active: 1
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO halls (name, slug, capacity, price_per_session, description, short_description, suitable_for, facilities, image_url, gallery, rules, cancellation_policy, available_sessions, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const h of hallsData) {
      insertStmt.run(
        h.name,
        h.slug,
        h.capacity,
        h.price_per_session,
        h.description,
        h.short_description,
        h.suitable_for,
        h.facilities,
        h.image_url,
        h.gallery,
        h.rules,
        h.cancellation_policy,
        h.available_sessions,
        h.is_active,
        new Date().toISOString()
      );
    }
    console.log('[DB] Seeded initial halls: Main Hall, Meeting Room, Function Hall.');
  }

  // Seed admin settings
  const defaultSettings = [
    ['admin_email', 'abdulayman077@gmail.com'],
    ['notification_recipients', 'abdulayman077@gmail.com'],
    ['building_name', 'Riverside Community Hall'],
    ['building_address', '12 High Street, Oakridge, GL54 6AB'],
    ['building_phone', '9353916328'],
    ['building_email', 'faruqh042@gmail.com'],
    ['opening_hours', 'Monday – Sunday: 07:30 AM – 11:30 PM'],
    ['building_facilities', JSON.stringify([
      'Main event hall',
      'Meeting room',
      'Function room',
      'Kitchen and catering area',
      'Washrooms',
      'Accessible entrance',
      'Parking facilities',
      'Audio and visual equipment'
    ])],
    ['email_template_confirmation', 'Dear {{user_name}},\n\nThank you for choosing Riverside Community Hall.\n\nYour booking details are:\nBooking ID: {{booking_id}}\nHall Name: {{hall_name}}\nEvent Type: {{event_type}}\nBooking Date: {{booking_date}}\nStart Time: {{start_time}}\nEnd Time: {{end_time}}\nNumber of Guests: {{guest_count}}\nEstimated Amount: {{booking_amount}}\nBooking Status: {{booking_status}}\n\nBuilding Details\nRiverside Community Hall\n12 High Street, Oakridge, GL54 6AB\nPhone: +44 1234 567 890\nEmail: info@riversidehall.org.uk\n\nPlease contact us if you need to make any changes to your booking.\n\nThank you for choosing Riverside Community Hall.\n\nBest regards,\nRiverside Community Hall Management'],
    ['email_template_pending', 'Dear {{user_name}},\n\nThank you for submitting your booking request for Riverside Community Hall.\n\nYour booking request has been received and is pending administrator review:\nBooking ID: {{booking_id}}\nHall Name: {{hall_name}}\nEvent Type: {{event_type}}\nBooking Date: {{booking_date}}\nStart Time: {{start_time}}\nEnd Time: {{end_time}}\nNumber of Guests: {{guest_count}}\nEstimated Amount: {{booking_amount}}\nBooking Status: Pending Review\n\nBuilding Details\nRiverside Community Hall\n12 High Street, Oakridge, GL54 6AB\nPhone: +44 1234 567 890\nEmail: info@riversidehall.org.uk\n\nOur team will review your booking and notify you within 24 hours.\n\nBest regards,\nRiverside Community Hall Management'],
    ['email_template_rejection', 'Dear {{user_name}},\n\nWe regret to inform you that your booking request {{booking_id}} for {{hall_name}} on {{booking_date}} cannot be accepted at this time.\n\nReason: {{rejection_reason}}\n\nIf you would like to explore alternative dates or spaces, please reach out to our management team.\n\nBuilding Details\nRiverside Community Hall\n12 High Street, Oakridge, GL54 6AB\nPhone: +44 1234 567 890\nEmail: info@riversidehall.org.uk\n\nBest regards,\nRiverside Community Hall Management'],
    ['email_template_cancellation', 'Dear {{user_name}},\n\nThis email confirms that your booking {{booking_id}} for {{hall_name}} scheduled on {{booking_date}} has been cancelled.\n\nBooking ID: {{booking_id}}\nHall Name: {{hall_name}}\nDate: {{booking_date}}\nTime: {{start_time}} - {{end_time}}\nCancellation Status: Cancelled\n\nBuilding Details\nRiverside Community Hall\n12 High Street, Oakridge, GL54 6AB\nPhone: +44 1234 567 890\nEmail: info@riversidehall.org.uk\n\nBest regards,\nRiverside Community Hall Management']
  ];

  const checkSetting = db.prepare('SELECT value FROM admin_settings WHERE key = ?');
  const insertSetting = db.prepare('INSERT INTO admin_settings (key, value) VALUES (?, ?)');

  for (const [key, value] of defaultSettings) {
    if (!checkSetting.get(key)) {
      insertSetting.run(key, value);
    }
  }

  // Seed building facilities
  const facCount = db.prepare('SELECT COUNT(*) as count FROM facilities').get().count;
  if (facCount === 0) {
    const facilitiesList = [
      { name: 'Wedding & Reception Hall', category: 'Events', description: 'Grand ballroom space with stage, banquet lighting, and dancefloor capabilities.', icon: 'PartyPopper' },
      { name: 'Community Events', category: 'Gatherings', description: 'Flexible layouts accommodating town halls, exhibitions, and cultural festivities.', icon: 'Users' },
      { name: 'Meetings & Workshops', category: 'Corporate', description: 'Executive boardroom and seminar setups with presentation AV and breakout zones.', icon: 'Briefcase' },
      { name: 'Birthday Celebrations', category: 'Social', description: 'Festive atmospheres with banquet seating, patio access, and catering facilities.', icon: 'Cake' },
      { name: 'Catering Services', category: 'Dining', description: 'Commercial kitchen staging, food prep refrigeration, and warming counters.', icon: 'UtensilsCrossed' },
      { name: 'Audio & Visual Equipment', category: 'Technology', description: 'Surround sound speakers, wireless microphones, 4K digital projectors, and stage spots.', icon: 'Volume2' }
    ];

    const insertFac = db.prepare('INSERT INTO facilities (name, category, description, icon, is_building_facility) VALUES (?, ?, ?, ?, 1)');
    for (const f of facilitiesList) {
      insertFac.run(f.name, f.category, f.description, f.icon);
    }
  }

  // Seed sample bookings if none exist
  const bookingCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  if (bookingCount === 0) {
    const mainHall = db.prepare('SELECT id FROM halls WHERE slug = ?').get('main-hall');
    const meetingRoom = db.prepare('SELECT id FROM halls WHERE slug = ?').get('meeting-room');
    const functionHall = db.prepare('SELECT id FROM halls WHERE slug = ?').get('function-hall');

    const sampleBookings = [
      {
        booking_id: 'RCH-2026-1001',
        hall_id: mainHall?.id || 1,
        user_name: 'David Reynolds',
        user_email: 'david.reynolds@example.com',
        user_phone: '+44 7700 900123',
        event_type: 'Wedding Reception',
        booking_date: '2026-11-14',
        start_time: '14:00',
        end_time: '23:00',
        guest_count: 140,
        additional_requirements: 'Round tables, stage microphones, wedding arch placement',
        total_amount: 5000,
        status: 'Confirmed'
      },
      {
        booking_id: 'RCH-2026-1002',
        hall_id: meetingRoom?.id || 2,
        user_name: 'Sarah Jenkins',
        user_email: 's.jenkins@techgrowth.co.uk',
        user_phone: '+44 7700 900456',
        event_type: 'Corporate Workshop',
        booking_date: '2026-11-05',
        start_time: '09:00',
        end_time: '13:00',
        guest_count: 24,
        additional_requirements: 'Dual HDMI projection, flipcharts, and tea service',
        total_amount: 1500,
        status: 'Pending'
      },
      {
        booking_id: 'RCH-2026-1003',
        hall_id: functionHall?.id || 3,
        user_name: 'Marcus Thorne',
        user_email: 'marcus.thorne@gmail.com',
        user_phone: '+44 7700 900789',
        event_type: '50th Birthday Party',
        booking_date: '2026-11-20',
        start_time: '18:00',
        end_time: '23:00',
        guest_count: 70,
        additional_requirements: 'Catering counter warming access and DJ audio plug-in',
        total_amount: 3000,
        status: 'Confirmed'
      }
    ];

    const insertBooking = db.prepare(`
      INSERT INTO bookings (booking_id, hall_id, user_name, user_email, user_phone, event_type, booking_date, start_time, end_time, guest_count, additional_requirements, total_amount, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const b of sampleBookings) {
      insertBooking.run(
        b.booking_id,
        b.hall_id,
        b.user_name,
        b.user_email,
        b.user_phone,
        b.event_type,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.guest_count,
        b.additional_requirements,
        b.total_amount,
        b.status,
        new Date().toISOString(),
        new Date().toISOString()
      );
    }
    console.log('[DB] Seeded initial sample bookings.');
  }

  console.log('[DB] Database tables initialized and ready.');
}

export default db;
