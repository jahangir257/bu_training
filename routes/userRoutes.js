const express = require('express');
const router = express.Router();
const { getUsers, getUserById, deleteUser, updateUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes here are admin only
router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUserById);
// Update
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
