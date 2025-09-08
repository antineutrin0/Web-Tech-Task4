const UserModel = require('../models/User.model');
const { validationResult } = require('express-validator');

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullname, email, password, role } = req.body;
    const { firstname, lastname } = fullname;

    const isUserExist = await UserModel.findByEmail(email);
    if (isUserExist) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await UserModel.hashPassword(password);
    const user = await UserModel.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    const token = await UserModel.generateAuthToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) return res.status(404).json({ message: "Invalid credentials" });

    const token = await UserModel.generateAuthToken(user);
    res.cookie('token', token);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

const logoutUser = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logged out successfully" });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  await UserModel.deleteById(userId);
  res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  deleteUser
};
