const mysql = require('mysql2/promise');

const connectDB = async () => {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'web_tech_4',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('Connected to MariaDB/MySQL');
    return pool;
  } catch (err) {
    console.error('DB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
