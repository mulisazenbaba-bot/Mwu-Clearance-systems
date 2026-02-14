# Gmail App Password Uumuu - Tartiiba Bal'aa
# Creating Gmail App Password - Detailed Steps

---

## 🎯 Wanti Barbaachisu / What You Need

✅ 2-Step Verification dandeessifameera (Completed!)
⏳ App Password uumuu qabna (Need to create)

---

## 📱 Tartiiba 1: Google Account Security Fuula Bani

### Mala 1: Link Kallattiin Fayyadamuun
1. **Browser kee bani** (Chrome, Firefox, Edge)
2. **Link kana copy godhii paste godhi:**
   ```
   https://myaccount.google.com/security
   ```
3. **Enter cuqaasi**

### Mala 2: Gmail Irraa Deemuu
1. Gmail bani (gmail.com)
2. Suuraa profile kee (gara mirgaa olii) cuqaasi
3. "Manage your Google Account" cuqaasi
4. Gara bitaa irraa "Security" cuqaasi

---

## 🔐 Tartiiba 2: App Passwords Barbaadi

### Tartiiba Bal'aa:

**1. Security fuula irratti:**
   - Gadi bu'ii "How you sign in to Google" jedhu barbaadi
   - Achi keessaa "2-Step Verification" arguu qabda (✅ ON jedha)

**2. Gadi bu'uun itti fufi:**
   - "2-Step Verification" jalatti
   - "App passwords" jedhu barbaadi
   - Yoo hin argine, gadi bu'ii itti fufi

**3. "App passwords" cuqaasi:**
   - Kun link xiqqaa ta'uu danda'a
   - Ykn button xiqqaa ta'uu danda'a
   - Cuqaasuu qabda!

**4. Password kee gaafatu:**
   - Gmail password kee (MULISA@7799 miti!)
   - Password regular kee galchi
   - "Next" cuqaasi

---

## 🆕 Tartiiba 3: App Password Haaraa Uumi

### Fuula App Passwords Irratti:

**1. Dropdown menu lama argita:**

   **Dropdown Jalqabaa - "Select app":**
   - Cuqaasii "Mail" filadhu
   - Yoo "Mail" hin jirre, "Other (Custom name)" filadhu
   - Yoo "Other" filatte, "MWU Clearance System" jedhi

   **Dropdown Lammaffaa - "Select device":**
   - Cuqaasii "Windows Computer" filadhu
   - Ykn "Other (Custom name)" filadhu
   - Yoo "Other" filatte, "MWU Server" jedhi

**2. "Generate" button cuqaasi**
   - Button sarara jalaa jiru cuqaasi
   - Eega xiqqoo eegdee...

---

## 📋 Tartiiba 4: App Password Copy Godhi

### Wanti Mul'atu:

**1. Box sarara keessaa password argita:**
   ```
   Fakkeenyaaf: abcd efgh ijkl mnop
   ```
   - Kun password arfii-ja'a 16 ta'a
   - Iddoo 4 qaba (4 groups of 4 characters)
   - Qubee xiqqaa ta'uu danda'a

**2. Password kana COPY GODHI:**
   - Hunda filadhu (Ctrl+A)
   - Copy godhi (Ctrl+C)
   - Ykn "Copy" button yoo jiraate cuqaasi

**3. ⚠️ BARBAACHISAA:**
   - Password kana bakka nageenya qabutti olkaa'i
   - Notepad keessatti paste godhi
   - Ykn phone kee irratti barreessi
   - Fuula kana cufuu danda'a - password kana lammata arguu hin dandeessu!

---

## 💾 Tartiiba 5: Password .env File Keessatti Kaa'i

### 1. Visual Studio Code (ykn text editor) bani

### 2. File kana bani:
   ```
   backend/.env
   ```

### 3. Sarara kana barbaadi:
   ```
   MAIL_PASSWORD=MULISA@7799
   ```

### 4. Password haaraa kaa'i:
   
   **Duraan:**
   ```
   MAIL_PASSWORD=MULISA@7799
   ```
   
   **Booda (App Password kee fayyadami):**
   ```
   MAIL_PASSWORD=abcdefghijklmnop
   ```
   
   **⚠️ XIYYEEFFANNAA:**
   - Iddoo (spaces) hin dabalin!
   - Arfii-ja'a 16 qofa galchi
   - Iddoo gidduu jiru haqii (spaces between groups)
   - Fakkeenyaaf: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

### 5. File save godhi:
   - Ctrl+S cuqaasi
   - Ykn File → Save

---

## 🔄 Tartiiba 6: Configuration Clear Godhi

### 1. Command Prompt ykn Terminal bani

### 2. Backend folder seeni:
   ```bash
   cd backend
   ```

### 3. Configuration clear godhi:
   ```bash
   php artisan config:clear
   ```

### 4. Ergaa kana arguu qabda:
   ```
   Configuration cache cleared successfully.
   ```

---

## 🚀 Tartiiba 7: Servers Restart Godhi

### 1. Servers amma hojjechaa jiran dhaabi:
   - Terminal/Command Prompt irratti
   - **Ctrl+C** cuqaasi (yeroo lama yoo barbaachise)
   - Servers ni dhaabbatu

### 2. Servers restart godhi:
   ```bash
   start-servers.bat
   ```

