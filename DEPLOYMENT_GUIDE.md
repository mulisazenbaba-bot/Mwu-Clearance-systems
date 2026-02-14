# MWU Clearance System - Deployment Guide

## System Overview
The MWU Clearance System is a comprehensive web-based application built with Laravel (backend) and Next.js (frontend) to digitize the student clearance process at Madda Walabu University.

## Architecture
- **Backend**: Laravel 10 with JWT Authentication
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Database**: SQLite (development) / MySQL (production)
- **Authentication**: JWT tokens with role-based access control

## Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn
- Web server (Apache/Nginx)
- Database (MySQL for production)

## Installation Steps

### 1. Backend Setup (Laravel)

```bash
# Clone the repository
git clone <repository-url>
cd clearance-system

# Install PHP dependencies
cd backend
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Configure database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mwu_clearance
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed the database with test data
php artisan db:seed

# Start the development server
php artisan serve
```

### 2. Frontend Setup (Next.js)

```bash
# Install Node.js dependencies
cd frontend
npm install

# Update API base URL in src/lib/api.ts if needed
# For production, change to your domain
const API_BASE_URL = 'https://yourdomain.com/api';

# Start the development server
npm run dev
```

### 3. Production Deployment

#### Backend (Laravel)
1. Upload files to your web server
2. Configure web server to point to `backend/public` directory
3. Set up SSL certificate
4. Configure production database
5. Set environment variables:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com
   ```
6. Run production commands:
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

#### Frontend (Next.js)
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy to hosting service (Vercel, Netlify, etc.)
3. Configure environment variables for production API URL

## Default User Accounts

### Admin
- **Email**: admin@mwu.edu.et
- **Password**: password123
- **Role**: System Administrator

### Officers
- **Library Officer**: library@mwu.edu.et / password123
- **Dormitory Officer**: dormitory@mwu.edu.et / password123
- **Department Officer**: department@mwu.edu.et / password123

### Student
- **Email**: mulisa@student.mwu.edu.et
- **Password**: password123
- **Student ID**: MWU/CS/2024/001

## System Features

### Student Features
- Create clearance requests
- Track request status in real-time
- View detailed verification progress
- Submit requests for processing
- Dashboard with statistics

### Officer Features
- View pending verifications by type
- Approve/reject clearance requests
- Add comments and verification data
- Dashboard with verification statistics
- Role-based access (Library, Dormitory, Department)

### Admin Features
- Complete system overview
- User management (create, update, delete)
- View all clearance requests
- System statistics and reporting
- User role management

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user
- `POST /api/refresh` - Refresh JWT token

### Student Endpoints
- `GET /api/student/dashboard` - Student dashboard data
- `POST /api/clearance-requests` - Create clearance request
- `GET /api/my-clearance-requests` - Get user's requests
- `GET /api/clearance-requests/{id}` - Get specific request
- `POST /api/clearance-requests/{id}/submit` - Submit request

### Officer Endpoints
- `GET /api/officer/dashboard` - Officer dashboard data
- `GET /api/pending-verifications` - Get pending verifications
- `POST /api/verifications/{id}/approve` - Approve verification
- `POST /api/verifications/{id}/reject` - Reject verification

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

## Database Schema

### Users Table
- id, name, email, password
- role (student, library_officer, dormitory_officer, department_officer, admin)
- student_id, department, phone
- timestamps

### Clearance Requests Table
- id, student_id, student_name, student_id_number
- department, graduation_year, status
- reason, documents (JSON), submitted_at, completed_at
- timestamps

### Verifications Table
- id, clearance_request_id, officer_id
- verification_type (library, dormitory, department)
- status (pending, approved, rejected)
- comments, verification_data (JSON), verified_at
- timestamps

## Security Features
- JWT authentication with token expiration
- Role-based access control
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- SQL injection prevention with Eloquent ORM

## Workflow Process
1. **Student** creates a clearance request
2. **Student** submits the request (status: pending → in_progress)
3. **Library Officer** reviews and approves/rejects library clearance
4. **Dormitory Officer** reviews and approves/rejects dormitory clearance
5. **Department Officer** reviews and approves/rejects department clearance
6. When all verifications are approved, status becomes "completed"
7. If any verification is rejected, status becomes "rejected"

## Troubleshooting

### Common Issues
1. **JWT Token Errors**: Ensure JWT_SECRET is set in .env
2. **Database Connection**: Check database credentials in .env
3. **CORS Issues**: Configure CORS in Laravel config/cors.php
4. **File Permissions**: Ensure storage and bootstrap/cache are writable

### Logs
- Laravel logs: `storage/logs/laravel.log`
- Check browser console for frontend errors
- Use `php artisan log:clear` to clear logs

## Maintenance
- Regular database backups
- Monitor log files for errors
- Update dependencies regularly
- Review user access and permissions
- Monitor system performance

## Support
For technical support or questions about the system, contact the development team or refer to the project documentation.

## License
This project is developed for Madda Walabu University as part of the Computer Science Department curriculum.