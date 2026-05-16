# PLAY SPOTS Booking Platform - MVP

A hyperlocal platform for sports turf booking and player matching in PCMC (Pimpri-Chinchwad) area.

## 🎯 Features

### Version 1 (MVP)
- ✅ **Find Turfs**: Browse sports turfs in Chinchwad, Wakad, Pimpri, Akurdi
- ✅ **Find Players**: Join nearby matches or create your own
- ✅ **WhatsApp Booking**: Request-based booking system via WhatsApp
- ✅ **Real-time Updates**: Live match updates using WebSockets
- ✅ **User Authentication**: Secure JWT-based auth
- ✅ **Role-based Access**: Player and Turf Owner roles

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Socket.io-client
- React Hot Toast

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (WebSocket)
- Twilio (WhatsApp notifications)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/turf-booking
JWT_SECRET=your-super-secret-key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start the React app:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🚀 Quick Start

1. **Start MongoDB** (if running locally):
```bash
mongod
```

2. **Start Backend**:
```bash
cd backend
npm run dev
```

3. **Start Frontend** (in a new terminal):
```bash
cd frontend
npm start
```

4. **Open your browser**:
```
http://localhost:3000
```

## 📱 How It Works

### For Players:
1. Sign up as a Player
2. Browse turfs in your area
3. Send booking request (owner gets WhatsApp notification)
4. Create or join matches to find players

### For Turf Owners:
1. Sign up as Turf Owner
2. List your turf with pricing and amenities
3. Receive booking requests via WhatsApp
4. Accept/Reject bookings

## 🎨 User Flow

```
Player Journey:
Register → Browse Turfs → Book Slot → WhatsApp Confirmation → Play

Match Creation:
Create Match → Find Players → Join → Play Together
```

## 📊 Database Models

- **User**: Players and Turf Owners
- **Turf**: Sports facilities with location, pricing, amenities
- **Match**: Player-created matches for finding teammates
- **Booking**: Turf booking requests with WhatsApp approval flow

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Turfs
- `GET /api/turfs` - Get all turfs (with filters)
- `GET /api/turfs/:id` - Get single turf
- `POST /api/turfs` - Create turf (owner only)
- `PUT /api/turfs/:id` - Update turf (owner only)

### Matches
- `GET /api/matches` - Get all matches (with filters)
- `GET /api/matches/:id` - Get single match
- `POST /api/matches` - Create match
- `POST /api/matches/:id/join` - Join match
- `POST /api/matches/:id/leave` - Leave match

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking request
- `PUT /api/bookings/:id/confirm` - Confirm booking (owner)
- `PUT /api/bookings/:id/reject` - Reject booking (owner)

## 🎯 Next Steps (Future Versions)

**Version 2:**
- Payment integration
- Rating & reviews
- Photo uploads (Cloudinary)
- Email notifications
- Advanced search filters

**Version 3:**
- Owner dashboard with analytics
- Live slot availability sync
- Recurring bookings
- Team management
- Tournament organization

## 🤝 Contributing

This is an MVP project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT License

## 🙋‍♂️ Support

For issues or questions, please create an issue in the repository.

---

**Built for PCMC sports community** 🏏⚽🏸
