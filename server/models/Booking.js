// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   serviceCategory: { type: String, required: true },
//   serviceProviderName: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   address: { type: String, required: true },
//   date: { type: Date, required: true },
//   time: { type: String, required: true },
//   status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
// });

// module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
});

module.exports = mongoose.model('Booking', bookingSchema);