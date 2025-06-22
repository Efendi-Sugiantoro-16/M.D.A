# MDA Registration System Guide

## Overview
Sistem registrasi pengguna baru untuk MDA (Modern Digital Agency) Admin Dashboard.

## Features

### 1. Halaman Registrasi (`/register`)
- Form registrasi yang lengkap dan responsif
- Validasi real-time untuk semua field
- Toggle password visibility
- Validasi password confirmation
- Pemilihan role pengguna

### 2. Field Registrasi
- **First Name** (required)
- **Last Name** (required)
- **Username** (required, 3-50 karakter, hanya huruf, angka, underscore)
- **Email** (required, format email valid)
- **Phone** (optional, 10-15 karakter)
- **Role** (required, pilihan: client, developer, designer, manager, admin)
- **Password** (required, minimal 6 karakter)
- **Confirm Password** (required, harus sama dengan password)

### 3. Validasi
- Validasi client-side untuk UX yang baik
- Validasi server-side untuk keamanan
- Pengecekan email dan username yang sudah ada
- Validasi format dan panjang field

### 4. Keamanan
- Password di-hash menggunakan bcrypt
- JWT token untuk autentikasi
- Rate limiting untuk mencegah spam
- Validasi input untuk mencegah injection

## Setup Instructions

### 1. Database Setup
```bash
# Jalankan script setup database
setup-database.bat

# Atau manual:
node database/create-tables.js
node database/seed-ui.js
```

### 2. Start Server
```bash
cd backend
npm start
```

### 3. Access URLs
- **Login Page**: http://localhost:3000/login
- **Register Page**: http://localhost:3000/register
- **Admin Dashboard**: http://localhost:3000/

## API Endpoints

### POST /api/auth/register
Registrasi pengguna baru

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "role": "client"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "client",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "error": "User with this email or username already exists"
}
```

## User Roles

1. **admin** - Akses penuh ke semua fitur
2. **manager** - Manajemen proyek dan tim
3. **developer** - Akses ke development tools
4. **designer** - Akses ke design tools
5. **client** - Akses terbatas untuk melihat proyek

## Default Credentials

Untuk testing, gunakan akun default:
- **Email**: admin@mda.com
- **Password**: admin123

## Troubleshooting

### 1. Port 3000 Already in Use
```bash
# Cari proses yang menggunakan port 3000
netstat -ano | findstr :3000

# Hentikan proses
taskkill /PID <PID> /F
```

### 2. Database Connection Error
- Pastikan MySQL server berjalan
- Periksa konfigurasi di file `.env`
- Jalankan `setup-database.bat`

### 3. Registration Fails
- Periksa console browser untuk error JavaScript
- Periksa server logs untuk error backend
- Pastikan semua field required terisi
- Pastikan email dan username unik

## File Structure

```
backend/
├── public/
│   ├── register.html          # Halaman registrasi
│   └── login.html             # Halaman login (updated)
├── routes/
│   └── auth.js                # Route registrasi & login
├── database/
│   ├── create-tables.js       # Script pembuatan tabel
│   └── seed-ui.js             # Script seeding data
├── server.js                  # Server configuration
└── setup-database.bat         # Script setup database
```

## Security Considerations

1. **Password Security**
   - Password minimal 6 karakter
   - Password di-hash dengan bcrypt
   - Salt rounds: 10

2. **Input Validation**
   - Validasi client-side untuk UX
   - Validasi server-side untuk keamanan
   - Sanitasi input untuk mencegah XSS

3. **Rate Limiting**
   - 100 requests per 15 menit per IP
   - Mencegah brute force dan spam

4. **JWT Security**
   - Token expires dalam 24 jam
   - Secret key yang kuat
   - Token disimpan di localStorage

## Future Enhancements

1. **Email Verification**
   - Kirim email verifikasi setelah registrasi
   - Konfirmasi email sebelum aktivasi akun

2. **Password Strength**
   - Indikator kekuatan password
   - Requirement password yang lebih kompleks

3. **Social Login**
   - Integrasi dengan Google, Facebook, GitHub

4. **Two-Factor Authentication**
   - 2FA untuk keamanan tambahan

5. **Account Recovery**
   - Reset password via email
   - Security questions 