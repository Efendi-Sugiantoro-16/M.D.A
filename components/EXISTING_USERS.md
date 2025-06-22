# Existing Users in MDA System

## Default Users (Created by seed-ui.js)

### Admin Users
1. **admin@mda.com** / admin123 (Role: admin)
2. **manager@mda.com** / admin123 (Role: manager)
3. **developer@mda.com** / admin123 (Role: developer)
4. **designer@mda.com** / admin123 (Role: designer)
5. **client@example.com** / admin123 (Role: client)

### Usernames Already Taken
- admin
- manager1
- developer1
- designer1
- client1

## Testing Registration

### ✅ **Available for Testing:**
- **Email**: test@example.com, newuser@test.com, demo@mda.com
- **Username**: testuser, newuser, demo, john_doe, jane_smith

### ❌ **Already Taken (Will Cause Error):**
- **Email**: admin@mda.com, manager@mda.com, developer@mda.com
- **Username**: admin, manager1, developer1, designer1, client1

## How to Test Registration

### 1. **Test with Available Data:**
```
Email: test@example.com
Username: testuser
Password: password123
First Name: Test
Last Name: User
Role: client
```

### 2. **Test Error Handling:**
Try registering with:
- Email: admin@mda.com (should show "Email is already registered")
- Username: admin (should show "Username is already taken")

### 3. **Test Real-time Validation:**
- Type in username field and see real-time availability check
- Type in email field and see real-time availability check

## Database Reset

If you want to start fresh:

1. **Delete all users except admin:**
```sql
DELETE FROM users WHERE email != 'admin@mda.com';
```

2. **Or reset entire database:**
```bash
# Run setup script
setup-database.bat
```

## Common Registration Errors

1. **"Email is already registered"** - Email sudah ada di database
2. **"Username is already taken"** - Username sudah ada di database
3. **"Email and username are already taken"** - Keduanya sudah ada
4. **"Invalid email format"** - Format email tidak valid
5. **"Username must be between 3 and 50 characters"** - Username terlalu pendek/panjang
6. **"Username can only contain letters, numbers, and underscores"** - Username mengandung karakter tidak valid
7. **"Password must be at least 6 characters long"** - Password terlalu pendek
8. **"Passwords do not match"** - Password confirmation tidak sama 