### 3. Eegi hanga servers jalqaban:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000

---

## ✅ Tartiiba 8: Email Yaali

### Yaalii 1: Contact Request
1. Browser bani: http://localhost:3000/contact-request
2. Form guuti:
   - Name: Test User
   - Email: email kee (mulisazenbaba@gmail.com miti!)
   - Phone: 0912345678
   - Student ID: TEST001
   - Department: Computer Science
   - Role: Student
   - Message: This is a test message
3. "Submit Request" cuqaasi
4. **Email kee ilaali** - notification argachuu qabda

### Yaalii 2: Admin Notification
1. **Admin email ilaali** (mulisazenbaba@gmail.com)
2. Email haaraa arguu qabda
3. Subject: "New Contact Request - MWU Clearance System"

### Yaalii 3: Status Update
1. Admin ta'uun login godhi
2. Contact Requests tab cuqaasi
3. Request haaraa arga
4. Status "Contacted" tti jijjiiri
5. Admin notes: "We will contact you soon"
6. Update Status cuqaasi
7. **Test user email ilaali** - update notification argachuu qabda

---

## 🔍 Yoo Rakkoo Jiraate / Troubleshooting

### ❌ "Authentication failed" jedha?
**Sababa:** Password sirrii miti

**Furmaata:**
1. App Password sirrii copy gootee mirkaneessi
2. Iddoo (spaces) hin jiru mirkaneessi
3. Arfii-ja'a 16 qofa ta'uu mirkaneessi
4. App Password haaraa uumi yoo barbaachise

### ❌ Email hin ergu?
**Mirkaneessi:**
1. ✅ 2-Step Verification ON ta'uu
2. ✅ App Password sirrii ta'uu
3. ✅ .env file save godhameera
4. ✅ `php artisan config:clear` fiigameera
5. ✅ Servers restart godhameera

**Logs ilaali:**
```bash
cd backend
type storage\logs\laravel.log
```

### ❌ App Passwords option hin arguu?
**Sababa:** 2-Step Verification sirrii hin dandeessifamne

**Furmaata:**
1. Deemi: https://myaccount.google.com/security
2. 2-Step Verification cuqaasi
3. Mirkaneessi ON ta'uu
4. Browser refresh godhi
5. App Passwords barbaadi

---

## 📸 Fakkii Mul'ataa / Visual Guide

### Fuula 1: Security Page
```
┌─────────────────────────────────────┐
│ How you sign in to Google           │
├─────────────────────────────────────┤
│ Password                            │
│ ••••••••                      >     │
├─────────────────────────────────────┤
│ 2-Step Verification                 │
│ ✅ ON                         >     │  ← Kana cuqaasi
├─────────────────────────────────────┤
│ App passwords                       │  ← Ykn kana cuqaasi
│                               >     │
└─────────────────────────────────────┘
```

### Fuula 2: App Passwords
```
┌─────────────────────────────────────┐
│ App passwords                       │
├─────────────────────────────────────┤
│ Select app:                         │
│ [Mail ▼]                           │  ← Mail filadhu
├─────────────────────────────────────┤
│ Select device:                      │
│ [Windows Computer ▼]               │  ← Windows filadhu
├─────────────────────────────────────┤
│        [Generate]                   │  ← Kana cuqaasi
└─────────────────────────────────────┘
```

### Fuula 3: Generated Password
```
┌─────────────────────────────────────┐
│ Your app password for your device  │
├─────────────────────────────────────┤
│                                     │
│   abcd efgh ijkl mnop              │  ← Kana copy godhi!
│                                     │
├─────────────────────────────────────┤
│        [Done]                       │
└─────────────────────────────────────┘
```

---

## 📝 Yaadannoo / Notes

### ✅ Wanti Sirrii Ta'uu Qabu:
- Password arfii-ja'a 16 (iddoo malee)
- Qubee xiqqaa fi guddaa walitti makamuu danda'a
- Lakkoofsa of keessaa qabaachuu danda'a

### ❌ Wanti Sirrii Hin Taane:
- Password regular kee (MULISA@7799) - KUN HIN HOJJETU!
- Password iddoo qabu (spaces)
- Password 16 ol ykn gadi

### 💡 Gorsaa:
- App Password tokko qofa uumi
- Bakka nageenya qabutti olkaa'i
- Nama biraatiif hin kenninaa
- Yoo bade, haqii fi haaraa uumi

---

## 🎉 Milkaa'ina! / Success!

Yoo tartiiba kana hunda hordoftee:
- ✅ App Password uumameera
- ✅ .env file keessatti kaa'ameera
- ✅ Configuration clear godhameera
- ✅ Servers restart godhameera
- ✅ Email notification hojjechuu qaba!

---

## 📞 Gargaarsa / Support

Yoo rakkoo jiraate:
1. Tartiiba kana irra deebi'ii dubbisi
2. Logs ilaali: `backend/storage/logs/laravel.log`
3. Screenshot fuudhii na quunnamii
4. Email: mulisazenbaba@gmail.com
5. Phone: 0954382579

---

**Guyyaa:** February 7, 2026
**Gosa:** Qajeelfama Bal'aa / Detailed Guide
**Afaan:** Afaan Oromo fi English
