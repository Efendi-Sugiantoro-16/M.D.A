const setupDatabase = require('./setup');

console.log('🚀 Starting database migration...');
setupDatabase()
    .then(() => {
        console.log('✅ Database migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Database migration failed:', error);
        process.exit(1);
    }); 