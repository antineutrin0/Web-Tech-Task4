const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authUser } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/auth.middleware');
const { registerUser, deleteUser } = require('../controllers/user.controller');

// Admin creates a new user
router.post(
    '/create-user',
    authUser,
    authorizeRole('admin'),
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('fullname.firstname').isLength({ min: 3 }).withMessage('Firstname must be at least 3 characters'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
    ],
    registerUser
);

// Admin deletes a user
router.delete(
    '/delete-user/:userId',
    authUser,
    authorizeRole('admin'),
    deleteUser
);



module.exports = router;
