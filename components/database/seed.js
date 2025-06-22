const { executeQuery } = require('./config');
require('dotenv').config();

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Sample testimonials
        const testimonials = [
            {
                client_name: 'Sarah Johnson',
                client_position: 'CEO',
                client_company: 'TechStart Inc.',
                rating: 5,
                testimonial: 'MDA delivered an exceptional website that perfectly represents our brand. The team was professional, responsive, and exceeded our expectations.',
                is_featured: true
            },
            {
                client_name: 'Michael Chen',
                client_position: 'Marketing Director',
                client_company: 'Global Solutions',
                rating: 5,
                testimonial: 'Working with MDA was a game-changer for our business. Their e-commerce solution increased our online sales by 300% in the first quarter.',
                is_featured: true
            },
            {
                client_name: 'Emily Rodriguez',
                client_position: 'Founder',
                client_company: 'Creative Studio',
                rating: 5,
                testimonial: 'The mobile app developed by MDA is intuitive, fast, and has received excellent user feedback. Highly recommended!',
                is_featured: false
            }
        ];

        for (const testimonial of testimonials) {
            await executeQuery(
                'INSERT IGNORE INTO testimonials (client_name, client_position, client_company, rating, testimonial, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
                [testimonial.client_name, testimonial.client_position, testimonial.client_company, testimonial.rating, testimonial.testimonial, testimonial.is_featured]
            );
        }

        // Sample projects
        const projects = [
            {
                title: 'E-commerce Platform for TechStart',
                slug: 'ecommerce-techstart',
                description: 'A comprehensive e-commerce platform with advanced features including inventory management, payment processing, and analytics dashboard.',
                short_description: 'Modern e-commerce solution for growing tech company',
                status: 'completed',
                priority: 'high',
                budget: 15000.00,
                progress: 100,
                tags: JSON.stringify(['ecommerce', 'react', 'nodejs', 'mysql']),
                images: JSON.stringify(['project1-1.jpg', 'project1-2.jpg'])
            },
            {
                title: 'Mobile App for Food Delivery',
                slug: 'food-delivery-app',
                description: 'Cross-platform mobile application for food delivery service with real-time tracking and payment integration.',
                short_description: 'Mobile app for food delivery service',
                status: 'in_progress',
                priority: 'medium',
                budget: 25000.00,
                progress: 65,
                tags: JSON.stringify(['mobile', 'react-native', 'firebase']),
                images: JSON.stringify(['project2-1.jpg', 'project2-2.jpg'])
            },
            {
                title: 'Corporate Website Redesign',
                slug: 'corporate-website-redesign',
                description: 'Complete redesign of corporate website with modern design, improved UX, and SEO optimization.',
                short_description: 'Modern corporate website with improved UX',
                status: 'review',
                priority: 'medium',
                budget: 8000.00,
                progress: 90,
                tags: JSON.stringify(['website', 'design', 'seo']),
                images: JSON.stringify(['project3-1.jpg'])
            }
        ];

        for (const project of projects) {
            await executeQuery(
                `INSERT IGNORE INTO projects 
                (title, slug, description, short_description, status, priority, budget, progress, tags, images) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [project.title, project.slug, project.description, project.short_description, project.status, project.priority, project.budget, project.progress, project.tags, project.images]
            );
        }

        // Sample blog posts
        const blogPosts = [
            {
                title: 'The Future of Web Development in 2024',
                slug: 'future-web-development-2024',
                excerpt: 'Explore the latest trends and technologies shaping the future of web development.',
                content: 'Web development continues to evolve rapidly with new technologies and frameworks emerging every year. In 2024, we\'re seeing a shift towards more performant, accessible, and user-friendly web applications...',
                status: 'published',
                tags: JSON.stringify(['web-development', 'trends', 'technology']),
                meta_title: 'Future of Web Development 2024 - Latest Trends and Technologies',
                meta_description: 'Discover the latest trends and technologies shaping web development in 2024.'
            },
            {
                title: 'How to Choose the Right Digital Agency for Your Business',
                slug: 'choose-right-digital-agency',
                excerpt: 'A comprehensive guide to selecting the perfect digital agency for your business needs.',
                content: 'Choosing the right digital agency is crucial for the success of your online presence. With so many options available, it can be overwhelming to make the right decision...',
                status: 'published',
                tags: JSON.stringify(['business', 'digital-agency', 'tips']),
                meta_title: 'How to Choose the Right Digital Agency - Complete Guide',
                meta_description: 'Learn how to select the perfect digital agency for your business with our comprehensive guide.'
            }
        ];

        for (const post of blogPosts) {
            await executeQuery(
                `INSERT IGNORE INTO blog_posts 
                (title, slug, excerpt, content, status, tags, meta_title, meta_description, author_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [post.title, post.slug, post.excerpt, post.content, post.status, post.tags, post.meta_title, post.meta_description, 1] // author_id = 1 (admin)
            );
        }

        // Sample newsletter subscribers
        const subscribers = [
            { email: 'john.doe@example.com', first_name: 'John', last_name: 'Doe' },
            { email: 'jane.smith@example.com', first_name: 'Jane', last_name: 'Smith' },
            { email: 'bob.wilson@example.com', first_name: 'Bob', last_name: 'Wilson' }
        ];

        for (const subscriber of subscribers) {
            await executeQuery(
                'INSERT IGNORE INTO newsletter_subscribers (email, first_name, last_name) VALUES (?, ?, ?)',
                [subscriber.email, subscriber.first_name, subscriber.last_name]
            );
        }

        console.log('✅ Database seeding completed successfully!');
        console.log('📊 Sample data added:');
        console.log('- 3 testimonials');
        console.log('- 3 projects');
        console.log('- 2 blog posts');
        console.log('- 3 newsletter subscribers');

    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        throw error;
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    seedData()
        .then(() => {
            console.log('🎉 Seeding process completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Seeding process failed:', error);
            process.exit(1);
        });
}

module.exports = seedData; 