const express = require('express');
const { getReport } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(protect, adminOnly);
router.get('/', getReport);
module.exports = router;
