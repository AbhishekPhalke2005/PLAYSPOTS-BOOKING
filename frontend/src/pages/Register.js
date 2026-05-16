import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'player',
    location: {
      area: 'Chinchwad'
    },
    sportsPreferences: []
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const areas = ['Chinchwad', 'Wakad', 'Pimpri', 'Akurdi', 'Nigdi', 'Bhosari', 'Other'];
  const sports = ['Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'area') {
      setFormData({
        ...formData,
        location: { ...formData.location, area: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSportToggle = (sport) => {
    const newPreferences = formData.sportsPreferences.includes(sport)
      ? formData.sportsPreferences.filter(s => s !== sport)
      : [...formData.sportsPreferences, sport];
    
    setFormData({
      ...formData,
      sportsPreferences: newPreferences
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <UserPlus className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Log in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                pattern="[6-9][0-9]{9}"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="9876543210"
              />
              <p className="mt-1 text-xs text-gray-500">10-digit Indian number</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Area *
              </label>
              <select
                name="area"
                required
                value={formData.location.area}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a... *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="player"
                  checked={formData.role === 'player'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Player (Looking to play)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={formData.role === 'owner'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Turf Owner</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sports Interests (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {sports.map(sport => (
                <button
                  key={sport}
                  type="button"
                  onClick={() => handleSportToggle(sport)}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    formData.sportsPreferences.includes(sport)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
