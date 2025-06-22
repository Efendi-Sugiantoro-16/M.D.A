# MDA Web Application

Selamat datang di **MDA (Modern Digital Agency) Web Application**!

This project is a fullstack web application for digital agency management, built with Node.js, Express, MySQL, and modern frontend technologies.

---

## 🚀 Fitur Utama / Main Features

- **User Registration & Login** (Registrasi & Login Pengguna)
- **Role-based Access** (Akses berdasarkan peran: admin, manager, developer, designer, client)
- **Admin Dashboard** (Dashboard Admin)
- **Project Management** (Manajemen Proyek)
- **Contact & Testimonials** (Form Kontak & Testimoni)
- **Settings & User Management** (Pengaturan & Manajemen User)
- **API RESTful** (API untuk integrasi dan pengujian)
- **Security** (JWT, bcrypt, rate limiting, helmet, CORS)
- **Modern UI/UX** (Bootstrap 5, FontAwesome, Responsive Design)

---

## 📁 Struktur Project / Project Structure

```
components/
├── public/           # Static files (HTML, CSS, JS, images)
├── routes/           # Express route modules
├── database/         # Database setup & seed scripts
├── middleware/       # Custom Express middleware
├── utils/            # Utility functions (email, dll)
├── uploads/          # File uploads
├── server.js         # Main Express server
├── package.json      # Node.js dependencies & scripts
└── ...
```

---

## ⚙️ Setup & Instalasi

### 1. Clone Repository
```bash
# Clone project ini
git clone <repo-url>
cd MDA
```

### 2. Install Dependencies
```bash
cd components
npm install
```

### 3. Konfigurasi Database & Environment
- Copy file `env.example` menjadi `.env` dan sesuaikan konfigurasi MySQL Anda.
- Jalankan setup database:
```bash
setup-database.bat
```

### 4. Jalankan Server
```bash
npm start
# atau
node server.js
```

### 5. Akses Aplikasi
- **Login Page:** [http://localhost:3000/login](http://localhost:3000/login)
- **Register Page:** [http://localhost:3000/register](http://localhost:3000/register)
- **Dashboard:** [http://localhost:3000/](http://localhost:3000/)

---

## 🧑‍💻 Penggunaan / Usage

- Register akun baru di halaman `/register`
- Login menggunakan akun Anda
- Admin dapat mengelola user, project, settings, dan melihat dashboard
- Client dapat melihat project yang diassign
- Semua aktivitas terekam di database MySQL

---

## 🛡️ Keamanan / Security
- Password di-hash dengan bcrypt
- JWT untuk autentikasi
- Rate limiting untuk mencegah brute force
- Helmet & CORS untuk proteksi API

---

## 📝 Testing API
- Gunakan file `test-api.http` dengan REST Client di VS Code
- Endpoint utama: `/api/auth`, `/api/users`, `/api/projects`, dll

---

## 👥 Credits & Kontributor
- Project ini dikembangkan oleh tim MDA
- Open for collaboration! (Silakan pull request atau issue)

---

## 📢 Catatan / Notes
- Jangan lupa jalankan server dari folder `components`, bukan root!
- Default admin login: `admin@mda.com` / `admin123`
- Untuk reset database, gunakan `setup-database.bat`

---

Happy coding & selamat berkarya! 