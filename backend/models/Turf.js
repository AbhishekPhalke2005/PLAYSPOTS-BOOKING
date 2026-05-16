const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide turf name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    area: {
      type: String,
      enum: ['Chinchwad', 'Wakad', 'Pimpri', 'Akurdi', 'Nigdi', 'Bhosari', 'Other'],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    landmark: String,
    googleMapsLink: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  sports: [{
    type: String,
    enum: ['Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis'],
    required: true
  }],
  amenities: [{
    type: String,
    enum: ['Parking', 'Washroom', 'Changing Room', 'Drinking Water', 'First Aid', 'Lighting', 'Seating']
  }],
  pricing: {
    weekday: {
      type: Number,
      required: true
    },
    weekend: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  images: [{
    type: String
  }],
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    whatsapp: {
      type: String,
      required: true
    },
    email: String
  },
  availability: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: true }
  },
  timeSlots: {
    start: {
      type: String,
      default: '06:00'
    },
    end: {
      type: String,
      default: '23:00'
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for location-based queries
turfSchema.index({ 'location.area': 1, isActive: 1 });

module.exports = mongoose.model('Turf', turfSchema);
