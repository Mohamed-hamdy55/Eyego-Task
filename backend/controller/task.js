const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Task = require("../model/task");
const User = require("../model/user");


// Create a new task
exports.createTask = catchAsyncErrors(async (req, res,next) => {
  try {
    const { title, ar_title, description, ar_description } = req.body;
    const user_id = req.user._id;

    // Validation to ensure required fields are present
    if (!title ||  !ar_title  || !description || !ar_description ) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }


    const user = await User.findOne({_id:user_id});

    if(!user){
        return next(new ErrorHandler("User not found!", 400));
    }

    // Single query to check for duplicates in title or ar_title fields
    const duplicateCheck = await Task.findOne({
      user: user_id,
      $or: [{ title }, { ar_title }],
    });

    // Determine the specific conflict(s)
    if (duplicateCheck) {
      if (duplicateCheck.title === title && duplicateCheck.ar_title === ar_title) {
        return next(new ErrorHandler("Both English and Arabic titles already exist.", 400));
      }
      if (duplicateCheck.title === title) {
        return next(new ErrorHandler("task with this English title already exists.", 400));
      }
      if (duplicateCheck.ar_title === ar_title) {
        return next(new ErrorHandler("task with this Arabic title already exists.", 400));
      }
    }

   
    const newTask = await Task.create({
      title,
      ar_title,
      description,
      ar_description,
      user:user_id,
    });

    return res.status(201).json({
      message: "Wooooo! Task created successfully.",
      task: newTask,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Delete a task by ID
exports.deleteTask = catchAsyncErrors(async (req, res,next) => {
  try {
    const { task_id } = req.params;

    // Call the findOneAndDelete method to trigger the middleware
    const task = await Task.findOneAndDelete({ _id: task_id });

    if (!task) {
        return next(new ErrorHandler("Task not found!", 404));
      }

    return res.status(200).json({ 
      success: true,
      message: "Task deleted successfully." 
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update a task by ID
exports.updateTask = catchAsyncErrors(async (req, res,next) => {
  try {
    const { task_id } = req.params;
    const { title, ar_title, ...otherValues} = req.body;
    const user_id = req.user._id;

    // Single query to check for duplicates in title or ar_title fields
    const duplicateCheck = await Task.findOne({
      user: user_id,
      _id: { $ne: task_id },
      $or: [{ title }, { ar_title }],
    });

    // Determine the specific conflict(s)
    if (duplicateCheck) {
      if (duplicateCheck.title === title && duplicateCheck.ar_title === ar_title) {
        return next(new ErrorHandler("Both English and Arabic titles already exist.", 400));
      }
      if (duplicateCheck.title === title) {
        return next(new ErrorHandler("Task with this English title already exists.", 400));
      }
      if (duplicateCheck.ar_title === ar_title) {
        return next(new ErrorHandler("Task with this Arabic title already exists.", 400));
      }
    }


    // Find the task by ID and update
    const updated_Task= await Task.findByIdAndUpdate(
      task_id,
      {title, ar_title, ...otherValues},
      { new: true, runValidators: true } // new: true to return the updated document
    );

    if (!updated_Task) {
      return next(new ErrorHandler("Task Not Found",400));
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      updated_Task
    });
  } catch (error) {
    return next(new ErrorHandler(error.message,500));
  }
});

// Get all tasks with pagination, search , optional state filtering
exports.getTaskInfo = catchAsyncErrors(async (req, res,next) => { 
  try {
    const user_id = req.user._id;
    const {task_id} = req.params ;

 
    const user = await User.findOne({_id:user_id});

    if(!user){
        return next(new ErrorHandler("User is not found!", 404));
    }

    const task = await Task.findOne({_id:task_id,user:user_id});

    if (!task) {
      return next(new ErrorHandler("No task found for this user!", 404));
    }


    res.status(200).json({
      success: true,
      task,   // The task data
    });
  }catch(error){
    return(next(new ErrorHandler(error.message, 500)))
  }
});

// Get all tasks with pagination, search , optional state filtering
exports.getTasks = catchAsyncErrors(async (req, res,next) => {
  try {
    const user_id = req.user._id ;
    const state = req.query.state;
    const offset = parseInt(req.query.offset) || 1; // page number
    const limit = parseInt(req.query.limit) != 0 ? parseInt(req.query.limit) :  0; // number of rows per page
    const searchQuery = req.query.search || ""; // search query
    const sortField = req.query.sortField || "createdAt"; // Default sort by title
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // Default descending

    // Initial query with search functionality
    const query = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { ar_title: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const user = await User.findOne({_id:user_id});

    if(!user){
        return next(new ErrorHandler("User is not found!", 404));
    }
    
    query.user = user._id;

    if(state){
      query.state = state.replace(/-/g, ' ');
    }
    
    // Get total count of tasks matching the query for pagination purposes
    const totalTasks = await Task.countDocuments(query);

    // Fetch the tasks with search and sorting (without pagination if limit = 0)
    let tasksQuery = Task.find(query).sort({ [sortField]: sortOrder });
    if (limit > 0) {
        tasksQuery = tasksQuery.skip((offset - 1) * limit).limit(limit);
    }
    
    const tasks = await tasksQuery;

    if (!tasks) {
      return next(new ErrorHandler("No tasks found for this user!", 404));
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      success: true,
      tasks,   // The tasks data
      offset,     // Current page number
      limit,      // Limit of tasks per page
      totalPages, // Total pages for pagination
      totalTasks, // Total number of tasks matching the query
    });
  } catch (error) {
    return next(new ErrorHandler(error.message,500));
  }
});

