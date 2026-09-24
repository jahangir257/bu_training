const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all users (admin and normal). Admin only.
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/users/:id
// @desc    Get a single user by id. Admin only.
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/users/:id
// @desc    Update any user's name / email / role (and optionally password).
//          Admin only. This is how a user gets promoted to admin, e.g.
//          { "role": "admin" }.
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Fetch with password included in case admin wants to reset it,
    // and use save() (not findByIdAndUpdate) so the pre-save hashing
    // middleware runs correctly if password is changed.
    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: 'That email is already in use by another account'
        });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (password) user.password = password; // re-hashed by pre-save hook
    if (role) {
      if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'role must be either "admin" or "user"'
        });
      }
      user.role = role;
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/users/:id
// @desc    Delete a user. Admin only.
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
