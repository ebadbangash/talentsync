const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/userModel');
const Company = require('../models/companies');
const Job = require('../models/jobs');
const Salary = require('../models/salaries');
const JobApplication = require('../models/JobApplication');

const {
  users,
  companies,
  jobs,
  salaries,
  jobApplications
} = require('./seedData');

const connectToDatabase = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment.');
  }

  await mongoose.connect(MONGO_URI);
};

const clearCollections = async () => {
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Salary.deleteMany({}),
    JobApplication.deleteMany({})
  ]);
};

const seedCollections = async () => {
  await User.create(users);
  await Company.insertMany(companies);
  await Job.insertMany(jobs);
  await Salary.insertMany(salaries);
  await JobApplication.insertMany(jobApplications);
};

const run = async () => {
  console.log('Starting database seeding...');

  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    await clearCollections();
    console.log('Cleared existing documents.');

    await seedCollections();
    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

run();
