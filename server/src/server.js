const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const checkMissedTrackers = require("./Helper/missedTrackerCheck"); 

// Load environment variables
dotenv.config();

const app = express();

// Allow requests from specific origins
app.use(cors({
  origin: process.env.CLIENT_URL, // Replace with your frontend's origin
  methods: 'GET,POST,PUT,DELETE',
  credentials: true // Allow cookies if needed
}));

// Middleware
app.use(express.json());

// Import routes
const userRoutes = require("./Routes/user.routes");
const projectRoutes = require("./Routes/project.routes");
const cardRoutes = require("./Routes/card.routes");
const taskRoutes = require("./Routes/task.routes");
const memberRoutes = require("./Routes/member.routes");
const commentRoutes = require("./Routes/comment.routes");
const organizationRoutes = require("./Routes/organization.routes");
const taskTimeTrackingRoutes = require("./Routes/taskTimeTracking.routes");
const manualTrackerReuestRoutes = require("./Routes/manualTimeRequest.routes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/organization-tree", organizationRoutes);
app.use("/api/task-time-tracking", taskTimeTrackingRoutes);
app.use("/api/manualTrackerRequest", manualTrackerReuestRoutes);

// Schedule cron job to check for missed trackers every midnight
cron.schedule("0 0 * * *", checkMissedTrackers); 

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
