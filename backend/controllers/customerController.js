const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const fields = ['name', 'phone', 'email'];
const pick = (body) =>
  Object.fromEntries(
    fields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, typeof body[field] === 'string' ? body[field].trim() : body[field]]),
  );
const getCustomers = async (_req, res, next) => {
  try {
    const customers = await Customer.aggregate([
      { $lookup: { from: 'orders', localField: '_id', foreignField: 'customer', as: 'orders' } },
      {
        $addFields: {
          orderCount: { $size: '$orders' },
          totalSpent: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$orders',
                    as: 'order',
                    cond: { $eq: ['$$order.status', 'paid'] },
                  },
                },
                as: 'paid',
                in: '$$paid.totalAmount',
              },
            },
          },
          firstOrder: { $min: '$orders.createdAt' },
          lastOrder: { $max: '$orders.createdAt' },
        },
      },
      { $project: { orders: 0 } },
      { $sort: { createdAt: -1 } },
    ]);
    return res.json(customers);
  } catch (error) {
    return next(error);
  }
};
const getCustomer = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: 'Invalid customer' });
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const orders = await Order.find({ customer: customer._id })
      .sort({ createdAt: -1 })
      .populate('table', 'number');
    return res.json({ customer, orders });
  } catch (error) {
    return next(error);
  }
};
const createCustomer = async (req, res, next) => {
  try {
    return res.status(201).json(await Customer.create(pick(req.body)));
  } catch (error) {
    return next(error);
  }
};
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    return res.json(customer);
  } catch (error) {
    return next(error);
  }
};
const deleteCustomer = async (req, res, next) => {
  try {
    if (await Order.exists({ customer: req.params.id }))
      return res
        .status(409)
        .json({ message: 'Customer cannot be deleted while order history exists' });
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    return res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
