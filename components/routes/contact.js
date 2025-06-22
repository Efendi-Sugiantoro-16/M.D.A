const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../database/config');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', [
    body('first_name')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 50 })
        .withMessage('First name must be less than 50 characters'),
    body('last_name')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ max: 50 })
        .withMessage('Last name must be less than 50 characters'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('company')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Company name must be less than 100 characters'),
    body('subject')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Subject must be less than 200 characters'),
    body('service_interest')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Service interest must be less than 100 characters'),
    body('budget_range')
        .optional()
        .isIn(['under-1000', '1000-5000', '5000-10000', 'over-10000'])
        .withMessage('Invalid budget range'),
    body('timeline')
        .optional()
        .isIn(['asap', '1-2-weeks', '1-2-months', 'flexible'])
        .withMessage('Invalid timeline')
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

        const {
            first_name,
            last_name,
            email,
            phone,
            company,
            subject,
            message,
            service_interest,
            budget_range,
            timeline
        } = req.body;

        // Insert contact message
        const result = await executeQuery(
            `INSERT INTO contact_messages 
            (first_name, last_name, email, phone, company, subject, message, service_interest, budget_range, timeline) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, email, phone || null, company || null, subject || null, message, service_interest || null, budget_range || null, timeline || null]
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to submit contact form'
            });
        }

        const messageId = result.data.insertId;

        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully. We will get back to you soon!',
            data: {
                messageId,
                submitted_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Get all contact messages (admin only)
// @route   GET /api/contact
// @access  Private (Admin/Manager)
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, search } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        let params = [];

        // Filter by status
        if (status) {
            whereClause += ' AND status = ?';
            params.push(status);
        }

        // Filter by priority
        if (priority) {
            whereClause += ' AND priority = ?';
            params.push(priority);
        }

        // Search functionality
        if (search) {
            whereClause += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR message LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Get total count
        const countResult = await executeQuery(
            `SELECT COUNT(*) as total FROM contact_messages ${whereClause}`,
            params
        );

        const total = countResult.success ? countResult.data[0].total : 0;

        // Get messages with pagination
        const messagesResult = await executeQuery(
            `SELECT * FROM contact_messages ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );

        if (!messagesResult.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch contact messages'
            });
        }

        res.json({
            success: true,
            data: messagesResult.data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get contact messages error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private (Admin/Manager)
router.get('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const { id } = req.params;

        const result = await executeQuery(
            'SELECT * FROM contact_messages WHERE id = ?',
            [id]
        );

        if (!result.success || result.data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Contact message not found'
            });
        }

        res.json({
            success: true,
            data: result.data[0]
        });
    } catch (error) {
        console.error('Get contact message error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Update contact message status
// @route   PUT /api/contact/:id/status
// @access  Private (Admin/Manager)
router.put('/:id/status', protect, authorize('admin', 'manager'), [
    body('status')
        .isIn(['new', 'read', 'replied', 'closed'])
        .withMessage('Invalid status'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid priority'),
    body('assigned_to')
        .optional()
        .isInt()
        .withMessage('Invalid user ID')
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

        const { id } = req.params;
        const { status, priority, assigned_to } = req.body;

        // Check if message exists
        const messageResult = await executeQuery(
            'SELECT * FROM contact_messages WHERE id = ?',
            [id]
        );

        if (!messageResult.success || messageResult.data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Contact message not found'
            });
        }

        // Update message
        const updateResult = await executeQuery(
            'UPDATE contact_messages SET status = ?, priority = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, priority || null, assigned_to || null, id]
        );

        if (!updateResult.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to update contact message'
            });
        }

        // Get updated message
        const updatedResult = await executeQuery(
            'SELECT * FROM contact_messages WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Contact message updated successfully',
            data: updatedResult.data[0]
        });
    } catch (error) {
        console.error('Update contact message error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

module.exports = router; 