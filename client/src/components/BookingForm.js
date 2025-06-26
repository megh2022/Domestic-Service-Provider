import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FilterContext } from '../context/FilterContext';
import { useNavigate, useLocation } from 'react-router-dom';

function BookingForm() {
  const { user } = useContext(AuthContext);
  const { categoryFilter } = useContext(FilterContext);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialCategory = query.get('category') || categoryFilter || '';
  const initialProviderId = query.get('providerId') || '';

  const [formData, setFormData] = useState({
    serviceCategory: initialCategory,
    providerId: initialProviderId,
    serviceId: '',
    date: '',
    time: '',
  });
  const [categories] = useState(['Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Other']);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (formData.serviceCategory) {
      const fetchProviders = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/services/providers?category=${formData.serviceCategory}`
          );
          setProviders(res.data);
          if (!res.data.find(p => p._id === formData.providerId)) {
            setFormData(prev => ({ ...prev, providerId: '', serviceId: '' }));
          }
          setServices([]);
        } catch (err) {
          alert('Error fetching providers: ' + (err.response?.data?.msg || 'Server error'));
          console.error('Fetch providers error:', err);
        }
      };
      fetchProviders();
    }
  }, [formData.serviceCategory]);

  useEffect(() => {
    if (formData.providerId) {
      const fetchServices = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/services?providerId=${formData.providerId}&category=${formData.serviceCategory}`
          );
          setServices(res.data);
          setFormData(prev => ({ ...prev, serviceId: res.data.length > 0 ? res.data[0]._id : '' }));
        } catch (err) {
          alert('Error fetching services: ' + (err.response?.data?.msg || 'Server error'));
          console.error('Fetch services error:', err);
        }
      };
      fetchServices();
    }
  }, [formData.providerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to book a service');
      navigate('/login');
      return;
    }
    if (!formData.serviceId) return alert('Please select a service');
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookings`,
        {
          serviceId: formData.serviceId,
          providerId: formData.providerId,
          date: formData.date,
          time: formData.time,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Booking successful!');
      navigate('/my-bookings');
    } catch (err) {
      alert('Error booking service: ' + (err.response?.data?.msg || 'Server error'));
      console.error('Booking error:', err);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book a Service</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Service Category</label>
          <select
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        {formData.serviceCategory && (
          <div className="mb-4">
            <label className="block text-gray-700">Service Provider</label>
            <select
              name="providerId"
              value={formData.providerId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a provider</option>
              {providers.map(provider => (
                <option key={provider._id} value={provider._id}>{provider.name}</option>
              ))}
            </select>
          </div>
        )}
        {formData.providerId && (
          <div className="mb-4">
            <label className="block text-gray-700">Service</label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service._id} value={service._id}>{service.name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Book Now
        </button>
      </form>
    </div>
  );
}

export default BookingForm;