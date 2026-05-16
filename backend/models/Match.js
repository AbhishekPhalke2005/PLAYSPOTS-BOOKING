const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide match title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  sport: {
    type: String,
    enum: ['Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis'],
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: false // Can be null if turf not booked yet
  },
  location: {
    area: {
      type: String,
      enum: ['Chinchwad', 'Wakad', 'Pimpri', 'Akurdi', 'Nigdi', 'Bhosari', 'Other'],
      required: true
    },
    address: String
  },
  dateTime: {
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  players: {
    required: {
      type: Number,
      required: true,
      min: 2
    },
    current: {
      type: Number,
      default: 0
    },
    list: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      joinedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['confirmed', 'pending', 'declined'],
        default: 'confirmed'
      }
    }]
  },
  costPerPerson: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  status: {
    type: String,
    enum: ['open', 'full', 'completed', 'cancelled'],
    default: 'open'
  },
  contactInfo: {
    phone: String,
    whatsapp: String
  }
}, {
  timestamps: true
});

// Index for location and date queries
matchSchema.index({ 'location.area': 1, 'dateTime.date': 1, status: 1 });

// Virtual for spots remaining
matchSchema.virtual('spotsRemaining').get(function() {
  return this.players.required - this.players.current;
});

// Update status when full
matchSchema.pre('save', function(next) {
  if (this.players.current >= this.players.required) {
    this.status = 'full';
  } else if (this.status === 'full' && this.players.current < this.players.required) {
    this.status = 'open';
  }
  next();
});

module.exports = mongoose.model('Match', matchSchema);
