const connectDB = require('../db/db');

class TaskModel {

  static async create({ userId, title, description, status }) {
    const pool = await connectDB();
    const [result] = await pool.query(
      `INSERT INTO tasks (userId, title, description, status)
       VALUES (?, ?, ?, ?)`,
      [userId, title, description, status || 'pending']
    );
    return { id: result.insertId, userId, title, description, status: status || 'pending' };
  }


  static async getTasksByUser(userId) {
    const pool = await connectDB();
    const [rows] = await pool.query(
      `SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );
    return rows;
  }

  static async getAllTasks() {
    const pool = await connectDB();
    const [rows] = await pool.query(`SELECT * FROM tasks ORDER BY createdAt DESC`);
    return rows;
  }

  static async findById(id) {
    const pool = await connectDB();
    const [rows] = await pool.query(`SELECT * FROM tasks WHERE id = ?`, [id]);
    return rows[0];
  }

  static async update(id, { title, description, status }) {
    const pool = await connectDB();
    await pool.query(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, updatedAt = NOW() 
       WHERE id = ?`,
      [title, description, status, id]
    );
    return await this.findById(id);
  }

  static async delete(id) {
    const pool = await connectDB();
    await pool.query(`DELETE FROM tasks WHERE id = ?`, [id]);
    return true;
  }
}

module.exports = TaskModel;
