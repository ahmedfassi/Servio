const MenuItem = require('../models/MenuItem');

const allowedFields = ['name', 'description', 'price', 'category', 'image', 'available'];
const pickFields = (body) => Object.fromEntries(
  allowedFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]])
);

const getMenuItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const getMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    return res.json(item);
  } catch (error) {
    return next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(pickFields(req.body));
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, pickFields(req.body), {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    return res.json(item);
  } catch (error) {
    return next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    return res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem };
