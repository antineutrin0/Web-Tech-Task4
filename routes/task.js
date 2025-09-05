const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authUser } = require('../middlewares/auth.middleware');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/task.controller');


router.post(
    '/',
    authUser,
    [
        body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
        body('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters')
    ],
    createTask
);

router.get('/', authUser, getTasks);

router.put('/:taskId', authUser, updateTask);

router.delete('/:taskId', authUser, deleteTask);

module.exports = router;
