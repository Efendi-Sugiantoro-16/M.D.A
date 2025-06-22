const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration without database name for initial connection
const initialDbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Database configuration with database name
const dbConfig = {
    ...initialDbConfig,
    database: process.env.DB_NAME || 'mda_database'
};

// Create initial connection pool (without database)
let initialPool = null;

// Create connection pool
let pool = null;

// Initialize database connection
const initializeDatabase = async () => {
    try {
        // First, connect without database to create it if it doesn't exist
        initialPool = mysql.createPool(initialDbConfig);
        
        // Create database if it doesn't exist
        await initialPool.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'mda_database'}`);
        console.log(`✅ Database '${process.env.DB_NAME || 'mda_database'}' is ready`);
        
        // Close initial connection
        await initialPool.end();
        
        // Create main connection pool with database
        pool = mysql.createPool(dbConfig);
        
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        return false;
    }
};

// Test database connection
const testConnection = async () => {
    try {
        if (!pool) {
            const initialized = await initializeDatabase();
            if (!initialized) return false;
        }
        
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
    try {
        if (!pool) {
            const initialized = await initializeDatabase();
            if (!initialized) {
                return { success: false, error: 'Database not initialized' };
            }
        }
        
        const [rows] = await pool.execute(query, params);
        return { success: true, data: rows };
    } catch (error) {
        console.error('Database query error:', error);
        return { success: false, error: error.message };
    }
};

// Execute transaction
const executeTransaction = async (queries) => {
    if (!pool) {
        const initialized = await initializeDatabase();
        if (!initialized) {
            return { success: false, error: 'Database not initialized' };
        }
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const results = [];
        for (const query of queries) {
            const [rows] = await connection.execute(query.sql, query.params || []);
            results.push(rows);
        }
        
        await connection.commit();
        return { success: true, data: results };
    } catch (error) {
        await connection.rollback();
        console.error('Transaction error:', error);
        return { success: false, error: error.message };
    } finally {
        connection.release();
    }
};

// Close database connection
const closeConnection = async () => {
    try {
        if (pool) {
            await pool.end();
            console.log('Database connection closed');
        }
        if (initialPool) {
            await initialPool.end();
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
};

module.exports = {
    pool: () => pool,
    testConnection,
    executeQuery,
    executeTransaction,
    closeConnection,
    dbConfig,
    initializeDatabase
}; 