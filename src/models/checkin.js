const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  checkInTime: { type: Date, default: Date.now },
  comment: { type: String }
});

const CheckIn = mongoose.model('CheckIn', checkInSchema);

module.exports = CheckIn;
