const express = require('express');
const { executeQuery } = require('../database/config');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard overview statistics
// @route   GET /api/dashboard/overview
// @access  Private (Admin/Manager)
router.get('/overview', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        // Get total users
        const usersResult = await executeQuery('SELECT COUNT(*) as total FROM users');
        const totalUsers = usersResult.success ? usersResult.data[0].total : 0;

        // Get active users
        const activeUsersResult = await executeQuery('SELECT COUNT(*) as count FROM users WHERE is_active = TRUE');
        const activeUsers = activeUsersResult.success ? activeUsersResult.data[0].count : 0;

        // Get total projects
        const projectsResult = await executeQuery('SELECT COUNT(*) as total FROM projects');
        const totalProjects = projectsResult.success ? projectsResult.data[0].total : 0;

        // Get active projects
        const activeProjectsResult = await executeQuery(
            "SELECT COUNT(*) as count FROM projects WHERE status IN ('pending', 'in_progress', 'review')"
        );
        const activeProjects = activeProjectsResult.success ? activeProjectsResult.data[0].count : 0;

        // Get completed projects
        const completedProjectsResult = await executeQuery(
            "SELECT COUNT(*) as count FROM projects WHERE status = 'completed'"
        );
        const completedProjects = completedProjectsResult.success ? completedProjectsResult.data[0].count : 0;

        // Get total services
        const servicesResult = await executeQuery('SELECT COUNT(*) as total FROM services');
        const totalServices = servicesResult.success ? servicesResult.data[0].total : 0;

        // Get active services
        const activeServicesResult = await executeQuery('SELECT COUNT(*) as count FROM services WHERE is_active = TRUE');
        const activeServices = activeServicesResult.success ? activeServicesResult.data[0].count : 0;

        // Get total contact messages
        const messagesResult = await executeQuery('SELECT COUNT(*) as total FROM contact_messages');
        const totalMessages = messagesResult.success ? messagesResult.data[0].total : 0;

        // Get new contact messages (last 7 days)
        const newMessagesResult = await executeQuery(
            'SELECT COUNT(*) as count FROM contact_messages WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
        );
        const newMessages = newMessagesResult.success ? newMessagesResult.data[0].count : 0;

        // Get unread contact messages
        const unreadMessagesResult = await executeQuery(
            "SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'"
        );
        const unreadMessages = unreadMessagesResult.success ? unreadMessagesResult.data[0].count : 0;

        // Get recent projects (last 30 days)
        const recentProjectsResult = await executeQuery(
            'SELECT COUNT(*) as count FROM projects WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
        );
        const recentProjects = recentProjectsResult.success ? recentProjectsResult.data[0].count : 0;

        // Get recent users (last 30 days)
        const recentUsersResult = await executeQuery(
            'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
        );
        const recentUsers = recentUsersResult.success ? recentUsersResult.data[0].count : 0;

        res.json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    recent: recentUsers
                },
                projects: {
                    total: totalProjects,
                    active: activeProjects,
                    completed: completedProjects,
                    recent: recentProjects
                },
                services: {
                    total: totalServices,
                    active: activeServices
                },
                messages: {
                    total: totalMessages,
                    new: newMessages,
                    unread: unreadMessages
                }
            }
        });
    } catch (error) {
        console.error('Get dashboard overview error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Get projects by status
// @route   GET /api/dashboard/projects-by-status
// @access  Private (Admin/Manager)
router.get('/projects-by-status', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const result = await executeQuery(
            'SELECT status, COUNT(*) as count FROM projects GROUP BY status ORDER BY count DESC'
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch project statistics'
            });
        }

        res.json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error('Get projects by status error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Get users by role
// @route   GET /api/dashboard/users-by-role
// @access  Private (Admin/Manager)
router.get('/users-by-role', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const result = await executeQuery(
            'SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY count DESC'
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch user statistics'
            });
        }

        res.json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error('Get users by role error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/recent-activities
// @access  Private (Admin/Manager)
router.get('/recent-activities', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Get recent projects
        const recentProjects = await executeQuery(
            `SELECT p.title, p.slug, p.status, p.created_at, 
                    CONCAT(u.first_name, ' ', u.last_name) as client_name
             FROM projects p
             LEFT JOIN users u ON p.client_id = u.id
             ORDER BY p.created_at DESC
             LIMIT ?`,
            [parseInt(limit)]
        );

        // Get recent contact messages
        const recentMessages = await executeQuery(
            `SELECT first_name, last_name, email, subject, status, created_at
             FROM contact_messages
             ORDER BY created_at DESC
             LIMIT ?`,
            [parseInt(limit)]
        );

        // Get recent users
        const recentUsers = await executeQuery(
            `SELECT username, email, first_name, last_name, role, created_at
             FROM users
             ORDER BY created_at DESC
             LIMIT ?`,
            [parseInt(limit)]
        );

        res.json({
            success: true,
            data: {
                projects: recentProjects.success ? recentProjects.data : [],
                messages: recentMessages.success ? recentMessages.data : [],
                users: recentUsers.success ? recentUsers.data : []
            }
        });
    } catch (error) {
        console.error('Get recent activities error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Get monthly statistics
// @route   GET /api/dashboard/monthly-stats
// @access  Private (Admin/Manager)
router.get('/monthly-stats', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const { year = new Date().getFullYear() } = req.query;

        // Get monthly project counts
        const monthlyProjects = await executeQuery(
            `SELECT MONTH(created_at) as month, COUNT(*) as count
             FROM projects
             WHERE YEAR(created_at) = ?
             GROUP BY MONTH(created_at)
             ORDER BY month`,
            [year]
        );

        // Get monthly user registrations
        const monthlyUsers = await executeQuery(
            `SELECT MONTH(created_at) as month, COUNT(*) as count
             FROM users
             WHERE YEAR(created_at) = ?
             GROUP BY MONTH(created_at)
             ORDER BY month`,
            [year]
        );

        // Get monthly contact messages
        const monthlyMessages = await executeQuery(
            `SELECT MONTH(created_at) as month, COUNT(*) as count
             FROM contact_messages
             WHERE YEAR(created_at) = ?
             GROUP BY MONTH(created_at)
             ORDER BY month`,
            [year]
        );

        res.json({
            success: true,
            data: {
                year: parseInt(year),
                projects: monthlyProjects.success ? monthlyProjects.data : [],
                users: monthlyUsers.success ? monthlyUsers.data : [],
                messages: monthlyMessages.success ? monthlyMessages.data : []
            }
        });
    } catch (error) {
        console.error('Get monthly stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

module.exports = router; 