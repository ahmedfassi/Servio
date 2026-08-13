const mongoose = require('mongoose');
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'restaurant' },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      default: 'Serv.io',
    },
    phone: { type: String, trim: true, default: '' },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      match: [/^$|^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    address: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);
module.exports = mongoose.model('RestaurantSettings', settingsSchema);
