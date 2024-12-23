const express = require('express');

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.post('/createTask', createTask); // Create task
router.get('/getAlltasks', getAllTasks); // Get all tasks
router.get('/:id', getTaskById); // Get a single task
router.put('/:id', updateTask); // Update task
router.delete('/:id', deleteTask); // Delete task

module.exports = router;
