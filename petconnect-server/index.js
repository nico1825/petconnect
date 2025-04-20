const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.send('PetConnect backend is alive! 🐾');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3001;

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const userRoutes = require('./routes/userRoutes');
const shelterStaffRoutes = require('./routes/shelterStaffRoutes');
const adoptionListingRoutes = require('./routes/adoptionListingRoute');
const lostPetPostRoutes = require('./routes/lostPetPostRoute');
app.use('/api/adoptions', adoptionListingRoutes);
app.use('/api/lostpets', lostPetPostRoutes);
app.use('/api/shelter', shelterStaffRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
 // <-- This is critical
