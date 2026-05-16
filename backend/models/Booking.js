const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: true
  },
  sport: {
    type: String,
    enum: ['Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis'],
    required: true
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
  numberOfPlayers: {
    type: Number,
    required: true,
    min: 1
  },
  pricing: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: 300
  },
  whatsappNotification: {
    sentAt: Date,
    messageId: String,
    ownerResponse: {
      receivedAt: Date,
      action: {
        type: String,
        enum: ['accepted', 'rejected']
      }
    }
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'owner', 'admin']
  },
  cancellationReason: String
}, {
  timestamps: true
});

// Generate unique booking ID
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    this.bookingId = `TRF${timestamp}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  next();
});

// Index for user and turf queries
bookingSchema.index({ user: 1, 'dateTime.date': 1 });
bookingSchema.index({ turf: 1, 'dateTime.date': 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
