import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

function UserBookings() {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      console.log('Fetching user bookings');
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bookings/user`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        console.log('Bookings fetched:', res.data);
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        alert('Error fetching bookings: ' + (err.response?.data?.msg || 'Server error'));
      }
    };
    if (user) fetchBookings();
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      const handleBookingUpdate = (booking) => {
        console.log('Received bookingUpdate:', booking);
        if (booking.user._id === user.id) {
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

  if (!user) return <p className="text-center mt-8">Please log in to view your bookings.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Service</th>
                <th className="p-2">Provider</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className="border-t">
                  <td className="p-2">{booking.service?.name || 'N/A'}</td>
                  <td className="p-2">{booking.provider?.name || 'N/A'}</td>
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

export default UserBookings;
