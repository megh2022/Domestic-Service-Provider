const express = require('express');
const authMiddleware = require('../middleware/auth');
const Service = require('../models/Service');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  const { search, category, providerId } = req.query;
  try {
    const query = {};
    if (search) query.name = { $regex: search.trim(), $options: 'i' };
    if (category && category !== 'All Categories') query.category = category;
    if (providerId) query.provider = providerId;
    const services = await Service.find(query).populate('provider', 'name');
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

router.get('/providers', async (req, res) => {
  const { category } = req.query;
  try {
    if (!category) return res.status(400).json({ msg: 'Category is required' });
    const providers = await User.find({ role: 'provider', serviceCategory: category })
      .select('name _id serviceName serviceCategory');
    res.json(providers);
  } catch (err) {
    console.error('Error fetching providers:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name');
    if (!service) return res.status(404).json({ msg: 'Service not found' });
    const similarServices = await Service.find({
      category: service.category,
      _id: { $ne: service._id },
    })
      .populate('provider', 'name')
      .limit(3);
    res.json({ service, similarServices });
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    if (req.user.role !== 'provider') return res.status(403).json({ msg: 'Access denied' });
    if (!name || !description || !price || !category) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    const service = new Service({
      name,
      description,
      price: Number(price),
      category,
      provider: req.user.id,
    });
    await service.save();
    const populatedService = await Service.findById(service._id).populate('provider', 'name');
    res.json(populatedService);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

module.exports = router;