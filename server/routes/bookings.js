const express = require('express');
const authMiddleware = require('../middleware/auth');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { serviceId, providerId, date, time } = req.body;
  try {
    if (req.user.role !== 'client') return res.status(403).json({ msg: 'Access denied' });
    if (!serviceId || !providerId || !date || !time) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ msg: 'Service not found' });
    if (service.provider.toString() !== providerId) {
      return res.status(400).json({ msg: 'Invalid provider for this service' });
    }
    const booking = new Booking({
      user: req.user.id,
      service: serviceId,
      provider: providerId,
      date: new Date(date),
      time,
      status: 'Pending',
    });
    await booking.save();
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name')
      .populate('service', 'name')
      .populate('provider', 'name');
    
    console.log(`Emitting bookingUpdate to user ${req.user.id} and provider ${providerId}`);
    req.io.to(req.user.id).emit('bookingUpdate', populatedBooking);
    req.io.to(providerId).emit('bookingUpdate', populatedBooking);
    
    res.json(populatedBooking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

router.get('/provider', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'provider') return res.status(403).json({ msg: 'Access denied' });
    const bookings = await Booking.find({ provider: req.user.id })
      .populate('user', 'name')
      .populate('service', 'name');
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching provider bookings:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

router.get('/user', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ msg: 'Access denied' });
    const bookings = await Booking.find({ user: req.user.id })
      .populate('service', 'name')
      .populate('provider', 'name');
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    if (req.user.role !== 'provider') return res.status(403).json({ msg: 'Access denied' });
    if (!['Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    if (booking.provider.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    booking.status = status;
    await booking.save();
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name')
      .populate('service', 'name')
      .populate('provider', 'name');
    
    console.log(`Emitting bookingUpdate to user ${booking.user.toString()} and provider ${req.user.id}`);
    req.io.to(booking.user.toString()).emit('bookingUpdate', populatedBooking);
    req.io.to(req.user.id).emit('bookingUpdate', populatedBooking);
    
    res.json(populatedBooking);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

module.exports = router;