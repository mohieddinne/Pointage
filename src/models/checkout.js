const mongoose = require('mongoose');

const checkOutSchema = new mongoose.Schema({
  checkInId: { type: mongoose.Schema.Types.ObjectId, ref: 'CheckIn', required: true },
  checkOutTime: { type: Date, default: Date.now },
  comment: { type: String },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },

});

const CheckOut = mongoose.model('CheckOut', checkOutSchema);

module.exports = CheckOut;
