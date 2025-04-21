const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  console.log(`➡️ [${req.method}] ${req.originalUrl}`);
  next();
});

const authRoutes = require("./petconnect-server/routes/authRoutes");
const petRoutes = require("./petconnect-server/routes/petRoutes");
const userRoutes = require("./petconnect-server/routes/userRoutes");
const shelterStaffRoutes = require("./petconnect-server/routes/shelterStaffRoutes");
const adoptionListingRoutes = require("./petconnect-server/routes/adoptionListingRoute");
const lostPetPostRoutes = require("./petconnect-server/routes/lostPetPostRoute");
app.use("/api/adoptions", adoptionListingRoutes);
app.use("/api/lostpets", lostPetPostRoutes);
app.use("/api/shelter", shelterStaffRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🐾 PetConnect backend is alive and online!");
});
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.originalUrl);
  next();
});

app.get("/test", (req, res) => {
  res.send("PetConnect backend is alive! 🐾");
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});


