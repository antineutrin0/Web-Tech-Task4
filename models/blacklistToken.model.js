const connectDB = require('../db/db');

class BlacklistTokenModel {
  static async create(token) {
    const pool = await connectDB();
    const [result] = await pool.query(
      'INSERT INTO blacklist_tokens (token) VALUES (?)',
      [token]
    );
    return { id: result.insertId, token };
  }

  static async findOne(token) {
    const pool = await connectDB();
    const [rows] = await pool.query(
      `SELECT * 
       FROM blacklist_tokens 
       WHERE token = ? 
       AND createdAt > (NOW() - INTERVAL 1 DAY)`,
      [token]
    );
    return rows[0];
  }

  static async deleteExpired() {
    const pool = await connectDB();
    await pool.query(
      'DELETE FROM blacklist_tokens WHERE createdAt < (NOW() - INTERVAL 1 DAY)'
    );
  }
}

module.exports = BlacklistTokenModel;
