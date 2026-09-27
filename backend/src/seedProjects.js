require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Project = require('./models/Project');

const realProjects = [
  {
    title: 'LibSync Smart Library',
    description:
      'A smart library management system designed to digitalize student management, library entry and exit tracking, seat availability, and active library sessions. The current implementation is a frontend prototype with student management, seat management, scanner/verification workflow, and occupied/available/maintenance seat states.',
    technologies: ['React', 'TypeScript', 'Vite', 'React Router', 'HTML', 'CSS'],
    githubUrl: 'https://github.com/sunshriya-jeer/libsync-smart-library',
    featured: true
  },
  {
    title: 'Virtual Drawing Board',
    description:
      'A computer-vision based drawing application that allows users to draw digitally using hand gestures captured through a webcam, reducing dependence on a physical mouse or drawing device.',
    technologies: ['Python', 'OpenCV', 'MediaPipe', 'Computer Vision', 'NumPy'],
    githubUrl: 'https://github.com/sunshriya-jeer/virtual_drawing_board',
    featured: true
  },
  {
    title: 'Evidence AI',
    description:
      'An AI-assisted web application that helps users analyze claims and identify relevant supporting evidence and sources, making research and claim checking more convenient.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'AI/ML', 'API Integration'],
    featured: false
  }
];

const seedProjects = async () => {
  try {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.error('[Seed] Database connection could not be established. Check MONGODB_URI.');
      process.exit(1);
    }

    // Clear existing Project documents to prevent duplicates
    const deleteResult = await Project.deleteMany({});
    console.log(`[Seed] Cleared ${deleteResult.deletedCount} existing project(s).`);

    // Insert real projects
    const insertedProjects = await Project.insertMany(realProjects);
    console.log(`[Seed] Successfully inserted ${insertedProjects.length} project(s) into MongoDB.`);

    // Disconnect from MongoDB
    await mongoose.connection.close();
    console.log('[Seed] Disconnected from MongoDB.');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error executing seed: ${error.message}`);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedProjects();
