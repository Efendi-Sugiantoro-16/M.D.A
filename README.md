# MDA Web Application

Selamat datang di **MDA (Modern Digital Agency) Web Application**!  
Aplikasi ini adalah sistem manajemen digital agency modern, menyediakan API, autentikasi, dashboard admin, dan frontend yang responsif.

---

## 🚀 Fitur Utama / Main Features

### 🔐 Authentication & User Management
- **User Registration & Login** (Registrasi & Login Pengguna)
- **Role-based Access Control** (Akses berdasarkan peran)
- **JWT Authentication** (Autentikasi berbasis token)
- **Password Security** (Password di-hash dengan bcrypt)
- **Real-time Validation** (Validasi real-time untuk email & username)

### 👥 User Roles / Peran Pengguna
- **Admin** - Akses penuh ke semua fitur
- **Manager** - Manajemen proyek dan tim
- **Developer** - Akses ke development tools
- **Designer** - Akses ke design tools
- **Client** - Akses terbatas untuk melihat proyek

### 📊 Dashboard & Management
- **Admin Dashboard** (Dashboard Admin dengan statistik)
- **Project Management** (Manajemen Proyek)
- **User Management** (Manajemen Pengguna)
- **Contact & Testimonials** (Form Kontak & Testimoni)
- **Settings Management** (Pengaturan Aplikasi)

### 🔧 Technical Features
- **RESTful API** (API untuk integrasi dan pengujian)
- **MySQL Database** (Database relasional)
- **File Upload** (Upload file dengan Multer)
- **Email Integration** (Integrasi email dengan Nodemailer)
- **Security Features** (Rate limiting, helmet, CORS)
- **Modern UI/UX** (Bootstrap 5, FontAwesome, Responsive Design)

---

## 📁 Struktur Project / Project Structure

```
MDA/
├── components/              # Backend server & API
│   ├── public/             # Static files (HTML, CSS, JS)
│   │   ├── login.html      # Login page
│   │   ├── register.html   # Registration page
│   │   ├── index.html      # Admin dashboard
│   │   └── ...
│   ├── routes/             # Express route modules
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management
│   │   ├── projects.js     # Project management
│   │   └── ...
│   ├── database/           # Database setup & seed scripts
│   ├── middleware/         # Custom Express middleware
│   ├── utils/              # Utility functions
│   ├── uploads/            # File uploads
│   ├── server.js           # Main Express server
│   └── package.json        # Node.js dependencies
├── css/                    # Frontend stylesheets
├── js/                     # Frontend JavaScript
├── index.html              # Main landing page
├── about.html              # About page
├── product.html            # Product page
├── contact.html            # Contact page
└── README.md               # This file
```

---

## ⚙️ Prerequisites / Persyaratan

Sebelum menginstall aplikasi, pastikan sistem Anda memiliki:

- **Node.js** (v16 atau lebih baru)
- **MySQL** (v8.0 atau lebih baru)
- **npm** atau **yarn**
- **Git** (untuk clone repository)

### Cara Install Prerequisites:

#### 1. Install Node.js
```bash
# Download dari https://nodejs.org/
# Atau gunakan package manager
# Windows: Download installer dari website resmi
# macOS: brew install node
# Linux: sudo apt install nodejs npm
```

#### 2. Install MySQL
```bash
# Windows: Download MySQL Installer
# macOS: brew install mysql
# Linux: sudo apt install mysql-server

# Start MySQL service
# Windows: MySQL service otomatis start
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
```

---

## 🛠️ Installation & Setup / Instalasi & Setup

### Step 1: Clone Repository
```bash
# Clone project dari repository
git clone <repository-url>
cd MDA
```

### Step 2: Install Dependencies
```bash
# Masuk ke folder components (backend)
cd components

# Install semua dependencies
npm install
```

### Step 3: Database Configuration
```bash
# Copy file environment example
cp env.example .env

# Edit file .env dengan konfigurasi database Anda
# Contoh konfigurasi:
```

**File `.env` Configuration:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mda_database

# JWT Configuration
JWT_SECRET=mda_jwt_secret_key_2024_development
JWT_EXPIRES_IN=24h

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@mda.com
```

### Step 4: Setup Database
```bash
# Jalankan script setup database
setup-database.bat

