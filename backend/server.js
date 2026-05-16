const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database connection
//mongoose.connect(process.env.MONGODB_URI, {
  //useNewUrlParser: true,
 // useUnifiedTopology: true

//then(() => console.log('✅ MongoDB connected successfully'))
//.catch(err => {
 // console.error('❌ MongoDB connection error:', err);
 // process.exit(1);
;

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/turfs', require('./routes/turfs'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PCMC Turf Booking API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      turfs: '/api/turfs',
      matches: '/api/matches',
      bookings: '/api/bookings'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Join room for specific match
  socket.on('join-match', (matchId) => {
    socket.join(`match-${matchId}`);
    console.log(`User joined match room: ${matchId}`);
  });

  // Leave match room
  socket.on('leave-match', (matchId) => {
    socket.leave(`match-${matchId}`);
    console.log(`User left match room: ${matchId}`);
  });

  // Real-time match updates (player joined/left)
  socket.on('match-update', (data) => {
    io.to(`match-${data.matchId}`).emit('match-updated', data);
  });

  // Booking status updates
  socket.on('booking-update', (data) => {
    io.to(`user-${data.userId}`).emit('booking-status-changed', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Helper function to emit real-time updates (can be used in routes)
global.emitMatchUpdate = (matchId, data) => {
  io.to(`match-${matchId}`).emit('match-updated', data);
};

global.emitBookingUpdate = (userId, data) => {
  io.to(`user-${userId}`).emit('booking-status-changed', data);
};

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📡 WebSocket enabled
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully');
  server.close(() => {
   // mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
;

module.exports = { app, server, io };
