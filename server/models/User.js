const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  role: { type: String, enum: ['client', 'provider'], default: 'client' },
  serviceName: { type: String, required: function() { return this.role === 'provider'; }, trim: true },
  serviceCategory: { type: String, required: function() { return this.role === 'provider'; }, enum: ['Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Other'] },
});

module.exports = mongoose.model('User', userSchema);