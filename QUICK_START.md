# 🚀 MWU Clearance System - Quick Start Guide

## Jalqaba - One-Time Setup

### 1. XAMPP MySQL Jalqabuu
1. XAMPP Control Panel bani
2. **MySQL** → **Start** cuqaasi
3. MySQL running akka ta'e mirkaneessi (green light)

### 2. Dependencies Install Gochuu (Jalqaba qofa)

Yoo jalqaba ta'e, dependencies install gochuu qabda:

```bash
# Backend dependencies
cd backend
composer install
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup (Jalqaba qofa)

```bash
cd backend

# .env file copy gochuu (yoo hin jirre)
copy .env.example .env

# APP_KEY generate gochuu
php artisan key:generate

# Database migrate & seed
php artisan migrate
php artisan db:seed
```

---

## 🎯 Guyyaa Guyyaan - Servers Jalqabuu

### Karaa Salphaa (Recommended):

**Double-click** `start-servers.bat` file

Yookaan Command Prompt keessatti:
```bash
start-servers.bat
```

Kun automatic:
- ✅ MySQL check godha
- ✅ Backend server jalqaba (http://localhost:8000)
- ✅ Frontend server jalqaba (http://localhost:3000)
- ✅ Browser automatic bana

---

### Karaa Manual:

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🛑 Servers Stop Gochuu

### Karaa Salphaa:

**Double-click** `stop-servers.bat` file

Yookaan:
```bash
stop-servers.bat
```

### Karaa Manual:

Server windows keessatti **Ctrl + C** cuqaasi

---

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Backend API**: http://localhost:8000/api

---

## 👥 Test Accounts

```
Admin:
Email: admin@mwu.edu
Password: password

Library Officer:
Email: library@mwu.edu
Password: password

Dormitory Officer:
Email: dormitory@mwu.edu
Password: password

Department Officer:
Email: department@mwu.edu
Password: password

Student:
Email: student@mwu.edu
Password: password
```

---

## 🔧 Troubleshooting

### "ERR_CONNECTION_REFUSED"
- XAMPP MySQL running akka ta'e mirkaneessi
- Servers jalqabuu: `start-servers.bat` run godhi

### "Port already in use"
- Servers stop godhi: `stop-servers.bat` run godhi
- Itti aanee restart godhi

### "composer: command not found"
- Composer install gochuu qabda: https://getcomposer.org

### "php: command not found"
- PHP install gochuu qabda yookaan XAMPP PHP path add godhi

### Database connection error
- XAMPP MySQL running akka ta'e mirkaneessi
- `.env` file keessatti database credentials check godhi

---

## 📁 Project Structure

```
Mwu-Clearance-systems/
├── backend/              # Laravel API
│   ├── app/
│   ├── database/
│   └── ...
├── frontend/             # Next.js App
│   ├── src/
│   └── ...
├── start-servers.bat     # Servers jalqabuu
├── stop-servers.bat      # Servers stop gochuu
└── README.md
```

---

## 🆘 Gargaarsa

Gaaffii yoo qabaatte:
- Email: mulisazenbaba@gmail.com
- Phone: 0954382579

---

**Milkaa'ina! 🎉**
