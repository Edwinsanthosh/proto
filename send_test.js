require('dotenv').config();
const nodemailer = require('nodemailer');

(async()=>{
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  try {
    const ok = await transporter.verify();
    console.log('verify ok', ok);
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: 'Test mail from send_test.js',
      text: 'This is a test'
    });
    console.log('sent', info.messageId);
  } catch (e) {
    console.error('send test failed', e);
  }
})();
