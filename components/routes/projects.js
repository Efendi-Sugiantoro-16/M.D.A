const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../database/config');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { status, service, limit, page = 1 } = req.query;
        const offset = (page - 1) * (limit || 10);
        
        let whereClause = 'WHERE 1=1';
        let params = [];

        // Filter by status
        if (status) {
            whereClause += ' AND p.status = ?';
            params.push(status);
        }

        // Filter by service
        if (service) {
            whereClause += ' AND p.service_id = ?';
            params.push(service);
        }

        // Get total count
        const countResult = await executeQuery(
            `SELECT COUNT(*) as total FROM projects p ${whereClause}`,
            params
        );

        const total = countResult.success ? countResult.data[0].total : 0;

        // Get projects with service and client info
        const limitClause = limit ? `LIMIT ${parseInt(limit)} OFFSET ${offset}` : '';
        
        const result = await executeQuery(
            `SELECT p.*, s.name as service_name, s.slug as service_slug,
                    CONCAT(u.first_name, ' ', u.last_name) as client_name, u.email as client_email
             FROM projects p
             LEFT JOIN services s ON p.service_id = s.id
             LEFT JOIN users u ON p.client_id = u.id
             ${whereClause}
             ORDER BY p.created_at DESC ${limitClause}`,
            params
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch projects'
            });
        }

        res.json({
            success: true,
            count: result.data.length,
            data: result.data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit) || 10,
                total,
                pages: Math.ceil(total / (parseInt(limit) || 10))
            }
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Get single project
// @route   GET /api/projects/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await executeQuery(
            `SELECT p.*, s.name as service_name, s.slug as service_slug,
                    CONCAT(u.first_name, ' ', u.last_name) as client_name, u.email as client_email
             FROM projects p
             LEFT JOIN services s ON p.service_id = s.id
             LEFT JOIN users u ON p.client_id = u.id
             WHERE p.slug = ?`,
            [slug]
        );

        if (!result.success || result.data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        res.json({
            success: true,
            data: result.data[0]
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

module.exports = router; 