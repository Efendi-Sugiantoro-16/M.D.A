const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../database/config');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { featured, active, limit } = req.query;
        
        let whereClause = 'WHERE 1=1';
        let params = [];

        // Filter by featured
        if (featured === 'true') {
            whereClause += ' AND is_featured = TRUE';
        }

        // Filter by active
        if (active === 'true') {
            whereClause += ' AND is_active = TRUE';
        }

        // Limit results
        const limitClause = limit ? `LIMIT ${parseInt(limit)}` : '';

        const result = await executeQuery(
            `SELECT * FROM services ${whereClause} ORDER BY sort_order ASC, created_at DESC ${limitClause}`,
            params
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch services'
            });
        }

        res.json({
            success: true,
            count: result.data.length,
            data: result.data
        });
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Get single service
// @route   GET /api/services/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await executeQuery(
            'SELECT * FROM services WHERE slug = ? AND is_active = TRUE',
            [slug]
        );

        if (!result.success || result.data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: result.data[0]
        });
    } catch (error) {
        console.error('Get service error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

module.exports = router; 