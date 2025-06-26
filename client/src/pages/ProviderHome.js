import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProviderHome() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bookings/provider`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };
    if (user && user.role === 'provider') {
      fetchBookings();
    }
  }, [user]);

  if (!user || user.role !== 'provider') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Client Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Service Category</th>
                <th className="p-2">Phone Number</th>
                <th className="p-2">Address</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className="border-t">
                  <td className="p-2">{booking.name}</td>
                  <td className="p-2">{booking.email}</td>
                  <td className="p-2">{booking.serviceCategory}</td>
                  <td className="p-2">{booking.phoneNumber}</td>
                  <td className="p-2">{booking.address}</td>
                  <td className="p-2">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="p-2">{booking.time}</td>
                  <td className="p-2">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProviderHome;