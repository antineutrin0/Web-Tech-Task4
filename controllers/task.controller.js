const TaskModel = require('../models/task.model');
const { validationResult } = require('express-validator');

// Create a new task
const createTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, dueDate, assignedTo } = req.body;

        const task = await TaskModel.create({
            title,
            description,
            dueDate,
            assignedTo,
            createdBy: req.user._id // logged-in user
        });

        res.status(201).json({ message: "Task created", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all tasks created by or assigned to the user
const getTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find({
            $or: [
                { createdBy: req.user._id },
                { assignedTo: req.user._id }
            ]
        }).populate('assignedTo', 'fullname email')
          .populate('createdBy', 'fullname email');

        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update task (only by creator or assigned user)
const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await TaskModel.findById(taskId);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (!task.createdBy.equals(req.user._id) && !task.assignedTo?.equals(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        const { title, description, status, dueDate, assignedTo } = req.body;

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;
        if (dueDate) task.dueDate = dueDate;
        if (assignedTo) task.assignedTo = assignedTo;

        await task.save();
        res.status(200).json({ message: "Task updated", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete task (only creator can delete)
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await TaskModel.findById(taskId);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (!task.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to delete this task" });
        }

        await TaskModel.findByIdAndDelete(taskId);
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
