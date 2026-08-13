const express = require('express');
const {
  getSettings,
  updateSettings,
  updateAdminProfile,
  changePassword,
} = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(protect, adminOnly);
router.get('/', getSettings);
router.put('/', updateSettings);
router.put('/admin-profile', updateAdminProfile);
router.put('/password', changePassword);
module.exports = router;
