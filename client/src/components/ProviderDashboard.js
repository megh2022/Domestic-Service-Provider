import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';

function ProviderDashboard() {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    const fetchBookings = async () => {
      console.log('Fetching provider bookings');
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bookings/provider`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        console.log('Bookings fetched:', res.data);
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        alert('Error fetching bookings: ' + (err.response?.data?.msg || 'Server error'));
      }
    };
    const fetchServices = async () => {
      console.log('Fetching provider services');
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/services?providerId=${localStorage.getItem('userId')}`
        );
        console.log('Services fetched:', res.data);
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
        alert('Error fetching services: ' + (err.response?.data?.msg || 'Server error'));
      }
    };
    if (user) {
      fetchBookings();
      fetchServices();
    }
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      const handleBookingUpdate = (booking) => {
        console.log('Received bookingUpdate:', booking);
        if (booking.provider._id === user.id) {
          setBookings((prev) => {
            const index = prev.findIndex((b) => b._id === booking._id);
            if (index >= 0) {
              return [...prev.slice(0, index), booking, ...prev.slice(index + 1)];
            }
            return [booking, ...prev];
          });
        }
      };
      socket.on('bookingUpdate', handleBookingUpdate);
      return () => {
        console.log('Cleaning up bookingUpdate listener');
        socket.off('bookingUpdate', handleBookingUpdate);
      };
    }
  }, [socket, user]);

  const handleServiceChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/services`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setServices([...services, res.data]);
      setFormData({ name: '', description: '', price: '', category: '' });
      alert('Service added successfully!');
    } catch (err) {
      alert('Error adding service: ' + (err.response?.data?.msg || 'Server error'));
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setBookings(bookings.map(b => b._id === bookingId ? res.data : b));
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.msg || 'Server error'));
    }
  };

  if (!user) return <p className="text-center mt-8">Please log in to view your dashboard.</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Provider Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Service</h3>
        <form onSubmit={handleServiceSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Service Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleServiceChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleServiceChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleServiceChange}
              className="w-full p-2 border rounded"
              required
              min="0"
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleServiceChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
            Add Service
          </button>
        </form>
      </div>
      <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Service</th>
                <th className="p-2">Client</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className="border-t">
                  <td className="p-2">{booking.service?.name || 'N/A'}</td>
                  <td className="p-2">{booking.user?.name || 'N/A'}</td>
                  <td className="p-2">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="p-2">{booking.time}</td>
                  <td className="p-2">{booking.status}</td>
                  <td className="p-2">
                    {booking.status === 'Pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateStatus(booking._id, 'Confirmed')}
                          className="bg-green-500 text-white p-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(booking._id, 'Cancelled')}
                          className="bg-red-500 text-white p-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>{booking.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-4">Your Services</h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                {/* <th className="p-2">Price</th> */}
                <th className="p-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service._id} className="border-t">
                  <td className="p-2">{service.name}</td>
                  <td className="p-2">{service.description}</td>
                  {/* <td className="p-2">${service.price}</td> */}
                  <td className="p-2">{service.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;