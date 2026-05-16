import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    area: '',
    sport: '',
    status: 'open'
  });

  const areas = ['Chinchwad', 'Wakad', 'Pimpri', 'Akurdi', 'Nigdi', 'Bhosari'];
  const sports = ['Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis'];

  useEffect(() => {
    fetchMatches();
  }, [filters]);

  const fetchMatches = async () => {
    try {
      const params = {
        ...filters,
        date: 'upcoming'
      };
      const { data } = await matchAPI.getAll(params);
      setMatches(data.data);
    } catch (error) {
      toast.error('Failed to load matches');
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find Players</h1>
          <p className="text-gray-600">Join nearby matches or create your own</p>
        </div>
        <Link
          to="/create-match"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
        >
          + Create Match
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={filters.area}
            onChange={(e) => setFilters({ ...filters, area: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Areas</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <select
            value={filters.sport}
            onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Sports</option>
            {sports.map(sport => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>

          <button
            onClick={() => setFilters({ area: '', sport: '', status: 'open' })}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No matches found</p>
          <Link
            to="/create-match"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Be the first to create a match!
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map(match => (
            <Link
              key={match._id}
              to={`/matches/${match._id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{match.title}</h3>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {match.sport}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-primary-600 font-semibold mb-1">
                    <Users className="h-5 w-5 mr-1" />
                    <span>{match.players.current}/{match.players.required}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {match.players.required - match.players.current} spots left
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{match.location.area}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{format(new Date(match.dateTime.date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{match.dateTime.startTime} - {match.dateTime.endTime}</span>
                </div>
              </div>

              {match.description && (
                <p className="mt-4 text-gray-600 line-clamp-2">{match.description}</p>
              )}

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Organized by {match.organizer?.name || 'Unknown'}
                </div>
                {match.costPerPerson > 0 && (
                  <div className="text-primary-600 font-semibold">
                    ₹{match.costPerPerson}/person
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchList;
