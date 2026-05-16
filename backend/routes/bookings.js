const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const { protect } = require('../middleware/auth');
const { sendWhatsAppNotification } = require('../utils/whatsapp');

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('turf', 'name location contactInfo')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings/turf/:turfId
// @desc    Get all bookings for a turf (owner only)
// @access  Private
router.get('/turf/:turfId', protect, async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.turfId);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Check if user is turf owner
    if (turf.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view these bookings'
      });
    }

    const bookings = await Booking.find({ turf: req.params.turfId })
      .populate('user', 'name phone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get turf bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking request (sends WhatsApp to owner)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { turfId, sport, dateTime, numberOfPlayers, notes } = req.body;

    // Get turf details
    const turf = await Turf.findById(turfId).populate('owner', 'name phone');

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    if (!turf.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This turf is currently not accepting bookings'
      });
    }

    // Calculate pricing
    const bookingDate = new Date(dateTime.date);
    const isWeekend = bookingDate.getDay() === 0 || bookingDate.getDay() === 6;
    const amount = isWeekend ? turf.pricing.weekend : turf.pricing.weekday;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      turf: turfId,
      sport,
      dateTime,
      numberOfPlayers,
      pricing: {
        amount,
        currency: 'INR'
      },
      notes,
      status: 'pending'
    });

    // Send WhatsApp notification to turf owner
    try {
      const message = `
🏏 New Booking Request!

Booking ID: ${booking.bookingId}
Sport: ${sport}
Date: ${new Date(dateTime.date).toLocaleDateString('en-IN')}
Time: ${dateTime.startTime} - ${dateTime.endTime}
Players: ${numberOfPlayers}
Amount: ₹${amount}

Customer: ${req.user.name}
Phone: ${req.user.phone}

${notes ? `Notes: ${notes}` : ''}

Reply:
✅ ACCEPT ${booking.bookingId}
❌ REJECT ${booking.bookingId}
      `.trim();

      await sendWhatsAppNotification(turf.contactInfo.whatsapp, message);

      booking.whatsappNotification = {
        sentAt: new Date()
      };
      await booking.save();
    } catch (whatsappError) {
      console.error('WhatsApp notification failed:', whatsappError);
      // Don't fail the booking if WhatsApp fails
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('turf', 'name location contactInfo');

    res.status(201).json({
      success: true,
      message: 'Booking request sent! Waiting for turf owner confirmation via WhatsApp.',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/bookings/:id/confirm
// @desc    Confirm booking (owner only)
// @access  Private
router.put('/:id/confirm', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('turf');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is turf owner
    if (booking.turf.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to confirm this booking'
      });
    }

    booking.status = 'confirmed';
    booking.whatsappNotification.ownerResponse = {
      receivedAt: new Date(),
      action: 'accepted'
    };
    await booking.save();

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/bookings/:id/reject
// @desc    Reject booking (owner only)
// @access  Private
router.put('/:id/reject', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('turf');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is turf owner
    if (booking.turf.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to reject this booking'
      });
    }

    booking.status = 'rejected';
    booking.whatsappNotification.ownerResponse = {
      receivedAt: new Date(),
      action: 'rejected'
    };
    await booking.save();

    res.json({
      success: true,
      message: 'Booking rejected',
      data: booking
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking (user only)
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the booking owner
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    booking.cancelledBy = 'user';
    booking.cancellationReason = req.body.reason || 'User cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
