const express = require('express');
const { getStats, getRecentOrders, getTopItems } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/recent-orders', getRecentOrders);
router.get('/top-items', getTopItems);

module.exports = router;
