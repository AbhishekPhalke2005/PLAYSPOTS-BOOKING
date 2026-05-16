// Mock WhatsApp utility - works without Twilio credentials
// Replace backend/utils/whatsapp.js with this during development

/**
 * Mock WhatsApp notification - just logs to console
 */
exports.sendWhatsAppNotification = async (to, message) => {
  console.log('📱 [MOCK] WhatsApp notification would be sent to:', to);
  console.log('📝 Message:', message);
  console.log('---');
  
  // Return mock response
  return {
    sid: 'MOCK_' + Date.now(),
    status: 'sent',
    to: to
  };
};

/**
 * Send booking confirmation to user
 */
exports.sendBookingConfirmation = async (userPhone, bookingDetails) => {
  const message = `
✅ Booking Confirmed!

Booking ID: ${bookingDetails.bookingId}
Turf: ${bookingDetails.turfName}
Date: ${bookingDetails.date}
Time: ${bookingDetails.time}
Amount: ₹${bookingDetails.amount}

See you on the field! 🏏
  `.trim();

  console.log('📱 [MOCK] Booking confirmation to:', userPhone);
  console.log(message);
  return { sid: 'MOCK', status: 'sent' };
};

/**
 * Send booking rejection to user
 */
exports.sendBookingRejection = async (userPhone, bookingDetails) => {
  const message = `
❌ Booking Not Available

Booking ID: ${bookingDetails.bookingId}
Turf: ${bookingDetails.turfName}
Date: ${bookingDetails.date}
Time: ${bookingDetails.time}

The slot is not available. Please try another time or turf.
  `.trim();

  console.log('📱 [MOCK] Booking rejection to:', userPhone);
  console.log(message);
  return { sid: 'MOCK', status: 'sent' };
};

/**
 * Send match invitation notification
 */
exports.sendMatchInvitation = async (userPhone, matchDetails) => {
  const message = `
🏏 New Match Near You!

Sport: ${matchDetails.sport}
Location: ${matchDetails.location}
Date: ${matchDetails.date}
Time: ${matchDetails.time}
Players Needed: ${matchDetails.spotsRemaining}

Join now on the app!
  `.trim();

  console.log('📱 [MOCK] Match invitation to:', userPhone);
  console.log(message);
  return { sid: 'MOCK', status: 'sent' };
};

module.exports = exports;
