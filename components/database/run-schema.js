const fs = require('fs');
const path = require('path');
const { executeQuery, initializeDatabase } = require('./config');
require('dotenv').config();

const runSchema = async () => {
    try {
        console.log('🚀 Running database schema...');

        // Initialize database connection
        const initialized = await initializeDatabase();
        if (!initialized) {
            console.error('❌ Database initialization failed.');
            process.exit(1);
        }

        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*') && !stmt.startsWith('*/'));

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
                    } else {
                        console.log(`✅ Statement ${i + 1} executed successfully`);
                    }
                } catch (error) {
                    console.warn(`⚠️  Warning: Statement ${i + 1} failed:`, error.message);
                }
            }
        }

        console.log('✅ Database schema executed successfully!');

    } catch (error) {
        console.error('❌ Database schema execution failed:', error);
        process.exit(1);
    }
};

// Run schema if this file is executed directly
if (require.main === module) {
    runSchema();
}

module.exports = runSchema; 