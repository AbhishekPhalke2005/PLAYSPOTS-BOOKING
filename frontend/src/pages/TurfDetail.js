import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { turfAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Clock, Star, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const TurfDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    sport: '',
    date: '',
    startTime: '',
    endTime: '',
    numberOfPlayers: 10,
    notes: ''
  });
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchTurfDetails();
  }, [id]);

  const fetchTurfDetails = async () => {
    try {
      const { data } = await turfAPI.getById(id);
      setTurf(data.data);
      if (data.data.sports.length > 0) {
        setBookingData({ ...bookingData, sport: data.data.sports[0] });
      }
    } catch (error) {
      toast.error('Failed to load turf details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    try {
      const payload = {
        turfId: turf._id,
        sport: bookingData.sport,
        dateTime: {
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime
        },
        numberOfPlayers: parseInt(bookingData.numberOfPlayers),
        notes: bookingData.notes
      };

      await bookingAPI.create(payload);
      toast.success('Booking request sent to turf owner via WhatsApp!');
      setShowBookingForm(false);
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Turf not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{turf.name}</h1>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">{turf.location.area}</p>
              <p className="text-sm">{turf.location.address}</p>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <Phone className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">{turf.contactInfo.phone}</p>
              <p className="text-sm text-primary-600">WhatsApp: {turf.contactInfo.whatsapp}</p>
            </div>
          </div>
        </div>

        {turf.description && (
          <p className="text-gray-700 mb-4">{turf.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {turf.sports.map(sport => (
            <span key={sport} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
              {sport}
            </span>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Weekday Price</p>
            <p className="text-2xl font-bold text-primary-600">₹{turf.pricing.weekday}/hour</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Weekend Price</p>
            <p className="text-2xl font-bold text-primary-600">₹{turf.pricing.weekend}/hour</p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      {turf.amenities && turf.amenities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {turf.amenities.map(amenity => (
              <div key={amenity} className="flex items-center">
                <span className="text-primary-600 mr-2">✓</span>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {!showBookingForm ? (
          <button
            onClick={() => setShowBookingForm(true)}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
          >
            Book This Turf
          </button>
        ) : (
          <form onSubmit={handleBooking} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Book Your Slot</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sport
                </label>
                <select
                  value={bookingData.sport}
                  onChange={(e) => setBookingData({ ...bookingData, sport: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  {turf.sports.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Players
                </label>
                <input
                  type="number"
                  min="1"
                  value={bookingData.numberOfPlayers}
                  onChange={(e) => setBookingData({ ...bookingData, numberOfPlayers: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                placeholder="Any special requests..."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                📱 Your booking request will be sent to the turf owner via WhatsApp. 
                They will confirm or reject within a few hours.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
              >
                Send Booking Request
              </button>
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TurfDetail;
