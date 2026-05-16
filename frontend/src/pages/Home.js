import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, Trophy } from 'lucide-react';

const Home = () => {
  const areas = ['Chinchwad', 'Wakad', 'Pimpri', 'Akurdi', 'Nigdi', 'Bhosari'];
  const sports = ['Cricket', 'Football', 'Badminton', 'Basketball'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Turfs. Find Players. Play Sports.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              PCMC's #1 Platform for Sports Lovers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/turfs"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Browse Turfs
              </Link>
              <Link
                to="/matches"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition border-2 border-white"
              >
                Find Players
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Turfs</h3>
            <p className="text-gray-600">
              Browse turfs in Chinchwad, Wakad, Pimpri and nearby areas
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Slots</h3>
            <p className="text-gray-600">
              Send booking request via WhatsApp to turf owners
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Players</h3>
            <p className="text-gray-600">
              Join nearby matches or create your own
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Play & Enjoy</h3>
            <p className="text-gray-600">
              Meet new people and enjoy your favorite sports
            </p>
          </div>
        </div>
      </div>

      {/* Areas Covered */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Areas We Cover</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {areas.map((area) => (
              <div
                key={area}
                className="bg-white p-4 rounded-lg text-center shadow-sm hover:shadow-md transition"
              >
                <MapPin className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <p className="font-semibold">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sports */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Sports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sports.map((sport) => (
            <Link
              key={sport}
              to={`/matches?sport=${sport}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border-2 border-gray-100 hover:border-primary-600"
            >
              <div className="text-4xl mb-3">
                {sport === 'Cricket' && '🏏'}
                {sport === 'Football' && '⚽'}
                {sport === 'Badminton' && '🏸'}
                {sport === 'Basketball' && '🏀'}
              </div>
              <p className="font-semibold text-lg">{sport}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Playing?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join hundreds of sports enthusiasts in PCMC
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Sign Up Now - It's Free!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
