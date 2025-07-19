# Email Notifications Setup Guide

## Overview

Your ColorTech Panel Beaters website now automatically sends email notifications when customers submit contact forms.

## Features

- ✅ **Admin Notifications**: Admins receive beautifully formatted emails for each form submission
- ✅ **Customer Confirmations**: Customers get automatic confirmation emails
- ✅ **Professional Design**: HTML emails with your branding
- ✅ **Contact Details**: Easy reply buttons and contact information

## Setup Instructions

### Gmail SMTP Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Update Environment Variables** in `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-business-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

## Configure Admin Emails

Edit `src/services/emailService.ts` to set who receives notifications:

```typescript
const ADMIN_EMAILS = [
  "admin@colortech.co.zw",
  "manager@colortech.co.zw",
  "your-personal-email@gmail.com",
];
```

## What Happens When Forms Are Submitted

### 1. Admin Notification Email

- **Subject**: "New Contact Form Submission - [Customer Name]"
- **Content**: Customer details, service requested, full message, reply button

### 2. Customer Confirmation Email

- **Subject**: "Thank you for contacting ColorTech Panel Beaters"
- **Content**: Personalized thank you, next steps, contact information

## Testing

Submit a test form on your contact page and check both admin and customer emails.

## Troubleshooting

**"Authentication failed"**

- Check your email and app password
- Ensure 2FA is enabled for Gmail
- Verify SMTP settings

**"Emails not received"**

- Check spam/junk folders
- Verify admin email addresses
- Check server logs for errors
