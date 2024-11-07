const express = require('express');
const router = express.Router();
const taskController = require('../controller/task');
const { isAuthenticated} = require("../middleware/auth");

// POST - Create a new task
router.post('/create-task',isAuthenticated, taskController.createTask);

// PATCH - Update a task by ID 
router.delete('/delete-task/:task_id',isAuthenticated, taskController.deleteTask);

// PATCH - Update a task by ID
router.patch('/update-task/:task_id',isAuthenticated, taskController.updateTask);

// GET - Get task info
router.get('/get-task-info/:task_id',isAuthenticated, taskController.getTaskInfo);

// GET - Get all tasks for specific user 
router.get('/get-tasks',isAuthenticated, taskController.getTasks);



module.exports = router;