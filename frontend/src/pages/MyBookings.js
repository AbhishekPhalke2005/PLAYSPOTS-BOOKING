import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getMyBookings();
      setBookings(data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{booking.turf.name}</h3>
                  <p className="text-gray-600">Booking ID: {booking.bookingId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 text-gray-700">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(booking.dateTime.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{booking.dateTime.startTime} - {booking.dateTime.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-primary-600">₹{booking.pricing.amount}</p>
                </div>
              </div>

              {booking.status === 'pending' && (
                <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⏳ Waiting for turf owner confirmation via WhatsApp
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
