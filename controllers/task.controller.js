const TaskModel = require('../models/task.model');
const { validationResult } = require('express-validator');

// Create a new task
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status } = req.body;

    const task = await TaskModel.create({
      userId: req.user.id,  // creator is the logged-in user
      title,
      description,
      status
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks for logged-in user (admin can see all)
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await TaskModel.getAllTasks();
    } else {
      tasks = await TaskModel.getTasksByUser(req.user.id);
    }

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task (creator can update own, admin can update any)
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await TaskModel.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // only creator or admin
    if (task.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    const { title, description, status } = req.body;
    const updatedTask = await TaskModel.update(taskId, { title, description, status });

    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete task (creator or admin)
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await TaskModel.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await TaskModel.delete(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
