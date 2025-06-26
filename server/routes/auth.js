const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Service = require('../models/Service');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, phone, role, serviceName, serviceCategory } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      role,
      ...(role === 'provider' && { serviceName, serviceCategory }),
    });
    await user.save();

    if (role === 'provider') {
      const service = new Service({
        name: serviceName,
        description: `Service provided by ${name}`,
        price: 0,
        category: serviceCategory,
        provider: user._id,
      });
      await service.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        serviceName: user.serviceName,
        serviceCategory: user.serviceCategory,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        serviceName: user.serviceName,
        serviceCategory: user.serviceCategory,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

router.get('/validate-token', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('name email phone role serviceName serviceCategory');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        serviceName: user.serviceName,
        serviceCategory: user.serviceCategory,
      },
    });
  } catch (err) {
    console.error('Token validation error:', err);
    res.status(401).json({ msg: 'Invalid token' });
  }
});

module.exports = router;