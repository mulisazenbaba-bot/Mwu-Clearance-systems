# MWU Clearance System - Complete User Guide

## 📖 Table of Contents
1. [Quick Start](#quick-start)
2. [Email Setup](#email-setup)
3. [User Roles](#user-roles)
4. [Features](#features)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Starting the System
```bash
start-servers.bat
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Login**: http://localhost:3000/login

### Test Accounts
```
Admin: admin@mwu.edu / password
Library Officer: library@mwu.edu / password
Dormitory Officer: dormitory@mwu.edu / password
Department Officer: department@mwu.edu / password
Student: student@mwu.edu / password
```

---

## 📧 Email Setup

### Current Status
⚠️ **Email password needs to be updated!**

Your regular Gmail password (`MULISA@7799`) won't work. You need a Gmail App Password.

### Steps to Enable Real Emails

1. **Get Gmail App Password**:
   - Go to https://myaccount.google.com
   - Login with mulisazenbaba@gmail.com
   - Security → Enable 2-Step Verification
   - Security → App Passwords → Generate
   - Copy the 16-character password

2. **Update .env**:
   - Open `backend/.env`
   - Find: `MAIL_PASSWORD=MULISA@7799`
   - Replace with your App Password
   - Save file

3. **Clear Cache**:
   ```bash
   cd backend
   php artisan config:clear
   ```

4. **Restart Servers**:
   ```bash
   start-servers.bat
   ```

---

## 👥 User Roles

### Admin
- Create/manage all users
- View all clearance requests
- Handle contact requests
- View system statistics

### Officers (Library, Dormitory, Department)
- Review clearance verifications
- Check student records
- Approve/reject verifications
- View statistics

### Students
- Submit clearance requests
- Track request status
- Download certificates
- View clearance history

---

## ✨ Features

### 1. Contact Request System
- **URL**: http://localhost:3000/contact-request
- New users can request access
- Admin receives email notification
- Manage requests in admin dashboard

### 2. Automatic Password Emails
- When admin creates user, email sent automatically
- Contains login credentials
- Professional welcome message
- Role-specific instructions

### 3. Clearance Management
- Students submit requests
- Three verification types (library, dormitory, department)
- Officers approve/reject
- Certificate generation

### 4. Officer Dashboard
- **Verifications Tab**: Approve/reject requests
- **Check Student Tab**: Search student records
- **Statistics Tab**: View metrics

---

## 🧪 Testing

### Test Contact Request
1. Visit http://localhost:3000/contact-request
2. Fill form with test data
3. Submit
4. Check admin dashboard for notification

### Test User Creation
1. Login as admin
2. User Management → Create New User
3. Fill details and set password
4. Check if email is sent (check logs if not configured)

### Test Clearance Flow
1. Login as student
2. Submit clearance request
3. Login as each officer type
4. Approve verifications
5. Student downloads certificate

---

## 🔧 Troubleshooting

### Certificate Download Not Working
**Fixed!** If you see "Failed to download certificate":
- This was caused by invalid characters in filenames
- The fix has been applied automatically
- Certificates now download with safe filenames like: `clearance_certificate_MWU001_20260206.pdf`
- If issue persists, check `backend/storage/logs/laravel.log` for errors

### Email Not Sending
- Check `backend/.env` has correct App Password
- Run `php artisan config:clear`
- Check `backend/storage/logs/laravel.log`
- Verify 2-Step Verification is enabled

### 404 Errors
- Make sure both servers are running
- Check URLs are correct
- Clear browser cache

### Login Issues
- Verify email and password
- Check user exists in database
- Clear browser cookies

---

## 📞 Contact Information

**Admin Email**: mulisazenbaba@gmail.com
**Admin Phone**: 0954382579

This information appears on all public pages.

---

## 📝 Important Files

### Keep These
- `README.md` - Project overview
- `USER_GUIDE.md` - This file
- `TESTING_GUIDE.md` - Testing instructions
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `EMAIL_SETUP_COMPLETE_GUIDE.md` - Detailed email setup
- `EMAIL_SETUP_STEPS.txt` - Visual email setup
- `FINAL_SETUP_SUMMARY.md` - Complete summary
- `start-servers.bat` - Server startup script
- `start-servers.ps1` - PowerShell startup script

### Configuration Files
- `backend/.env` - Backend configuration
- `backend/config/*` - Laravel configuration
- `frontend/next.config.ts` - Frontend configuration

---

**Last Updated**: February 6, 2026
**Status**: Ready for use (after email setup)
