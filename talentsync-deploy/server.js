
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const jobRoutes = require('./routes/jobRoutes');
const companyRoutes = require('./routes/companyRoutes');
const salarayRoutes=require('./routes/salaryRoutes');
const userRoutes=require('./routes/userRoute');
const cors = require('cors');
dotenv.config();

const { MONGO_URI = 'mongodb://54.235.1.90:27017/talentsync', PORT = 5000 } = process.env;

if (!MONGO_URI) {
   console.error('Missing MONGO_URI in environment configuration.');
   process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request body

// API routes
app.use('/api', jobRoutes);
app.use('/api', companyRoutes);
app.use('/api', salarayRoutes);
app.use('/api', userRoutes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle React routing, return all requests to React app (except static files)
app.get('*', (req, res) => {
  // Don't serve index.html for static file requests
  if (req.path.includes('/js/') || req.path.includes('/css/') || req.path.includes('.')) {
    return res.status(404).send('File not found');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
