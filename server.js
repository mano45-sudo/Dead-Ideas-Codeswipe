const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection string
const dbURI = 'YOUR_MONGODB_CONNECTION_STRING';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define Profile Schema
const profileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  bio: String,
  skills: String,
});

// Create Profile Model
const Profile = mongoose.model('Profile', profileSchema);

// Save profile route
app.post('/api/save-profile', async (req, res) => {
  try {
    const { firstName, lastName, username, bio, skills } = req.body;
    const newProfile = new Profile({ firstName, lastName, username, bio, skills });
    await newProfile.save();
    res.status(201).json({ message: 'Profile saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Get random profile route
app.get('/api/random-profile', async (req, res) => {
  try {
    const count = await Profile.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomProfile = await Profile.find().skip(randomIndex).limit(1);
    res.status(200).json(randomProfile[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
