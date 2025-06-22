const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../database/config');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
    body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('first_name')
        .notEmpty()
        .withMessage('First name is required'),
    body('last_name')
        .notEmpty()
        .withMessage('Last name is required'),
    body('role')
        .isIn(['admin', 'manager', 'developer', 'designer', 'client'])
        .withMessage('Invalid role selected'),
    body('phone')
        .optional()
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone number must be between 10 and 15 characters')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { username, email, password, first_name, last_name, phone, role } = req.body;

        // Check if user already exists
        const existingUser = await executeQuery(
            'SELECT id, email, username FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUser.success && existingUser.data.length > 0) {
            const existingEmail = existingUser.data.find(user => user.email === email);
            const existingUsername = existingUser.data.find(user => user.username === username);
            
            let errorMessage = '';
            if (existingEmail && existingUsername) {
                errorMessage = 'Email and username are already taken';
            } else if (existingEmail) {
                errorMessage = 'Email is already registered';
            } else if (existingUsername) {
                errorMessage = 'Username is already taken';
            }
            
            return res.status(400).json({
                success: false,
                error: errorMessage
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with the selected role
        const result = await executeQuery(
            'INSERT INTO users (username, email, password, first_name, last_name, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, first_name, last_name, phone || null, role || 'client']
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to create user'
            });
        }

        // Get created user (without password)
        const userResult = await executeQuery(
            'SELECT id, username, email, first_name, last_name, role, created_at FROM users WHERE id = ?',
            [result.data.insertId]
        );

        const user = userResult.data[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // Check if user exists
        const result = await executeQuery(
            'SELECT id, username, email, password, first_name, last_name, role, is_active FROM users WHERE email = ?',
            [email]
        );

        if (!result.success || result.data.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const user = result.data[0];

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Remove password from response
        delete user.password;

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const result = await executeQuery(
            'SELECT id, username, email, first_name, last_name, role, phone, avatar, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!result.success || result.data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: result.data[0]
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Check username availability
// @route   POST /api/auth/check-username
// @access  Public
router.post('/check-username', [
    body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Invalid username format',
                details: errors.array()
            });
        }

        const { username } = req.body;

        const result = await executeQuery(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        const available = !result.success || result.data.length === 0;

        res.json({
            success: true,
            available,
            message: available ? 'Username is available' : 'Username is already taken'
        });
    } catch (error) {
        console.error('Check username error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Check email availability
// @route   POST /api/auth/check-email
// @access  Public
router.post('/check-email', [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
                details: errors.array()
            });
        }

        const { email } = req.body;

        const result = await executeQuery(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        const available = !result.success || result.data.length === 0;

        res.json({
            success: true,
            available,
            message: available ? 'Email is available' : 'Email is already registered'
        });
    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

module.exports = router; 