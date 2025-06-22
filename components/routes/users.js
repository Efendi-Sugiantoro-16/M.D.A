const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../database/config');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search, active } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        let params = [];

        // Filter by role
        if (role) {
            whereClause += ' AND role = ?';
            params.push(role);
        }

        // Filter by active status
        if (active !== undefined) {
            whereClause += ' AND is_active = ?';
            params.push(active === 'true');
        }

        // Search functionality
        if (search) {
            whereClause += ' AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Get total count
        const countResult = await executeQuery(
            `SELECT COUNT(*) as total FROM users ${whereClause}`,
            params
        );

        const total = countResult.success ? countResult.data[0].total : 0;

        // Get users with pagination
        const usersResult = await executeQuery(
            `SELECT id, username, email, first_name, last_name, role, phone, avatar, is_active, email_verified, created_at 
             FROM users ${whereClause} 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );

        if (!usersResult.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch users'
            });
        }

        res.json({
            success: true,
            data: usersResult.data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

module.exports = router; 