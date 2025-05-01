const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
    pool: { max: 5, min: 0 },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// Import models
const Project = require("../Models/Project")(sequelize, Sequelize);
const ProjectMembers = require("../Models/ProjectMembers")(sequelize, Sequelize);
const User = require("../Models/User")(sequelize, Sequelize);
const Card = require("../Models/Card")(sequelize, Sequelize);
const Task = require("../Models/Task")(sequelize, Sequelize);
const Comment = require("../Models/Comment")(sequelize, Sequelize);
const CommentFile = require("../Models/CommentFile")(sequelize, Sequelize);
const TaskTimeTracking = require("../Models/TaskTimeTracking")(sequelize, Sequelize);
const ManualTimeRequest = require("../Models/ManualTimeRequest")(sequelize, Sequelize); // ✅ NEW

// Define Many-to-Many Relationship for Projects
User.belongsToMany(Project, { through: ProjectMembers, foreignKey: "user_id" });
Project.belongsToMany(User, { through: ProjectMembers, foreignKey: "project_id" });

// Define Associations for Cards
Card.belongsTo(Project, { foreignKey: "project_id", onDelete: 'CASCADE' });
Card.belongsTo(User, { foreignKey: "created_by", as: "Creator", onDelete: 'CASCADE' });
Project.hasMany(Card, { foreignKey: "project_id", onDelete: 'CASCADE' });
User.hasMany(Card, { foreignKey: "created_by", onDelete: 'CASCADE' });

// Define Associations for Tasks
Card.hasMany(Task, { foreignKey: 'card_id', onDelete: 'CASCADE' });
Task.belongsTo(Card, { foreignKey: 'card_id', onDelete: 'CASCADE' });
Task.belongsTo(User, { as: 'Assignee', foreignKey: 'assign_to' });
Task.belongsTo(User, { as: 'Assigner', foreignKey: 'assign_by' });

// Define Associations for Comments
Comment.belongsTo(User, {
  foreignKey: 'sender',
  as: 'commentSender',
  onDelete: 'CASCADE'
});
User.hasMany(Comment, {
  foreignKey: 'sender',
  as: 'comments',
  onDelete: 'CASCADE'
});

// Define Associations for Comment Files
Comment.hasMany(CommentFile, {
  foreignKey: 'comment_id',
  as: 'files',
  onDelete: 'CASCADE'
});
CommentFile.belongsTo(Comment, {
  foreignKey: 'comment_id',
  as: 'comment',
  onDelete: 'CASCADE'
});

// Define Associations for TaskTimeTracking
Task.hasMany(TaskTimeTracking, {
  foreignKey: 'task_id',
  as: 'timeTrackings',
  onDelete: 'CASCADE'
});
TaskTimeTracking.belongsTo(Task, {
  foreignKey: 'task_id',
  as: 'task'
});
TaskTimeTracking.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// ✅ Define Associations for ManualTimeRequest
ManualTimeRequest.belongsTo(Task, {
  foreignKey: 'task_id',
  as: 'task',
  onDelete: 'CASCADE'
});
ManualTimeRequest.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});
Task.hasMany(ManualTimeRequest, {
  foreignKey: 'task_id',
  as: 'manualRequests',
  onDelete: 'CASCADE'
});
User.hasMany(ManualTimeRequest, {
  foreignKey: 'user_id',
  as: 'manualRequests',
  onDelete: 'CASCADE'
});

// Synchronize models if needed
// sequelize.sync({ alter: true })
//   .then(() => console.log("Database tables synced"))
//   .catch(err => console.error("Error syncing database:", err));

module.exports = {
  sequelize,
  User,
  Project,
  ProjectMembers,
  Card,
  Task,
  Comment,
  CommentFile,
  TaskTimeTracking,
  ManualTimeRequest,
};
