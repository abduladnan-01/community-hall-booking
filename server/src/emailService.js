import nodemailer from 'nodemailer';
import db from './db.js';

let transporter = null;

// Initialize mail transporter
export async function initMailer() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log('[EmailService] Using configured SMTP transport:', process.env.SMTP_HOST);
  } else {
    transporter = nodemailer.createTransport({
      jsonTransport: true
    });
    console.log('[EmailService] Using zero-latency internal mail transport.');
  }
}

// Generate luxury navy, gold, deep burgundy & warm cream responsive HTML email template
function buildHtmlEmail({ title, preheader, contentHtml, booking, hall, building }) {
  const brandGold = '#cca43b';
  const brandBurgundy = '#590907';
  const brandCream = '#E8D2B5';
  const brandSage = '#A5A79B';
  const brandNavy = '#131c26';
  const brandSurface = '#1a2433';
  const brandTextLight = '#f5f1ea';
  const brandMuted = '#A5A79B';
  const brandBorder = '#2a3748';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b1118; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: ${brandTextLight}; }
    .wrapper { width: 100%; max-width: 620px; margin: 30px auto; background-color: ${brandNavy}; border: 1px solid ${brandBorder}; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    .header { background: linear-gradient(180deg, #590907 0%, #131c26 100%); padding: 36px 32px 24px; text-align: center; border-bottom: 2px solid ${brandCream}; }
    .logo-badge { display: inline-block; padding: 6px 14px; background: rgba(89,9,7,0.85); border: 1px solid ${brandCream}; border-radius: 50px; color: ${brandCream}; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 12px; }
    .header-title { font-family: 'Georgia', serif; font-style: italic; font-size: 28px; font-weight: 700; color: #ffffff; margin: 0 0 6px 0; }
    .header-sub { font-size: 13px; color: ${brandSage}; letter-spacing: 0.05em; margin: 0; }
    .body { padding: 32px; font-size: 15px; line-height: 1.6; color: #e2e8f0; }
    .details-card { background: ${brandSurface}; border: 1px solid ${brandBorder}; border-radius: 10px; padding: 22px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: ${brandSage}; font-weight: 500; }
    .detail-value { color: ${brandCream}; font-weight: 600; text-align: right; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
    .status-confirmed { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .status-pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .status-rejected { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .status-cancelled { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.3); }
    .building-box { background: rgba(89,9,7,0.15); border-left: 3px solid ${brandCream}; padding: 18px 20px; margin: 26px 0; border-radius: 0 8px 8px 0; }
    .building-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; color: ${brandCream}; font-weight: 700; margin: 0 0 8px 0; }
    .building-info { font-size: 13px; color: ${brandSage}; line-height: 1.5; margin: 0; }
    .footer { background-color: #0d141c; padding: 24px 32px; text-align: center; border-top: 1px solid ${brandBorder}; font-size: 12px; color: ${brandSage}; }
    .footer a { color: ${brandCream}; text-decoration: none; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <div class="wrapper">
    <div class="header">
      <div class="logo-badge">Riverside Community Hall</div>
      <h1 class="header-title">${title}</h1>
      <p class="header-sub">12 High Street, Oakridge, GL54 6AB</p>
    </div>
    <div class="body">
      ${contentHtml}
      
      ${booking ? `
      <div class="details-card">
        <div class="detail-row">
          <span class="detail-label">Booking Reference</span>
          <span class="detail-value" style="color: ${brandGold}; font-family: monospace;">${booking.booking_id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue / Hall</span>
          <span class="detail-value">${hall?.name || booking.hall_name || 'Riverside Hall'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Event Type</span>
          <span class="detail-value">${booking.event_type}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking Date</span>
          <span class="detail-value">${booking.booking_date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Reserved Hours</span>
          <span class="detail-value">${booking.start_time} - ${booking.end_time}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Guest Count</span>
          <span class="detail-value">${booking.guest_count} attendees</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total Amount</span>
          <span class="detail-value" style="color: ${brandGold};">₹${Number(booking.total_amount).toLocaleString('en-IN')}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking Status</span>
          <span class="detail-value">
            <span class="status-badge status-${(booking.status || 'pending').toLowerCase()}">${booking.status}</span>
          </span>
        </div>
      </div>
      ` : ''}

      <div class="building-box">
        <div class="building-title">Building Details & Contact</div>
        <p class="building-info">
          <strong>${building.name || 'Riverside Community Hall'}</strong><br>
          ${building.address || '12 High Street, Oakridge, GL54 6AB'}<br>
          Phone: ${building.phone || '+44 1234 567 890'}<br>
          Email: <a href="mailto:${building.email || 'info@riversidehall.org.uk'}" style="color:${brandGold};">${building.email || 'info@riversidehall.org.uk'}</a>
        </p>
      </div>

      <p style="font-size: 13px; color: ${brandMuted}; margin-top: 24px;">
        Please contact our office if you need to make any alterations to your booking or require special equipment staging.
      </p>

      <p style="margin-top: 24px; font-size: 14px; color: #ffffff;">
        Best regards,<br>
        <strong>Riverside Community Hall Management</strong>
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">© 2026 Riverside Community Hall. All rights reserved.</p>
      <p style="margin: 0;">Preserving Heritage · Inspiring Gatherings · Serving the Community</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Get current building settings
function getBuildingSettings() {
  const rows = db.prepare('SELECT key, value FROM admin_settings').all();
  const settings = {};
  for (const r of rows) {
    settings[r.key] = r.value;
  }
  return {
    name: settings.building_name || 'Riverside Community Hall',
    address: settings.building_address || '12 High Street, Oakridge, GL54 6AB',
    phone: settings.building_phone || '+44 1234 567 890',
    email: settings.building_email || 'info@riversidehall.org.uk'
  };
}

// Send and log email helper
async function dispatchEmail({ toEmail, toName, subject, emailType, bookingId, htmlBody }) {
  let status = 'sent';
  let errorMessage = null;

  try {
    if (!transporter) {
      await initMailer();
    }

    const info = await transporter.sendMail({
      from: `"Riverside Community Hall" <${process.env.SMTP_FROM || 'info@riversidehall.org.uk'}>`,
      to: `"${toName}" <${toEmail}>`,
      subject: subject,
      html: htmlBody
    });

    console.log(`[EmailService] Dispatched ${emailType} email to ${toEmail}. MessageId:`, info.messageId);
    if (nodemailer.getTestMessageUrl && info) {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.log('[EmailService] Test Preview URL:', preview);
    }
  } catch (err) {
    console.error(`[EmailService] Error dispatching email to ${toEmail}:`, err.message);
    status = 'failed';
    errorMessage = err.message;
  }

  // Record in database table email_notifications
  try {
    db.prepare(`
      INSERT INTO email_notifications (booking_id, recipient_email, recipient_name, subject, email_type, body_html, status, error_message, sent_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      bookingId || null,
      toEmail,
      toName,
      subject,
      emailType,
      htmlBody,
      status,
      errorMessage,
      new Date().toISOString()
    );
  } catch (dbErr) {
    console.error('[EmailService] Failed to record in email_notifications:', dbErr.message);
  }

  return { success: status === 'sent', error: errorMessage };
}

// 1. Send Booking Confirmation Email (on Admin Approval)
export async function sendBookingConfirmationEmail(booking, hall) {
  const building = getBuildingSettings();
  const title = 'Community Hall Booking Confirmation';
  const preheader = `Your reservation ${booking.booking_id} for ${hall?.name || 'Riverside Hall'} is confirmed!`;

  const contentHtml = `
    <p>Dear <strong>${booking.user_name}</strong>,</p>
    <p>Thank you for choosing Riverside Community Hall. We are delighted to confirm your venue reservation.</p>
    <p>Your booking has been formally approved by our administration. Please review your reservation details below:</p>
  `;

  const htmlBody = buildHtmlEmail({
    title,
    preheader,
    contentHtml,
    booking: { ...booking, status: 'Confirmed' },
    hall,
    building
  });

  return dispatchEmail({
    toEmail: booking.user_email,
    toName: booking.user_name,
    subject: title,
    emailType: 'confirmation',
    bookingId: booking.booking_id,
    htmlBody
  });
}

// 2. Send Booking Submission (Pending Review) Email
export async function sendBookingPendingEmail(booking, hall) {
  const building = getBuildingSettings();
  const title = 'Booking Request Received · Pending Review';
  const preheader = `Your booking request ${booking.booking_id} has been received and is under review.`;

  const contentHtml = `
    <p>Dear <strong>${booking.user_name}</strong>,</p>
    <p>Thank you for submitting your booking request for <strong>Riverside Community Hall</strong>.</p>
    <p>Our team has received your application and is currently verifying date availability and specific setup requirements. You will receive an official confirmation notice once your reservation is confirmed.</p>
  `;

  const htmlBody = buildHtmlEmail({
    title,
    preheader,
    contentHtml,
    booking: { ...booking, status: 'Pending' },
    hall,
    building
  });

  return dispatchEmail({
    toEmail: booking.user_email,
    toName: booking.user_name,
    subject: 'Booking Request Received - Riverside Community Hall',
    emailType: 'pending',
    bookingId: booking.booking_id,
    htmlBody
  });
}

// 3. Send Booking Rejection Email
export async function sendBookingRejectionEmail(booking, hall, reason) {
  const building = getBuildingSettings();
  const title = 'Update on Your Booking Request';
  const preheader = `Important update regarding your booking request ${booking.booking_id}.`;

  const contentHtml = `
    <p>Dear <strong>${booking.user_name}</strong>,</p>
    <p>Thank you for your interest in reserving Riverside Community Hall.</p>
    <p>We regret to inform you that your booking request for <strong>${hall?.name || 'the hall'}</strong> on <strong>${booking.booking_date}</strong> could not be approved at this time.</p>
    
    <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 14px 18px; border-radius: 0 6px 6px 0; margin: 18px 0; color: #fca5a5; font-size: 14px;">
      <strong>Reason:</strong> ${reason || 'Capacity conflict or scheduled venue maintenance on this date.'}
    </div>

    <p>If you would like to reschedule for an alternative date or explore another hall in our facility, please feel free to submit a new inquiry or reply directly to this email.</p>
  `;

  const htmlBody = buildHtmlEmail({
    title,
    preheader,
    contentHtml,
    booking: { ...booking, status: 'Rejected' },
    hall,
    building
  });

  return dispatchEmail({
    toEmail: booking.user_email,
    toName: booking.user_name,
    subject: `Booking Request Declined - ${booking.booking_id}`,
    emailType: 'rejection',
    bookingId: booking.booking_id,
    htmlBody
  });
}

// 4. Send Booking Cancellation Email
export async function sendBookingCancellationEmail(booking, hall) {
  const building = getBuildingSettings();
  const title = 'Booking Cancellation Notice';
  const preheader = `Your reservation ${booking.booking_id} has been cancelled.`;

  const contentHtml = `
    <p>Dear <strong>${booking.user_name}</strong>,</p>
    <p>This email is to confirm that your reservation for <strong>${hall?.name || 'Riverside Community Hall'}</strong> on <strong>${booking.booking_date}</strong> has been cancelled.</p>
    <p>If this cancellation was made in error, or if you wish to re-book in the future, please do not hesitate to contact our office.</p>
  `;

  const htmlBody = buildHtmlEmail({
    title,
    preheader,
    contentHtml,
    booking: { ...booking, status: 'Cancelled' },
    hall,
    building
  });

  return dispatchEmail({
    toEmail: booking.user_email,
    toName: booking.user_name,
    subject: `Booking Cancellation - ${booking.booking_id}`,
    emailType: 'cancellation',
    bookingId: booking.booking_id,
    htmlBody
  });
}

// 5. Send Admin Notification when new booking arrives
export async function sendAdminBookingAlert(booking, hall) {
  const building = getBuildingSettings();
  const adminEmailSetting = db.prepare('SELECT value FROM admin_settings WHERE key = ?').get('notification_recipients');
  const adminRecipient = adminEmailSetting?.value || 'abdulayman077@gmail.com';

  const title = 'New Booking Request Received';
  const preheader = `New booking request ${booking.booking_id} submitted by ${booking.user_name}`;

  const contentHtml = `
    <p>A new reservation request has been submitted on the Riverside Community Hall portal:</p>
    <p>
      <strong>Customer:</strong> ${booking.user_name} (${booking.user_email}, ${booking.user_phone})<br>
      <strong>Hall:</strong> ${hall?.name || 'Selected Hall'}<br>
      <strong>Date & Time:</strong> ${booking.booking_date} (${booking.start_time} - ${booking.end_time})<br>
      <strong>Special Notes:</strong> ${booking.additional_requirements || 'None provided'}
    </p>
    <p>Please log in to the administrator console to approve or reject this request.</p>
  `;

  const htmlBody = buildHtmlEmail({
    title,
    preheader,
    contentHtml,
    booking,
    hall,
    building
  });

  return dispatchEmail({
    toEmail: adminRecipient,
    toName: 'Hall Administrator',
    subject: `[Admin Alert] New Booking Request: ${booking.booking_id} (${booking.user_name})`,
    emailType: 'admin_alert',
    bookingId: booking.booking_id,
    htmlBody
  });
}
