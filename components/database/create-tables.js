const { executeQuery, initializeDatabase } = require('./config');
require('dotenv').config();

const createTables = async () => {
    try {
        console.log('🚀 Creating database tables...');

        // Initialize database connection
        const initialized = await initializeDatabase();
        if (!initialized) {
            console.error('❌ Database initialization failed.');
            process.exit(1);
        }

        // Create tables
        const tables = [
            // Users table
            `CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                role ENUM('admin', 'manager', 'developer', 'designer', 'client') DEFAULT 'client',
                phone VARCHAR(20),
                avatar VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                email_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_username (username),
                INDEX idx_role (role)
            )`,

            // Services table
            `CREATE TABLE IF NOT EXISTS services (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) UNIQUE NOT NULL,
                description TEXT,
                short_description VARCHAR(255),
                icon VARCHAR(100),
                image VARCHAR(255),
                price DECIMAL(10,2),
                price_type ENUM('fixed', 'hourly', 'monthly', 'custom') DEFAULT 'fixed',
                duration VARCHAR(50),
                features JSON,
                is_active BOOLEAN DEFAULT TRUE,
                is_featured BOOLEAN DEFAULT FALSE,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_slug (slug),
                INDEX idx_is_active (is_active),
                INDEX idx_is_featured (is_featured)
            )`,

            // Projects table
            `CREATE TABLE IF NOT EXISTS projects (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(200) NOT NULL,
                slug VARCHAR(200) UNIQUE NOT NULL,
                description TEXT,
                short_description VARCHAR(255),
                client_id INT,
                service_id INT,
                status ENUM('pending', 'in_progress', 'review', 'completed', 'cancelled') DEFAULT 'pending',
                priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
                budget DECIMAL(10,2),
                start_date DATE,
                end_date DATE,
                actual_end_date DATE,
                progress INT DEFAULT 0,
                tags JSON,
                images JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
                INDEX idx_slug (slug),
                INDEX idx_status (status),
                INDEX idx_client_id (client_id),
                INDEX idx_service_id (service_id)
            )`,

            // Contact messages table
            `CREATE TABLE IF NOT EXISTS contact_messages (
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                company VARCHAR(100),
                subject VARCHAR(200),
                message TEXT NOT NULL,
                service_interest VARCHAR(100),
                budget_range VARCHAR(50),
                timeline VARCHAR(50),
                status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
                priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
                assigned_to INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_email (email),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at)
            )`,

            // Testimonials table
            `CREATE TABLE IF NOT EXISTS testimonials (
                id INT PRIMARY KEY AUTO_INCREMENT,
                client_name VARCHAR(100) NOT NULL,
                client_position VARCHAR(100),
                client_company VARCHAR(100),
                client_avatar VARCHAR(255),
                rating INT CHECK (rating >= 1 AND rating <= 5),
                testimonial TEXT NOT NULL,
                project_id INT,
                is_featured BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
                INDEX idx_is_featured (is_featured),
                INDEX idx_is_active (is_active)
            )`,

            // Settings table
            `CREATE TABLE IF NOT EXISTS settings (
                id INT PRIMARY KEY AUTO_INCREMENT,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT,
                setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
                description VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_setting_key (setting_key)
            )`
        ];

        // Execute each table creation
        for (let i = 0; i < tables.length; i++) {
            try {
                console.log(`Creating table ${i + 1}/${tables.length}...`);
                const result = await executeQuery(tables[i]);
                
                if (!result.success) {
                    console.warn(`⚠️  Warning: Table creation ${i + 1} may have failed:`, result.error);
                } else {
                    console.log(`✅ Table ${i + 1} created successfully`);
                }
            } catch (error) {
                console.warn(`⚠️  Warning: Table creation ${i + 1} failed:`, error.message);
            }
        }

        // Insert default data
        console.log('📝 Inserting default data...');

        // Default settings
        const settings = [
            ['site_name', 'Modern Digital Agency', 'string', 'Website name'],
            ['site_description', 'Transforming ideas into digital reality', 'string', 'Website description'],
            ['contact_email', 'info@mda.com', 'string', 'Primary contact email'],
            ['contact_phone', '+1 (555) 123-4567', 'string', 'Primary contact phone'],
            ['contact_address', '123 Digital Street, Tech City, TC 12345', 'string', 'Office address'],
            ['social_facebook', 'https://facebook.com/mda', 'string', 'Facebook URL'],
            ['social_twitter', 'https://twitter.com/mda', 'string', 'Twitter URL'],
            ['social_linkedin', 'https://linkedin.com/company/mda', 'string', 'LinkedIn URL'],
            ['social_instagram', 'https://instagram.com/mda', 'string', 'Instagram URL'],
            ['maintenance_mode', 'false', 'boolean', 'Maintenance mode status'],
            ['default_currency', 'USD', 'string', 'Default currency'],
            ['timezone', 'UTC', 'string', 'Default timezone']
        ];

        for (const setting of settings) {
            await executeQuery(
                'INSERT IGNORE INTO settings (setting_key, setting_value, setting_type, description) VALUES (?, ?, ?, ?)',
                setting
            );
        }

        // Default admin user
        await executeQuery(
            'INSERT IGNORE INTO users (username, email, password, first_name, last_name, role, is_active, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            ['admin', 'admin@mda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', true, true]
        );

        // Default services
        const services = [
            ['Custom Website Development', 'custom-website', 'Professional websites tailored to your business needs with modern design and functionality.', 'Custom websites built with modern technologies', 'fas fa-code', 2999.00, 'fixed', '2-3 weeks', '["Responsive Design", "SEO Optimized", "Content Management", "24/7 Support"]', true, true, 1],
            ['E-commerce Platform', 'ecommerce-platform', 'Complete online store solutions with payment processing and inventory management.', 'Complete online store solutions', 'fas fa-shopping-cart', 4999.00, 'fixed', '4-6 weeks', '["Payment Integration", "Inventory Management", "Order Processing", "Analytics Dashboard"]', true, true, 2],
            ['Mobile App Development', 'mobile-app-development', 'Native and cross-platform mobile applications for iOS and Android.', 'Native and cross-platform mobile apps', 'fas fa-mobile-alt', 5999.00, 'fixed', '6-8 weeks', '["iOS & Android", "Cross-platform", "App Store Submission", "Push Notifications"]', true, true, 3],
            ['UI/UX Design', 'ui-ux-design', 'Beautiful and intuitive user interfaces that enhance user experience.', 'Beautiful and intuitive user interfaces', 'fas fa-paint-brush', 1999.00, 'fixed', '2-4 weeks', '["Wireframing", "Prototyping", "User Testing", "Design System"]', true, false, 4],
            ['Digital Marketing', 'digital-marketing', 'Comprehensive digital marketing strategies to grow your online presence.', 'Grow your online presence', 'fas fa-chart-line', 1499.00, 'monthly', 'Ongoing', '["SEO", "Social Media", "Content Marketing", "Analytics"]', true, false, 5]
        ];

        for (const service of services) {
            await executeQuery(
                'INSERT IGNORE INTO services (name, slug, description, short_description, icon, price, price_type, duration, features, is_active, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                service
            );
        }

        console.log('✅ Database tables created and default data inserted successfully!');
        console.log('📊 Setup Summary:');
        console.log('- Database: ' + process.env.DB_NAME);
        console.log('- Host: ' + process.env.DB_HOST);
        console.log('- Default admin user: admin@mda.com (password: admin123)');
        console.log('- 5 default services created');
        console.log('- Default settings configured');

    } catch (error) {
        console.error('❌ Database table creation failed:', error);
        process.exit(1);
    }
};

// Run table creation if this file is executed directly
if (require.main === module) {
    createTables();
}

module.exports = createTables; 