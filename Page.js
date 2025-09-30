// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(express.json());

// Serve frontend files (place your HTML, CSS, JS in ./public)
app.use(express.static(path.join(__dirname, 'public')));

// CORS - allow only local LAN or adjust as needed
app.use(cors({
  origin: '*', // replace * with your LAN IP/domain in production
}));

// --- Config ---
const PORT = process.env.PORT || 5000;
const RECEIVER = process.env.RECEIVER_EMAIL || 'you@domain.com';

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('⚠️ Warning: SMTP_USER or SMTP_PASS not set in env. Emails will fail.');
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true', // false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// verify transporter
transporter.verify((err, success) => {
  if (err) console.error('SMTP verify failed:', err);
  else console.log('SMTP ready to send messages');
});

// --- API ---
app.post('/api/claim', async (req, res) => {
  try {
    const { name, email, phone, message, consent, location } = req.body || {};
    if (!name || !email || !consent) 
      return res.status(400).json({ error: 'name, email, consent are required' });

    // Generate coupon code
    const code = (Math.random().toString(36).slice(2, 9)).toUpperCase();

    // Prepare email content
    const text = `
New promo claim received
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Message: ${message || 'N/A'}
Consent: ${consent}
Location: ${location && location.available ? `lat:${location.latitude}, lng:${location.longitude}, acc:${location.accuracy}` : 'not shared'}
Coupon Code: ${code}
`;

    const html = `
      <h3>New Promo Claim</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
      <p><strong>Coupon Code:</strong> <strong>${code}</strong></p>
      <p><strong>Location:</strong> ${location && location.available ? `${location.latitude}, ${location.longitude}` : 'not shared'}</p>
      ${location && location.latitude ? `<p><a href="https://maps.google.com/?q=${location.latitude},${location.longitude}" target="_blank">Open on Google Maps</a></p>` : ''}
    `;

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: RECEIVER,
      subject: `Promo claim from ${name} <${email}> — code ${code}`,
      text,
      html,
    });

    console.log('Mail sent OK, messageId=', info.messageId);

    // Respond with coupon code
    res.json({ ok: true, code });

  } catch (err) {
    console.error('Error in /api/claim:', err);
    res.status(500).json({ error: 'internal' });
  }
});

// --- Serve frontend for any other route ---
app.get('/offer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
