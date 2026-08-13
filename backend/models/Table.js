const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, 'Table number is required'],
      unique: true
    },
    capacity: {
      type: Number,
      required: [true, 'Table capacity is required'],
      min: [1, 'Table capacity must be at least 1']
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Table', tableSchema);
