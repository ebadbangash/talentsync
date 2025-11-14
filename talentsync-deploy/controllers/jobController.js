// jobController.js
const Job = require('../models/jobs');
const JobApplication=require('../models/JobApplication');
const multer=require('multer');
const path=require('path');


const getAllJobs = async (req, res) => {
  try {
    const { job_name, location } = req.query;
    const query = {};

    if (job_name) {
      query["Job Title"] = { $regex: job_name, $options: 'i' };
    }

    if (location) {
      query.Location = { $regex: location, $options: 'i' }; 
    }

    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (error) {
    res.status(500).send('Error fetching jobs');
  }
};

const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).send('Error creating job');
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const submitJobApplication = (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', error: err.message || err });
    }

    try {
      const { job_id, firstName, lastName, email, phone, positionApplied, coverLetter, interviewDate } = req.body;
      const resume = req.file?.path;

      if (!resume) {
        return res.status(400).json({ message: 'Resume file is required. Please attach your resume before submitting.' });
      }

      const sanitized = {
        job_id: typeof job_id === 'string' ? job_id.trim() : job_id,
        firstName: typeof firstName === 'string' ? firstName.trim() : firstName,
        lastName: typeof lastName === 'string' ? lastName.trim() : lastName,
        email: typeof email === 'string' ? email.trim() : email,
        phone: typeof phone === 'string' ? phone.trim() : phone,
        positionApplied: typeof positionApplied === 'string' ? positionApplied.trim() : positionApplied,
        coverLetter: typeof coverLetter === 'string' ? coverLetter.trim() : coverLetter
      };

      const missingFields = Object.entries({
        job_id: sanitized.job_id,
        firstName: sanitized.firstName,
        lastName: sanitized.lastName,
        email: sanitized.email,
        phone: sanitized.phone,
        positionApplied: sanitized.positionApplied,
        coverLetter: sanitized.coverLetter
      })
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length) {
        return res.status(400).json({
          message: 'Please complete all required fields before submitting your application.',
          missingFields
        });
      }

      const jobApplication = new JobApplication({
        job_id: sanitized.job_id,
        firstName: sanitized.firstName,
        lastName: sanitized.lastName,
        email: sanitized.email,
        phone: sanitized.phone,
        positionApplied: sanitized.positionApplied,
        coverLetter: sanitized.coverLetter,
        interviewDate,
        resume
      });

      await jobApplication.save();
      return res.status(201).json({ message: 'Application submitted successfully', jobApplication });
    } catch (error) {
      console.error('Error saving job application:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation failed when submitting the application.',
          errors: error.errors
        });
      }

      return res.status(500).json({ message: 'Error applying for the job' });
    }
  });
};
module.exports = { getAllJobs, createJob ,submitJobApplication};
