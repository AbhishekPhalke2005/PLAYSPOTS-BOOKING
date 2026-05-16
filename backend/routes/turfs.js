const express = require('express');
const router = express.Router();
const Turf = require('../models/Turf');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/turfs
// @desc    Get all turfs (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { area, sport, isActive } = req.query;
    
    let query = {};
    
    if (area) query['location.area'] = area;
    if (sport) query.sports = sport;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const turfs = await Turf.find(query)
      .populate('owner', 'name phone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: turfs.length,
      data: turfs
    });
  } catch (error) {
    console.error('Get turfs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/turfs/:id
// @desc    Get single turf
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    res.json({
      success: true,
      data: turf
    });
  } catch (error) {
    console.error('Get turf error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/turfs
// @desc    Create new turf
// @access  Private (owner/admin only)
router.post('/', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    // Add owner from logged in user
    req.body.owner = req.user.id;

    const turf = await Turf.create(req.body);

    res.status(201).json({
      success: true,
      data: turf
    });
  } catch (error) {
    console.error('Create turf error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/turfs/:id
// @desc    Update turf
// @access  Private (owner of turf or admin)
router.put('/:id', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    let turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Make sure user is turf owner or admin
    if (turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this turf'
      });
    }

    turf = await Turf.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: turf
    });
  } catch (error) {
    console.error('Update turf error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/turfs/:id
// @desc    Delete turf
// @access  Private (owner of turf or admin)
router.delete('/:id', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Make sure user is turf owner or admin
    if (turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this turf'
      });
    }

    await turf.deleteOne();

    res.json({
      success: true,
      message: 'Turf deleted successfully'
    });
  } catch (error) {
    console.error('Delete turf error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
