import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateMatch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    sport: 'Cricket',
    location: { area: 'Chinchwad', address: '' },
    dateTime: { date: '', startTime: '', endTime: '' },
    players: { required: 10 },
    costPerPerson: 0,
    description: '',
    skillLevel: 'All Levels'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await matchAPI.create(formData);
      toast.success('Match created successfully!');
      navigate('/matches');
    } catch (error) {
      toast.error('Failed to create match');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Match</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Match Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Sunday Cricket Match"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sport</label>
            <select
              value={formData.sport}
              onChange={(e) => setFormData({...formData, sport: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {['Cricket', 'Football', 'Badminton', 'Basketball'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Area</label>
            <select
              value={formData.location.area}
              onChange={(e) => setFormData({...formData, location: {...formData.location, area: e.target.value}})}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {['Chinchwad', 'Wakad', 'Pimpri', 'Akurdi'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.dateTime.date}
              onChange={(e) => setFormData({...formData, dateTime: {...formData.dateTime, date: e.target.value}})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              required
              value={formData.dateTime.startTime}
              onChange={(e) => setFormData({...formData, dateTime: {...formData.dateTime, startTime: e.target.value}})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              required
              value={formData.dateTime.endTime}
              onChange={(e) => setFormData({...formData, dateTime: {...formData.dateTime, endTime: e.target.value}})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Players Needed</label>
          <input
            type="number"
            required
            min="2"
            value={formData.players.required}
            onChange={(e) => setFormData({...formData, players: {required: parseInt(e.target.value)}})}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
        >
          Create Match
        </button>
      </form>
    </div>
  );
};

export default CreateMatch;
