const User = require('../models/User');
const RestaurantSettings = require('../models/RestaurantSettings');
const settingsFields = ['businessName', 'phone', 'email', 'address'];
const pick = (body) =>
  Object.fromEntries(
    settingsFields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, typeof body[field] === 'string' ? body[field].trim() : body[field]]),
  );
const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
const getSettings = async (_req, res, next) => {
  try {
    const settings = await RestaurantSettings.findOneAndUpdate(
      { key: 'restaurant' },
      { $setOnInsert: { key: 'restaurant' } },
      { new: true, upsert: true, runValidators: true },
    );
    return res.json(settings);
  } catch (error) {
    return next(error);
  }
};
const updateSettings = async (req, res, next) => {
  try {
    const settings = await RestaurantSettings.findOneAndUpdate(
      { key: 'restaurant' },
      { $set: pick(req.body), $setOnInsert: { key: 'restaurant' } },
      { new: true, upsert: true, runValidators: true },
    );
    return res.json(settings);
  } catch (error) {
    return next(error);
  }
};
const updateAdminProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
    const normalized = email.trim().toLowerCase();
    if (await User.exists({ _id: { $ne: req.user._id }, email: normalized }))
      return res.status(409).json({ message: 'Email already exists' });
    req.user.name = name;
    req.user.email = normalized;
    await req.user.save();
    return res.json({ user: safeUser(req.user) });
  } catch (error) {
    return next(error);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Current and new passwords are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword)))
      return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    return next(error);
  }
};
module.exports = { getSettings, updateSettings, updateAdminProfile, changePassword };
