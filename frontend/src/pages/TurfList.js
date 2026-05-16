import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { turfAPI } from '../services/api';
import { MapPin, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const TurfList = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    area: '',
    sport: ''
  });

  const areas = ['Chinchwad', 'Wakad', 'Pimpri', 'Akurdi', 'Nigdi', 'Bhosari'];
  const sports = ['Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis'];

  useEffect(() => {
    fetchTurfs();
  }, [filters]);

  const fetchTurfs = async () => {
    try {
      const params = {};
      if (filters.area) params.area = filters.area;
      if (filters.sport) params.sport = filters.sport;
      params.isActive = true;

      const { data } = await turfAPI.getAll(params);
      setTurfs(data.data);
    } catch (error) {
      toast.error('Failed to load turfs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Turfs in PCMC</h1>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Filter by Area
              </label>
              <select
                value={filters.area}
                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Areas</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Sport
              </label>
              <select
                value={filters.sport}
                onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Sports</option>
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ area: '', sport: '' })}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Turfs Grid */}
      {turfs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No turfs found. Try different filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map(turf => (
            <Link
              key={turf._id}
              to={`/turfs/${turf._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
  <img
    src={
      turf.image ||
      "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800"
    }
    alt={turf.name}
    className="w-full h-full object-cover hover:scale-105 transition duration-300"
  />
</div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{turf.name}</h3>
                <p className="text-green-600 font-bold mb-2">
  ₹{turf.price || 800}/hour
</p>

<p className="text-yellow-500 mb-3">
  ⭐ {turf.rating || 4.5}
</p>

<button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
  Book Now
</button>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{turf.location.area}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {turf.sports.map(sport => (
                    <span
                      key={sport}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                    >
                      {sport}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-lg font-bold text-primary-600">
                      ₹{turf.pricing.weekday}/hr
                    </p>
                  </div>
                  {turf.rating.count > 0 && (
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-semibold">{turf.rating.average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TurfList;
