const express = require("express");
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Todo (Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    const todo = new Todo({
      title,
      userId: req.user._id
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Todos (Only logged in user's todos)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Todo (Protected)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Todo (Protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
