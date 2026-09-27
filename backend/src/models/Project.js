const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true
    },
    technologies: {
      type: [String],
      default: []
    },
    githubUrl: {
      type: String,
      trim: true,
      default: null
    },
    liveUrl: {
      type: String,
      trim: true,
      default: null
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);
