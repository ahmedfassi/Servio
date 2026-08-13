const express = require('express');
const {
  getStaff,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(protect, adminOnly);
router.get('/', getStaff);
router.get('/:id', getStaffMember);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);
module.exports = router;
