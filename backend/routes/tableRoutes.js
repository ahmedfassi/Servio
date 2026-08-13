const express = require('express');
const {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable
} = require('../controllers/tableController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getTables);
router.get('/:id', getTable);
router.post('/', protect, adminOnly, createTable);
router.put('/:id', protect, adminOnly, updateTable);
router.delete('/:id', protect, adminOnly, deleteTable);

module.exports = router;
