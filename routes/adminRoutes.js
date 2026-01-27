const express = require("express");
const User = require("../models/User");
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ================= USERS =================

// Get all users (Admin only)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete any user (Admin only)
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Todo.deleteMany({ userId: req.params.id });
    res.json({ message: "User and their todos deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= TODOS =================

// Get all todos (Admin only)
router.get("/todos", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find().populate("userId", "name email");
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete any todo (Admin only)
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await User.findByIdAndDelete(req.params.id);
    await Todo.deleteMany({ userId: req.params.id });

    res.json({ message: "User and their todos deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= STATS =================

router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });

    res.json({
      totalUsers,
      totalTodos,
      completedTodos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
