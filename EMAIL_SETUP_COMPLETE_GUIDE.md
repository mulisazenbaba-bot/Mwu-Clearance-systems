# Complete Email Setup Guide - Gmail Configuration

## ✅ Current Status

The system is configured to send emails, but you need to complete the Gmail setup.

---

## 🎯 What You Need to Do

### Step 1: Get Gmail App Password

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com
   - Login with: mulisazenbaba@gmail.com

2. **Enable 2-Step Verification** (if not already enabled)
   - Click "Security" in left menu
   - Find "2-Step Verification"
   - Click "Get Started"
   - Follow the prompts to enable it

3. **Create App Password**
   - Still in Security section
   - Scroll down to "App passwords"
   - Click "App passwords"
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Type: "MWU Clearance System"
   - Click "Generate"
   - **You'll see a 16-character password like: `abcd efgh ijkl mnop`**
   - **COPY THIS PASSWORD!** (You won't see it again)

### Step 2: Update .env File

1. **Open file**: `backend/.env`

2. **Find this line**:
   ```
   MAIL_PASSWORD=your_16_digit_app_password_here
   ```

3. **Replace with your actual password**:
   ```
   MAIL_PASSWORD=abcd efgh ijkl mnop
   ```
   
   **Important**: 
   - Remove spaces: `MAIL_PASSWORD=abcdefghijklmnop`
   - OR keep spaces if Gmail shows them
   - Use the exact password Google gave you

4. **Save the file**

### Step 3: Clear Config Cache

```bash
cd backend
php artisan config:clear
php artisan cache:clear
```

### Step 4: Restart Servers

**Stop current servers** (Ctrl+C in both terminals)

Then restart:

```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd frontend
npm run dev
```

OR use the batch file:
```bash
start-servers.bat
```

---

## 🧪 Test Email Sending

### Test 1: Create a Test User

1. Login as admin: http://localhost:3000/login
2. Go to "User Management" tab
3. Click "Create New User"
4. Fill in details:
   ```
   Name: Test User
   Email: YOUR_PERSONAL_EMAIL@gmail.com (use your own email to test)
   Password: Test123
   Role: Student
   ```
5. Click "Create User"

### Test 2: Check Email

1. Check the email inbox you used
2. Look for email from: mulisazenbaba@gmail.com
3. Subject: "Welcome to MWU Clearance System - Your Account Details"
4. Should contain login credentials

### Test 3: Check Logs (if email doesn't arrive)

```bash
cd backend
tail -f storage/logs/laravel.log
```

Look for:
- Email sending attempt
- Any error messages
- Success confirmation

---

## 🔧 Current Configuration

Your `backend/.env` file now has:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=mulisazenbaba@gmail.com
MAIL_PASSWORD=your_16_digit_app_password_here  ← YOU NEED TO UPDATE THIS
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="mulisazenbaba@gmail.com"
MAIL_FROM_NAME="MWU Clearance System"
```

---

## ⚠️ Troubleshooting

### Problem: "Authentication failed"

**Solution**: 
- Make sure 2-Step Verification is enabled
- Generate a new App Password
- Copy it exactly (no extra spaces)
- Update .env file
- Clear cache: `php artisan config:clear`
- Restart server

### Problem: "Connection timeout"

**Solution**:
- Check internet connection
- Make sure port 587 is not blocked
- Try port 465 with SSL:
  ```env
  MAIL_PORT=465
  MAIL_ENCRYPTION=ssl
  ```

### Problem: Email goes to spam

**Solution**:
- This is normal for first emails
- Check spam folder
- Mark as "Not Spam"
- Future emails will go to inbox

### Problem: "Less secure app access"

**Solution**:
- Google removed this option
- You MUST use App Passwords now
- Follow Step 1 above to create App Password

---

## 📧 What Emails Are Sent

### 1. Welcome Email (When Creating User)
- **To**: New user's email
- **From**: mulisazenbaba@gmail.com
- **Subject**: Welcome to MWU Clearance System - Your Account Details
- **Contains**: Login credentials, password, instructions

### 2. Contact Request Notification (When User Submits Request)
- **To**: mulisazenbaba@gmail.com
- **From**: mulisazenbaba@gmail.com
- **Subject**: New Contact Request - MWU Clearance System
- **Contains**: User's information and request details

---

## 🔐 Security Notes

### App Password vs Regular Password

- **Regular Password**: Your Gmail login password
- **App Password**: Special 16-character password for apps
- **Why**: More secure, can be revoked without changing main password
- **Where to use**: Only in .env file, never share it

### Keeping It Safe

1. **Never commit .env to Git**
   - Already in .gitignore
   - Contains sensitive passwords

2. **Revoke if compromised**
   - Go to Google Account → Security → App Passwords
   - Delete the app password
   - Generate a new one

3. **Use different passwords**
   - Don't use your main Gmail password
   - Always use App Passwords for applications

---

## 📝 Quick Reference

### Gmail App Password Setup
```
1. https://myaccount.google.com
2. Security → 2-Step Verification (enable)
3. Security → App Passwords
4. Generate for "Mail" / "Other"
5. Copy 16-character password
6. Paste in backend/.env
7. Clear cache and restart
```

### Commands to Run After Update
```bash
cd backend
php artisan config:clear
php artisan cache:clear
# Restart server (Ctrl+C then php artisan serve)
```

### Test Email
```
1. Create user with your email
2. Check inbox (and spam)
3. Verify credentials received
```

---

## ✅ Checklist

Before testing, make sure:

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] App Password copied (16 characters)
- [ ] backend/.env file updated with App Password
- [ ] No spaces or quotes around password
- [ ] Config cache cleared
- [ ] Servers restarted
- [ ] Test user created
- [ ] Email received

---

## 🎯 Expected Result

After completing all steps:

1. ✅ You create a user in admin dashboard
2. ✅ System sends email automatically
3. ✅ User receives email within seconds
4. ✅ Email contains login credentials
5. ✅ User can login immediately
6. ✅ No manual email writing needed

---

## 📞 Still Having Issues?

If emails still don't send after following all steps:

1. **Check Laravel logs**:
   ```bash
   cd backend
   cat storage/logs/laravel.log
   ```

2. **Test Gmail credentials manually**:
   - Try logging into Gmail with App Password
   - Use an email client like Thunderbird

3. **Verify .env syntax**:
   - No extra spaces
   - No quotes around password
   - Correct email address

4. **Alternative: Use different email service**:
   - Mailtrap (for testing)
   - SendGrid
   - Mailgun
   - AWS SES

---

## 🔄 Alternative: Keep Using Log Mode (Testing)

If you want to keep testing without real emails:

1. **Change back to log mode**:
   ```env
   MAIL_MAILER=log
   ```

2. **Emails will be logged to**:
   ```
   backend/storage/logs/laravel.log
   ```

3. **Good for**:
   - Development
   - Testing
   - When you don't need real emails yet

---

**Last Updated**: February 6, 2026
**Your Email**: mulisazenbaba@gmail.com
**Status**: Configuration Ready - Needs App Password
