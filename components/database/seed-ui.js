const { executeQuery } = require('./config');
require('dotenv').config();

const seedUIData = async () => {
    try {
        console.log('🌱 Seeding UI data...');

        // Add sample testimonials
        const testimonials = [
            {
                client_name: 'Sarah Johnson',
                client_position: 'CEO',
                client_company: 'TechStart Inc.',
                rating: 5,
                testimonial: 'MDA transformed our business with their exceptional web development services. The team was professional, responsive, and delivered beyond our expectations.',
                is_featured: true
            },
            {
                client_name: 'Michael Chen',
                client_position: 'Marketing Director',
                client_company: 'Global Solutions',
                rating: 5,
                testimonial: 'The e-commerce platform they built for us increased our sales by 300% in the first quarter. Highly recommended!',
                is_featured: true
            },
            {
                client_name: 'Emily Rodriguez',
                client_position: 'Founder',
                client_company: 'Creative Studios',
                rating: 4,
                testimonial: 'Great communication throughout the project. The mobile app they developed is exactly what we envisioned.',
                is_featured: false
            },
            {
                client_name: 'David Thompson',
                client_position: 'Operations Manager',
                client_company: 'InnovateCorp',
                rating: 5,
                testimonial: 'Outstanding UI/UX design work. Our users love the new interface and engagement has increased significantly.',
                is_featured: true
            },
            {
                client_name: 'Lisa Wang',
                client_position: 'Digital Marketing Manager',
                client_company: 'Growth Partners',
                rating: 4,
                testimonial: 'The digital marketing campaign they ran for us exceeded all KPIs. ROI was exceptional.',
                is_featured: false
            }
        ];

        for (const testimonial of testimonials) {
            await executeQuery(`
                INSERT IGNORE INTO testimonials (client_name, client_position, client_company, rating, testimonial, is_featured)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [testimonial.client_name, testimonial.client_position, testimonial.client_company, testimonial.rating, testimonial.testimonial, testimonial.is_featured]);
        }

        // Add sample projects
        const projects = [
            {
                title: 'E-commerce Platform Redesign',
                slug: 'ecommerce-redesign',
                description: 'Complete redesign and development of a modern e-commerce platform with advanced features.',
                short_description: 'Modern e-commerce platform with advanced features',
                status: 'completed',
                priority: 'high',
                budget: 15000.00,
                progress: 100,
                tags: JSON.stringify(['e-commerce', 'redesign', 'modern']),
                images: JSON.stringify(['project1-1.jpg', 'project1-2.jpg'])
            },
            {
                title: 'Mobile Banking App',
                slug: 'mobile-banking-app',
                description: 'Development of a secure mobile banking application with biometric authentication.',
                short_description: 'Secure mobile banking with biometric authentication',
                status: 'in_progress',
                priority: 'urgent',
                budget: 25000.00,
                progress: 75,
                tags: JSON.stringify(['mobile', 'banking', 'security']),
                images: JSON.stringify(['project2-1.jpg', 'project2-2.jpg'])
            },
            {
                title: 'Corporate Website',
                slug: 'corporate-website',
                description: 'Professional corporate website with content management system and SEO optimization.',
                short_description: 'Professional corporate website with CMS',
                status: 'review',
                priority: 'medium',
                budget: 8000.00,
                progress: 90,
                tags: JSON.stringify(['corporate', 'cms', 'seo']),
                images: JSON.stringify(['project3-1.jpg'])
            },
            {
                title: 'Restaurant Ordering System',
                slug: 'restaurant-ordering',
                description: 'Online food ordering system with real-time tracking and payment integration.',
                short_description: 'Online food ordering with real-time tracking',
                status: 'pending',
                priority: 'medium',
                budget: 12000.00,
                progress: 0,
                tags: JSON.stringify(['food', 'ordering', 'tracking']),
                images: JSON.stringify([])
            }
        ];

        for (const project of projects) {
            await executeQuery(`
                INSERT IGNORE INTO projects (title, slug, description, short_description, status, priority, budget, progress, tags, images)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [project.title, project.slug, project.description, project.short_description, project.status, project.priority, project.budget, project.progress, project.tags, project.images]);
        }

        // Add sample contact messages
        const messages = [
            {
                first_name: 'John',
                last_name: 'Smith',
                email: 'john.smith@example.com',
                phone: '+1-555-0123',
                company: 'Smith Enterprises',
                subject: 'Website Development Inquiry',
                message: 'I am interested in getting a new website developed for my business. Could you please provide more information about your services and pricing?',
                service_interest: 'Custom Website Development',
                budget_range: '$5,000 - $10,000',
                timeline: '2-3 months',
                status: 'new',
                priority: 'medium'
            },
            {
                first_name: 'Maria',
                last_name: 'Garcia',
                email: 'maria.garcia@example.com',
                phone: '+1-555-0456',
                company: 'Garcia Consulting',
                subject: 'Mobile App Development',
                message: 'We need a mobile app for our consulting business. Looking for a professional team to handle the development.',
                service_interest: 'Mobile App Development',
                budget_range: '$15,000 - $25,000',
                timeline: '4-6 months',
                status: 'read',
                priority: 'high'
            },
            {
                first_name: 'Robert',
                last_name: 'Wilson',
                email: 'robert.wilson@example.com',
                phone: '+1-555-0789',
                company: 'Wilson Retail',
                subject: 'E-commerce Platform',
                message: 'Interested in setting up an online store for our retail business. Need a complete e-commerce solution.',
                service_interest: 'E-commerce Platform',
                budget_range: '$10,000 - $20,000',
                timeline: '3-4 months',
                status: 'replied',
                priority: 'high'
            }
        ];

        for (const message of messages) {
            await executeQuery(`
                INSERT IGNORE INTO contact_messages (first_name, last_name, email, phone, company, subject, message, service_interest, budget_range, timeline, status, priority)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [message.first_name, message.last_name, message.email, message.phone, message.company, message.subject, message.message, message.service_interest, message.budget_range, message.timeline, message.status, message.priority]);
        }

        // Add sample users
        const users = [
            {
                username: 'manager1',
                email: 'manager@mda.com',
                password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
                first_name: 'Project',
                last_name: 'Manager',
                role: 'manager',
                phone: '+1-555-0101',
                is_active: true,
                email_verified: true
            },
            {
                username: 'developer1',
                email: 'developer@mda.com',
                password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
                first_name: 'John',
                last_name: 'Developer',
                role: 'developer',
                phone: '+1-555-0102',
                is_active: true,
                email_verified: true
            },
            {
                username: 'designer1',
                email: 'designer@mda.com',
                password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
                first_name: 'Sarah',
                last_name: 'Designer',
                role: 'designer',
                phone: '+1-555-0103',
                is_active: true,
                email_verified: true
            },
            {
                username: 'client1',
                email: 'client@example.com',
                password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
                first_name: 'Client',
                last_name: 'User',
                role: 'client',
                phone: '+1-555-0104',
                is_active: true,
                email_verified: true
            }
        ];

        for (const user of users) {
            await executeQuery(`
                INSERT IGNORE INTO users (username, email, password, first_name, last_name, role, phone, is_active, email_verified)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [user.username, user.email, user.password, user.first_name, user.last_name, user.role, user.phone, user.is_active, user.email_verified]);
        }

        console.log('✅ UI data seeded successfully!');
        console.log('📊 Added:');
        console.log('- 5 testimonials');
        console.log('- 4 sample projects');
        console.log('- 3 contact messages');
        console.log('- 4 additional users');

    } catch (error) {
        console.error('❌ Failed to seed UI data:', error);
        process.exit(1);
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    seedUIData();
}

module.exports = seedUIData; 