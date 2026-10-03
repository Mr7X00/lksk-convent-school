const nodemailer = require('nodemailer');

class EmailService {
  /**
   * Helper to create transporter only if configured
   */
  static getTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (!host || !user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
      connectionTimeout: 8000,
    });
  }

  /**
   * Notify school administrators of a new contact message
   */
  static async sendContactNotification(inquiry) {
    try {
      const transporter = this.getTransporter();
      const recipient = process.env.MAIL_TO || process.env.SMTP_USER || 'lkskconventschool@gmail.com';
      const sender = process.env.MAIL_FROM || `"L.K.S.K Convent School Website" <${process.env.SMTP_USER || 'lkskconventschool@gmail.com'}>`;
      const adminBaseUrl = (process.env.PUBLIC_SITE_URL || '').replace(/\/+$/, '');

      if (!transporter) {
        console.log(`[EmailService] Notice: SMTP not configured. Contact inquiry from "${inquiry.name}" recorded safely in database.`);
        return { delivered: false, reason: 'SMTP_NOT_CONFIGURED' };
      }

      const formattedDate = new Date(inquiry.createdAt || Date.now()).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });

      const subject = `[Contact Inquiry] ${inquiry.subject || 'New Message'} - ${inquiry.name}`;
      const text = `
New Contact Inquiry Received - L.K.S.K Convent School

Sender: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone || 'Not provided'}
Subject: ${inquiry.subject}
Date: ${formattedDate}

Message:
${inquiry.message}

Review this inquiry in the Admin Portal:
${adminBaseUrl ? `${adminBaseUrl}/admin/#/inquiries` : '/admin/#/inquiries'}
      `.trim();

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; color: #ffffff; padding: 18px 24px;">
            <h2 style="margin: 0; font-size: 18px; font-weight: bold;">L.K.S.K Convent School</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">New Contact Inquiry Notification</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; color: #334155; font-size: 14px; line-height: 1.6;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 120px;"><strong>Sender Name:</strong></td>
                <td style="padding: 6px 0; color: #0f172a;"><strong>${escapeHtml(inquiry.name)}</strong></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td>
                <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(inquiry.email)}" style="color: #2563eb;">${escapeHtml(inquiry.email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Phone:</strong></td>
                <td style="padding: 6px 0;">${escapeHtml(inquiry.phone || 'Not provided')}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Subject:</strong></td>
                <td style="padding: 6px 0; color: #0f172a;">${escapeHtml(inquiry.subject)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Received Date:</strong></td>
                <td style="padding: 6px 0;">${formattedDate}</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #475569;">Message Details:</p>
              <p style="margin: 0; white-space: pre-wrap; color: #1e293b;">${escapeHtml(inquiry.message)}</p>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 12px 24px; font-size: 11px; color: #64748b; text-align: center;">
            This is an automated notification from L.K.S.K Convent School portal (Panditpur, Sohawal, Ayodhya).
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: sender,
        to: recipient,
        subject,
        text,
        html,
      });

      console.log(`[EmailService] Contact notification sent to ${recipient} for "${inquiry.name}"`);
      return { delivered: true };
    } catch (err) {
      console.warn(`[EmailService] Warning: Failed to send contact notification: ${err.message}`);
      return { delivered: false, error: err.message };
    }
  }

  /**
   * Notify school admissions team of a prospective student registration
   */
  static async sendAdmissionNotification(inquiry) {
    try {
      const transporter = this.getTransporter();
      const recipient = process.env.MAIL_TO || process.env.SMTP_USER || 'lkskconventschool@gmail.com';
      const sender = process.env.MAIL_FROM || `"L.K.S.K Admissions Office" <${process.env.SMTP_USER || 'lkskconventschool@gmail.com'}>`;
      const adminBaseUrl = (process.env.PUBLIC_SITE_URL || '').replace(/\/+$/, '');

      if (!transporter) {
        console.log(`[EmailService] Notice: SMTP not configured. Admission inquiry for student "${inquiry.studentName}" recorded safely.`);
        return { delivered: false, reason: 'SMTP_NOT_CONFIGURED' };
      }

      const formattedDate = new Date(inquiry.createdAt || Date.now()).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });

      const grade = inquiry.classSeeking || inquiry.gradeApplying || 'Not specified';
      const subject = `[Admission Application] ${inquiry.studentName} (${grade}) - Session ${inquiry.academicYear || '2026-27'}`;
      
      const text = `
