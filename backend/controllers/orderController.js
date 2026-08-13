const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Table = require('../models/Table');
const Customer = require('../models/Customer');

const statuses = ['pending', 'preparing', 'ready', 'served', 'paid', 'cancelled'];
const populateOrder = (query) =>
  query
    .populate('table', 'number capacity status')
    .populate('customer', 'name phone email')
    .populate('items.menuItem', 'name description price category image available');

const httpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureTableExists = async (tableId) => {
  if (!mongoose.isValidObjectId(tableId)) throw httpError('Invalid table');
  const table = await Table.findById(tableId);
  if (!table) throw httpError('Table not found', 404);
  return table;
};

const buildOrderItems = async (requestedItems) => {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw httpError('At least one order item is required');
  }

  for (const item of requestedItems) {
    if (!mongoose.isValidObjectId(item.menuItem))
      throw httpError('Each item must have a valid menuItem');
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw httpError('Each item quantity must be a whole number of at least 1');
    }
  }

  const uniqueIds = [...new Set(requestedItems.map((item) => String(item.menuItem)))];
  const menuItems = await MenuItem.find({ _id: { $in: uniqueIds } });
  const menuById = new Map(menuItems.map((item) => [String(item._id), item]));

  if (menuItems.length !== uniqueIds.length)
    throw httpError('One or more menu items were not found', 404);

  return requestedItems.map((item) => {
    const menuItem = menuById.get(String(item.menuItem));
    if (!menuItem.available) throw httpError(`${menuItem.name} is not currently available`);
    return {
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
    };
  });
};

const calculateTotal = (items) =>
  Number(items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2));
const ensureCustomerExists = async (customerId) => {
  if (customerId === null || customerId === '' || customerId === undefined) return null;
  if (!mongoose.isValidObjectId(customerId)) throw httpError('Invalid customer');
  if (!(await Customer.exists({ _id: customerId }))) throw httpError('Customer not found', 404);
  return customerId;
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await populateOrder(Order.find().sort({ createdAt: -1 }));
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await populateOrder(Order.findById(req.params.id));
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    await ensureTableExists(req.body.table);
    const customer = await ensureCustomerExists(req.body.customer);
    const items = await buildOrderItems(req.body.items);
    const order = await Order.create({
      table: req.body.table,
      customer,
      items,
      totalAmount: calculateTotal(items),
      notes: req.body.notes,
      status: req.body.status,
    });
    await order.populate('table', 'number capacity status');
    await order.populate('customer', 'name phone email');
    await order.populate('items.menuItem', 'name description price category image available');
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.body.table !== undefined) {
      await ensureTableExists(req.body.table);
      order.table = req.body.table;
    }
    if (req.body.customer !== undefined)
      order.customer = await ensureCustomerExists(req.body.customer);
    if (req.body.items !== undefined) {
      order.items = await buildOrderItems(req.body.items);
      order.totalAmount = calculateTotal(order.items);
    }
    if (req.body.notes !== undefined) order.notes = req.body.notes;
    if (req.body.status !== undefined) order.status = req.body.status;

    await order.save();
    await order.populate('table', 'number capacity status');
    await order.populate('customer', 'name phone email');
    await order.populate('items.menuItem', 'name description price category image available');
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    if (!statuses.includes(req.body.status)) {
      return res.status(400).json({ message: `Status must be one of: ${statuses.join(', ')}` });
    }
    const order = await populateOrder(
      Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true },
      ),
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getOrders, getOrder, createOrder, updateOrder, updateOrderStatus, deleteOrder };
