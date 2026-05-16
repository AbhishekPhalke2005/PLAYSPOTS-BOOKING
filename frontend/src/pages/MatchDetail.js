import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MatchDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      const { data } = await matchAPI.getById(id);
      setMatch(data.data);
    } catch (error) {
      toast.error('Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to join');
      navigate('/login');
      return;
    }

    try {
      await matchAPI.join(id);
      toast.success('Successfully joined the match!');
      fetchMatch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join match');
    }
  };

  const handleLeave = async () => {
    try {
      await matchAPI.leave(id);
      toast.success('Left the match');
      fetchMatch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to leave match');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  if (!match) return <div className="text-center py-12">Match not found</div>;

  const isJoined = match.players.list.some(p => p.user._id === user?.id);
  const isOrganizer = match.organizer._id === user?.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{match.title}</h1>
        <div className="space-y-4">
          <p><strong>Sport:</strong> {match.sport}</p>
          <p><strong>Location:</strong> {match.location.area}</p>
          <p><strong>Date:</strong> {new Date(match.dateTime.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {match.dateTime.startTime} - {match.dateTime.endTime}</p>
          <p><strong>Players:</strong> {match.players.current}/{match.players.required}</p>
          {match.description && <p><strong>Description:</strong> {match.description}</p>}
        </div>

        {match.status === 'open' && !isOrganizer && (
          <div className="mt-6">
            {!isJoined ? (
              <button
                onClick={handleJoin}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
              >
                Join Match
              </button>
            ) : (
              <button
                onClick={handleLeave}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Leave Match
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetail;
