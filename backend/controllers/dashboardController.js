const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Table = require('../models/Table');
const User = require('../models/User');

const getStats = async (req, res, next) => {
  try {
    const [menuItems, tables, orders, pendingOrders, completedOrders, users, revenueResult] =
      await Promise.all([
        MenuItem.countDocuments(),
        Table.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.countDocuments({ status: { $in: ['served', 'paid'] } }),
        User.countDocuments(),
        Order.aggregate([
          { $match: { status: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
      ]);

    res.json({
      menuItems,
      tables,
      orders,
      pendingOrders,
      completedOrders,
      users,
      revenue: revenueResult[0]?.total || 0,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentOrders = async (req, res, next) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 20) : 5;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('table', 'number capacity status')
      .populate('items.menuItem', 'name price category available');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getTopItems = async (_req, res, next) => {
  try {
    const items = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', orders: { $sum: '$items.quantity' } } },
      { $sort: { orders: -1, _id: 1 } },
      { $limit: 4 },
      { $project: { _id: 0, name: '$_id', orders: 1 } },
    ]);
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getStats, getRecentOrders, getTopItems };
