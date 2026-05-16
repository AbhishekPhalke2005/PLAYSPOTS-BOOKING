const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { protect } = require('../middleware/auth');

// @route   GET /api/matches
// @desc    Get all matches (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { area, sport, status, date } = req.query;
    
    let query = {};
    
    if (area) query['location.area'] = area;
    if (sport) query.sport = sport;
    if (status) query.status = status;
    
    // Filter by date (today or upcoming)
    if (date === 'upcoming') {
      query['dateTime.date'] = { $gte: new Date() };
    }

    const matches = await Match.find(query)
      .populate('organizer', 'name phone location')
      .populate('turf', 'name location')
      .populate('players.list.user', 'name')
      .sort('dateTime.date');

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/matches/:id
// @desc    Get single match
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('organizer', 'name phone location')
      .populate('turf', 'name location pricing')
      .populate('players.list.user', 'name phone');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/matches
// @desc    Create new match
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    req.body.organizer = req.user.id;
    
    // Initialize with organizer as first player
    req.body.players = {
      required: req.body.players.required,
      current: 1,
      list: [{
        user: req.user.id,
        status: 'confirmed'
      }]
    };

    const match = await Match.create(req.body);

    res.status(201).json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/matches/:id/join
// @desc    Join a match
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Check if match is full
    if (match.status === 'full') {
      return res.status(400).json({
        success: false,
        message: 'Match is already full'
      });
    }

    // Check if user already joined
    const alreadyJoined = match.players.list.find(
      p => p.user.toString() === req.user.id
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this match'
      });
    }

    // Add user to match
    match.players.list.push({
      user: req.user.id,
      status: 'confirmed'
    });
    match.players.current += 1;

    await match.save();

    res.json({
      success: true,
      message: 'Successfully joined the match',
      data: match
    });
  } catch (error) {
    console.error('Join match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/matches/:id/leave
// @desc    Leave a match
// @access  Private
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Check if user is the organizer
    if (match.organizer.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Organizer cannot leave the match. Cancel the match instead.'
      });
    }

    // Remove user from match
    match.players.list = match.players.list.filter(
      p => p.user.toString() !== req.user.id
    );
    match.players.current -= 1;

    await match.save();

    res.json({
      success: true,
      message: 'Successfully left the match',
      data: match
    });
  } catch (error) {
    console.error('Leave match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/matches/:id
// @desc    Update match
// @access  Private (organizer only)
router.put('/:id', protect, async (req, res) => {
  try {
    let match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Make sure user is match organizer
    if (match.organizer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this match'
      });
    }

    match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/matches/:id
// @desc    Cancel match
// @access  Private (organizer only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Make sure user is match organizer
    if (match.organizer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this match'
      });
    }

    match.status = 'cancelled';
    await match.save();

    res.json({
      success: true,
      message: 'Match cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
