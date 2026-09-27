const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Project = require('../models/Project');

/**
 * @desc   Get all projects
 * @route  GET /api/projects
 * @access Public
 */
const getProjects = async (req, res, next) => {
  try {
    // Ensure database connection is active before querying
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
      if (mongoose.connection.readyState !== 1) {
        const dbErr = new Error('Database connection is not ready. Please verify MongoDB Atlas network connectivity.');
        dbErr.statusCode = 503;
        throw dbErr;
      }
    }

    const projects = await Project.find().sort({ featured: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single project by ID
 * @route  GET /api/projects/:id
 * @access Public
 */
const getProjectById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      const error = new Error(`Project not found with ID: ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new project
 * @route  POST /api/projects
 * @access Public
 */
const createProject = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update project by ID
 * @route  PUT /api/projects/:id
 * @access Public
 */
const updateProject = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!project) {
      const error = new Error(`Project not found with ID: ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete project by ID
 * @route  DELETE /api/projects/:id
 * @access Public
 */
const deleteProject = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      const error = new Error(`Project not found with ID: ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