New Admission Application - L.K.S.K Convent School

Student: ${inquiry.studentName}
Class / Grade Applying: ${grade}
Parent / Guardian: ${inquiry.parentName}
Contact Phone: ${inquiry.phone}
Email: ${inquiry.email}
Address: ${inquiry.address || 'Not provided'}
Gender: ${inquiry.gender || 'Not specified'}
Date of Birth: ${inquiry.dateOfBirth ? new Date(inquiry.dateOfBirth).toLocaleDateString('en-IN') : 'Not specified'}
Session: ${inquiry.academicYear || '2026-27'}
Submission Time: ${formattedDate}

Additional Parent Notes / Queries:
${inquiry.message || 'None provided'}

Access the inquiry directly in the Admin Admission CRM:
${adminBaseUrl ? `${adminBaseUrl}/admin/#/admissions` : '/admin/#/admissions'}
      `.trim();

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; color: #ffffff; padding: 20px 24px; border-bottom: 3px solid #d97706;">
            <h2 style="margin: 0; font-size: 18px; font-weight: bold;">L.K.S.K Convent School — Admissions</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #cbd5e1;">New Prospective Student Registration — Academic Session ${escapeHtml(inquiry.academicYear || '2026–27')}</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; color: #334155; font-size: 13px; line-height: 1.6;">
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin-bottom: 18px;">
              <h3 style="margin: 0 0 10px 0; font-size: 13px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Student Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b; width: 140px;">Student Name:</td>
                  <td style="padding: 4px 0; color: #0f172a; font-weight: bold; font-size: 14px;">${escapeHtml(inquiry.studentName)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Class Seeking:</td>
                  <td style="padding: 4px 0; color: #1e40af; font-weight: bold;">${escapeHtml(grade)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Gender:</td>
                  <td style="padding: 4px 0;">${escapeHtml(inquiry.gender || 'Not specified')}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Date of Birth:</td>
                  <td style="padding: 4px 0;">${inquiry.dateOfBirth ? new Date(inquiry.dateOfBirth).toLocaleDateString('en-IN') : 'Not specified'}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin-bottom: 18px;">
              <h3 style="margin: 0 0 10px 0; font-size: 13px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Parent & Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b; width: 140px;">Parent / Guardian:</td>
                  <td style="padding: 4px 0; color: #0f172a; font-weight: bold;">${escapeHtml(inquiry.parentName)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Contact Phone:</td>
                  <td style="padding: 4px 0; font-weight: bold;"><a href="tel:${escapeHtml(inquiry.phone)}" style="color: #059669; text-decoration: none;">${escapeHtml(inquiry.phone)}</a></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Email Address:</td>
                  <td style="padding: 4px 0;"><a href="mailto:${escapeHtml(inquiry.email)}" style="color: #2563eb;">${escapeHtml(inquiry.email)}</a></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Residential Address:</td>
                  <td style="padding: 4px 0;">${escapeHtml(inquiry.address || 'Not specified')}</td>
                </tr>
              </table>
            </div>

            ${inquiry.message ? `
            <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 12px 14px; margin: 16px 0; border-radius: 4px;">
              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #92400e;">Parent Remarks / Special Queries:</p>
              <p style="margin: 0; color: #78350f; font-size: 13px; white-space: pre-wrap;">${escapeHtml(inquiry.message)}</p>
            </div>
            ` : ''}

            <p style="font-size: 12px; color: #64748b; margin-top: 16px;">
              Submission Date: ${formattedDate}
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 12px 24px; font-size: 11px; color: #64748b; text-align: center;">
            Official Administrative Gateway — L.K.S.K Convent School, Panditpur, Sohawal, Ayodhya (224188).
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: sender,
        to: recipient,
        subject,
        text,
        html,
      });

      console.log(`[EmailService] Admission notification sent to ${recipient} for student "${inquiry.studentName}"`);
      return { delivered: true };
    } catch (err) {
      console.warn(`[EmailService] Warning: Failed to send admission notification: ${err.message}`);
      return { delivered: false, error: err.message };
    }
  }
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = EmailService;
