import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'client',
    serviceName: '',
    serviceCategory: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = formData.role === 'client'
        ? { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, role: formData.role }
        : formData;
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, dataToSend);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
      console.error('Registration error:', err.response?.data || err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            minLength="6"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            pattern="[0-9]{10}"
            placeholder="e.g., 1234567890"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="client">Client</option>
            <option value="provider">Service Provider</option>
          </select>
        </div>
        {formData.role === 'provider' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Service Name</label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={formData.role === 'provider'}
                placeholder="e.g., Home Cleaning"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Service Category</label>
              <select
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={formData.role === 'provider'}
              >
                <option value="">Select a category</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        )}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;