const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');

const authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized user" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized user" });
  }
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized: No user found" });
    if (req.user.role !== role) return res.status(403).json({ message: `Forbidden: Requires ${role} role` });
    next();
  };
};

module.exports = {
  authUser,
  authorizeRole
};