# Script ini akan:
# 1. Membuat database jika belum ada
# 2. Membuat semua tabel yang diperlukan
# 3. Menambahkan data sample (admin user, dll)
```

### Step 5: Start Server
```bash
# Jalankan server
npm start

# Atau gunakan script yang sudah disediakan:
start-clean.bat        # Clean start (kill existing processes)
start-port-3001.bat    # Start di port 3001 (jika port 3000 bermasalah)
```

---

## 🌐 Access Application / Akses Aplikasi

Setelah server berjalan, akses aplikasi melalui browser:

### Main URLs:
- **Login Page:** [http://localhost:3000/login](http://localhost:3000/login)
- **Register Page:** [http://localhost:3000/register](http://localhost:3000/register)
- **Admin Dashboard:** [http://localhost:3000/](http://localhost:3000/)
- **API Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Frontend Pages:
- **Landing Page:** [http://localhost:3000/index.html](http://localhost:3000/index.html)
- **About Page:** [http://localhost:3000/about.html](http://localhost:3000/about.html)
- **Product Page:** [http://localhost:3000/product.html](http://localhost:3000/product.html)
- **Contact Page:** [http://localhost:3000/contact.html](http://localhost:3000/contact.html)

---

## 🧑‍💻 Usage Guide / Panduan Penggunaan

### 1. First Time Setup / Setup Pertama Kali

#### Register Admin Account:
1. Buka [http://localhost:3000/register](http://localhost:3000/register)
2. Isi form registrasi dengan data admin:
   ```
   First Name: Admin
   Last Name: User
   Username: admin
   Email: admin@mda.com
   Password: admin123
   Role: admin
   ```
3. Klik "Create Account"
4. Login dengan akun yang baru dibuat

#### Or Use Default Admin Account:
```
Email: admin@mda.com
Password: admin123
```

### 2. User Management / Manajemen Pengguna

#### Create New Users:
1. Login sebagai admin
2. Buka menu "Users" di dashboard
3. Klik "Add New User"
4. Isi form user baru
5. Pilih role yang sesuai
6. Save user

#### User Roles & Permissions:
- **Admin**: Akses penuh ke semua fitur
- **Manager**: Dapat mengelola proyek dan tim
- **Developer**: Akses ke development tools
- **Designer**: Akses ke design tools
- **Client**: Hanya dapat melihat proyek yang diassign

### 3. Project Management / Manajemen Proyek

#### Create New Project:
1. Buka menu "Projects" di dashboard
2. Klik "Add New Project"
3. Isi detail proyek:
   - Project name
   - Description
   - Client
   - Start date
   - End date
   - Status
4. Assign team members
5. Save project

#### Project Status:
- **Planning** - Tahap perencanaan
- **In Progress** - Sedang dikerjakan
- **Review** - Tahap review
- **Completed** - Selesai
- **On Hold** - Ditunda

### 4. Contact & Testimonials

#### View Contact Messages:
1. Buka menu "Contact" di dashboard
2. Lihat semua pesan yang masuk
3. Update status pesan (New, Read, Replied)
4. Reply ke email client

#### Manage Testimonials:
1. Buka menu "Testimonials"
2. Add new testimonial
3. Edit existing testimonials
4. Publish/unpublish testimonials

---

## 🔧 Troubleshooting / Pemecahan Masalah

### Common Issues / Masalah Umum:

#### 1. Port 3000 Already in Use
```bash
# Solusi 1: Gunakan script clean start
start-clean.bat

# Solusi 2: Gunakan port lain
start-port-3001.bat

# Solusi 3: Manual kill process
taskkill /f /im node.exe
```

#### 2. Database Connection Error
```bash
# Pastikan MySQL berjalan
# Windows: Check MySQL service
# macOS: brew services list | grep mysql
# Linux: sudo systemctl status mysql

# Reset database
setup-database.bat
```

#### 3. Module Not Found Error
```bash
# Install ulang dependencies
npm install

