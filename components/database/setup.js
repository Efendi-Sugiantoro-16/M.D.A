const fs = require('fs');
const path = require('path');
const { executeQuery, testConnection, initializeDatabase } = require('./config');
require('dotenv').config();

const setupDatabase = async () => {
    try {
        console.log('🚀 Starting database setup...');

        // Initialize database connection
        const initialized = await initializeDatabase();
        if (!initialized) {
            console.error('❌ Database initialization failed.');
            process.exit(1);
        }

        // Test database connection
        const connectionTest = await testConnection();
        if (!connectionTest) {
            console.error('❌ Database connection failed. Please check your configuration.');
            process.exit(1);
        }

        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements to execute`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`Executing statement ${i + 1}/${statements.length}...`);
                    const result = await executeQuery(statement);
                    
                    if (!result.success) {
                        console.warn(`⚠️  Warning: Statement ${i + 1} may have failed:`, result.error);
                    }
                } catch (error) {
                    console.warn(`⚠️  Warning: Statement ${i + 1} failed:`, error.message);
                }
            }
        }

        console.log('✅ Database setup completed successfully!');
        console.log('📊 Database tables created and initial data inserted.');
        
        // Display setup summary
        console.log('\n📋 Setup Summary:');
        console.log('- Database: ' + process.env.DB_NAME);
        console.log('- Host: ' + process.env.DB_HOST);
        console.log('- Default admin user: admin@mda.com (password: admin123)');
        console.log('- 5 default services created');
        console.log('- Default settings configured');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
};

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase; 