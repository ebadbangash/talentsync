const express = require('express');
const jobController = require('../controllers/jobController'); 
const router = express.Router();
router.get('/jobs', jobController.getAllJobs);
router.post('/jobs', jobController.createJob);
router.post('/jobs/apply',jobController.submitJobApplication);

module.exports = router;