# Clear npm cache
npm cache clean --force
```

#### 4. Registration Failed
- Pastikan email dan username unik
- Cek format email valid
- Password minimal 6 karakter
- Semua field required terisi

### Error Messages & Solutions:

| Error | Solution |
|-------|----------|
| "Email is already registered" | Gunakan email lain |
| "Username is already taken" | Gunakan username lain |
| "Database connection failed" | Cek MySQL service & konfigurasi |
| "Port already in use" | Gunakan port lain atau kill process |
| "Module not found" | Jalankan `npm install` |

---

## 📝 API Documentation / Dokumentasi API

### Authentication Endpoints:
```http
POST /api/auth/register    # Register user baru
POST /api/auth/login       # Login user
GET  /api/auth/me          # Get current user
POST /api/auth/check-email # Check email availability
POST /api/auth/check-username # Check username availability
```

### User Management:
```http
GET    /api/users          # Get all users (admin only)
GET    /api/users/:id      # Get single user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user (admin only)
```

### Project Management:
```http
GET    /api/projects       # Get all projects
GET    /api/projects/:id   # Get single project
POST   /api/projects       # Create new project
PUT    /api/projects/:id   # Update project
DELETE /api/projects/:id   # Delete project
```

### Contact Management:
```http
POST   /api/contact        # Submit contact form
GET    /api/contact        # Get all messages (admin)
GET    /api/contact/:id    # Get single message
PUT    /api/contact/:id/status # Update message status
```

### Testing API:
Gunakan file `test-api.http` dengan REST Client di VS Code untuk testing API.

---

## 🛡️ Security Features / Fitur Keamanan

### Authentication & Authorization:
- **JWT Tokens** - Secure token-based authentication
- **Password Hashing** - bcrypt dengan salt rounds 10
- **Role-based Access** - Different permissions per role
- **Session Management** - Automatic token expiration

### API Security:
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS Protection** - Cross-origin resource sharing
- **Helmet Security** - Security headers
- **Input Validation** - Server-side validation
- **SQL Injection Protection** - Parameterized queries

### Data Protection:
- **Password Security** - Never stored in plain text
- **Token Security** - JWT with expiration
- **File Upload Security** - File type & size validation
- **Error Handling** - No sensitive data in error messages

---

## 🚀 Deployment / Deployment

### Production Setup:

#### 1. Environment Configuration:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_very_secure_production_secret
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
```

#### 2. Database Setup:
```bash
# Setup production database
npm run migrate
npm run seed
```

#### 3. Start Production Server:
```bash
# Using PM2 (Recommended)
npm install -g pm2
pm2 start server.js --name "mda-app"
pm2 save
pm2 startup

# Or using Node directly
NODE_ENV=production node server.js
```

### Using Docker (Optional):
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📊 Monitoring & Maintenance / Monitoring & Pemeliharaan

### Health Checks:
- **API Health:** `GET /api/health`
- **Database Health:** Automatic connection monitoring
- **Server Status:** Process monitoring

### Logs:
- **Access Logs:** HTTP request logs
- **Error Logs:** Application error logs
- **Database Logs:** MySQL query logs

### Backup:
```bash
# Database backup
mysqldump -u root -p mda_database > backup.sql

# Application backup
tar -czf mda-backup.tar.gz components/
```

---

## 🤝 Contributing / Kontribusi

### How to Contribute:
1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create Pull Request

### Code Standards:
- Follow existing code style
- Add comments for complex logic
- Write tests for new features
- Update documentation

---

## 📄 License / Lisensi

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Contact / Dukungan & Kontak

### Getting Help:
- **Documentation:** Check this README and inline code comments
- **Issues:** Create GitHub issue for bugs or feature requests
- **Email:** support@mda.com (if available)

### Community:
- **GitHub Discussions:** For questions and discussions
- **Wiki:** Additional documentation and tutorials

---

## 📈 Roadmap / Rencana Pengembangan

### Version 1.1 (Next Release):
- [ ] Email notifications
- [ ] File upload improvements
- [ ] Advanced reporting
- [ ] Mobile app integration

### Version 1.2:
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API rate limiting improvements
- [ ] Enhanced security features

### Version 2.0:
- [ ] Real-time notifications
- [ ] Advanced project management
- [ ] Integration with third-party services
- [ ] Advanced user roles and permissions

---

## 📢 Release Notes / Catatan Rilis

### Version 1.0.0 (Current):
- ✅ User registration and authentication
- ✅ Role-based access control
- ✅ Project management
- ✅ Contact form handling
- ✅ Admin dashboard
- ✅ RESTful API
- ✅ Security features
- ✅ Database integration

---

**Happy coding & selamat berkarya! 🎉**

*Last updated: June 2024*