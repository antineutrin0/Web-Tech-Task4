const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('../db/db');

class UserModel {
  static async findByEmail(email) {
    const pool = await connectDB();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const pool = await connectDB();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ firstname, lastname, email, password, role }) {
    const pool = await connectDB();
    const [result] = await pool.query(
      'INSERT INTO users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [firstname, lastname, email, password, role]
    );
    return { id: result.insertId, firstname, lastname, email, role };
  }

  static async deleteById(id) {
    const pool = await connectDB();
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }

  // utils
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  static async generateAuthToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

module.exports = UserModel;
