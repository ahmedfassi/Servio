const mongoose = require('mongoose');
const User = require('../models/User');
const httpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : email);
const getStaff = async (_req, res, next) => {
  try {
    return res.json(await User.find({ role: 'staff' }).sort({ createdAt: -1 }));
  } catch (error) {
    return next(error);
  }
};
const getStaffMember = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'staff' });
    if (!user) return res.status(404).json({ message: 'Staff member not found' });
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};
const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, active } = req.body;
    if (!name || !email || !password) throw httpError('Name, email, and password are required');
    if (password.length < 6) throw httpError('Password must be at least 6 characters');
    const normalizedEmail = normalizeEmail(email);
    if (await User.exists({ email: normalizedEmail })) throw httpError('Email already exists', 409);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      active,
      role: 'staff',
    });
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
};
const updateStaff = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) throw httpError('Invalid staff member');
    const user = await User.findOne({ _id: req.params.id, role: 'staff' });
    if (!user) return res.status(404).json({ message: 'Staff member not found' });
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = normalizeEmail(req.body.email);
    if (req.body.active !== undefined) user.active = req.body.active;
    if (req.body.password) {
      if (req.body.password.length < 6) throw httpError('Password must be at least 6 characters');
      user.password = req.body.password;
    }
    await user.save();
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};
const deleteStaff = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: 'staff' });
    if (!user) return res.status(404).json({ message: 'Staff member not found' });
    return res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
module.exports = { getStaff, getStaffMember, createStaff, updateStaff, deleteStaff };
