const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const buildMatch = (query) => {
  const createdAt = {};
  if (query.from) {
    const from = new Date(query.from);
    if (Number.isNaN(from.getTime())) {
      const error = new Error('Invalid from date');
      error.statusCode = 400;
      throw error;
    }
    createdAt.$gte = from;
  }
  if (query.to) {
    const to = new Date(query.to);
    if (Number.isNaN(to.getTime())) {
      const error = new Error('Invalid to date');
      error.statusCode = 400;
      throw error;
    }
    createdAt.$lte = to;
  }
  return Object.keys(createdAt).length ? { createdAt } : {};
};
const getReport = async (req, res, next) => {
  try {
    const match = buildMatch(req.query);
    const [summaryRows, statuses, daily, itemRows, tables, categories, menuItems] =
      await Promise.all([
        Order.aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              completedOrders: {
                $sum: { $cond: [{ $in: ['$status', ['served', 'paid']] }, 1, 0] },
              },
              pendingOrders: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
              revenue: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$totalAmount', 0] } },
              averageOrderValue: { $avg: '$totalAmount' },
            },
          },
        ]),
        Order.aggregate([
          { $match: match },
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Order.aggregate([
          { $match: match },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              orders: { $sum: 1 },
              revenue: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$totalAmount', 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Order.aggregate([
          { $match: match },
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.menuItem',
              name: { $first: '$items.name' },
              quantity: { $sum: '$items.quantity' },
              sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            },
          },
          { $sort: { quantity: -1 } },
        ]),
        Order.aggregate([
          { $match: match },
          {
            $group: {
              _id: '$table',
              orders: { $sum: 1 },
              revenue: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$totalAmount', 0] } },
            },
          },
          { $sort: { orders: -1 } },
          { $limit: 8 },
          { $lookup: { from: 'tables', localField: '_id', foreignField: '_id', as: 'table' } },
          { $unwind: { path: '$table', preserveNullAndEmptyArrays: true } },
          { $project: { _id: 0, tableId: '$_id', number: '$table.number', orders: 1, revenue: 1 } },
        ]),
        Order.aggregate([
          { $match: match },
          { $unwind: '$items' },
          {
            $lookup: {
              from: 'menuitems',
              localField: 'items.menuItem',
              foreignField: '_id',
              as: 'menu',
            },
          },
          { $unwind: { path: '$menu', preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: { $ifNull: ['$menu.category', 'Uncategorized'] },
              quantity: { $sum: '$items.quantity' },
              sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            },
          },
          { $sort: { quantity: -1 } },
        ]),
        MenuItem.find().select('_id name category').lean(),
      ]);
    const byId = new Map(itemRows.map((item) => [String(item._id), item]));
    const items = menuItems
      .map(
        (item) =>
          byId.get(String(item._id)) || { _id: item._id, name: item.name, quantity: 0, sales: 0 },
      )
      .sort((a, b) => b.quantity - a.quantity);
    const summary = summaryRows[0] || {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      revenue: 0,
      averageOrderValue: 0,
    };
    return res.json({
      summary,
      statuses: statuses.map((row) => ({ status: row._id, count: row.count })),
      daily: daily.map((row) => ({ date: row._id, orders: row.orders, revenue: row.revenue })),
      items,
      tables,
      categories: categories.map((row) => ({
        category: row._id,
        quantity: row.quantity,
        sales: row.sales,
      })),
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = { getReport };
