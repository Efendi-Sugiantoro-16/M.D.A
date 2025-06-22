# MDA Server Startup Guide

## 🚀 Cara Menjalankan Server

### **Metode 1: Script Otomatis (Recommended)**

#### **A. Script PowerShell (Paling Aman)**
```powershell
# Buka PowerShell di folder backend
cd C:\Belajar-Webservices_Pemrograman-3\714230018\MDA\backend

# Jalankan script PowerShell
.\start-server.ps1
```

#### **B. Script Batch Clean Start**
```cmd
# Buka Command Prompt di folder backend
cd C:\Belajar-Webservices_Pemrograman-3\714230018\MDA\backend

# Jalankan script batch
start-clean.bat
```

#### **C. Script Batch Port 3001**
```cmd
# Jika port 3000 masih bermasalah, gunakan port 3001
start-port-3001.bat
```

### **Metode 2: Manual (Jika Script Tidak Berfungsi)**

#### **A. Hentikan Semua Proses Node.js**
```cmd
# Hentikan semua proses Node.js
taskkill /f /im node.exe

# Tunggu 3 detik
timeout /t 3
```

#### **B. Cek Port 3000**
```cmd
# Cek apakah port 3000 masih digunakan
netstat -ano | findstr :3000

# Jika masih ada proses, hentikan dengan PID
taskkill /PID <PID> /F
```

#### **C. Jalankan Server**
```cmd
# Masuk ke folder backend
cd C:\Belajar-Webservices_Pemrograman-3\714230018\MDA\backend

# Jalankan server
node server.js
```

### **Metode 3: Port Alternatif**

Jika port 3000 selalu bermasalah, gunakan port lain:

```cmd
# Set environment variable untuk port 3001
set PORT=3001
node server.js
```

## 🔧 Troubleshooting

### **Error: EADDRINUSE: address already in use :::3000**

**Solusi:**
1. **Gunakan Script Otomatis** (Metode 1)
2. **Restart Komputer** untuk membersihkan semua proses
3. **Gunakan Port Lain** (Metode 3)

### **Error: Cannot find module**

**Solusi:**
```cmd
# Install dependencies
npm install
```

### **Error: Database Connection Failed**

**Solusi:**
```cmd
# Setup database
setup-database.bat
```

## 🌐 Akses Aplikasi

### **Port 3000 (Default)**
- **Login Page**: http://localhost:3000/login
- **Register Page**: http://localhost:3000/register
- **Admin Dashboard**: http://localhost:3000/
- **Health Check**: http://localhost:3000/api/health

### **Port 3001 (Alternatif)**
- **Login Page**: http://localhost:3001/login
- **Register Page**: http://localhost:3001/register
- **Admin Dashboard**: http://localhost:3001/
- **Health Check**: http://localhost:3001/api/health

## 📋 Checklist Startup

- [ ] Masuk ke folder `backend`
- [ ] Install dependencies: `npm install`
- [ ] Setup database: `setup-database.bat`
- [ ] Jalankan server dengan salah satu metode di atas
- [ ] Cek server berjalan: buka http://localhost:3000/api/health
- [ ] Test login: http://localhost:3000/login
- [ ] Test register: http://localhost:3000/register

## 🔑 Default Credentials

- **Email**: admin@mda.com
- **Password**: admin123

## 📁 File Scripts

```
backend/
├── start-server.ps1          # PowerShell script (Recommended)
├── start-clean.bat           # Batch script clean start
├── start-port-3001.bat       # Batch script port 3001
├── setup-database.bat        # Database setup
└── server.js                 # Main server file
```

## ⚠️ Tips Penting

1. **Selalu jalankan dari folder `backend`**
2. **Jangan jalankan `npm start` dari folder root**
3. **Gunakan script otomatis untuk menghindari konflik port**
4. **Restart komputer jika port masih bermasalah**
5. **Pastikan MySQL server berjalan untuk database**

## 🆘 Jika Masih Bermasalah

1. **Restart komputer**
2. **Cek apakah ada antivirus yang memblokir**
3. **Cek firewall Windows**
4. **Gunakan port yang berbeda (3001, 3002, dll)**
5. **Cek log error di console** 