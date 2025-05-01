const jwt = require("jsonwebtoken");
const { Card, Task, User, ProjectMembers, Project, sequelize } = require("../Database/config");
const { Sequelize, Op } = require('sequelize');

exports.createTask = async (req, res) => {
    const { card_id, title, description, due_date, position, priority } = req.body;

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database using the decoded email
        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has access to the card (either admin or project member)
        const card = await Card.findOne({ where: { card_id: card_id } });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        if (user.role !== "admin") {
            const projectMember = await ProjectMembers.findOne({
                where: {
                    [Op.and]: [{ user_id: user.user_id }, { project_id: card.project_id }]
                }
            });

            if (!projectMember) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        const newTask = await Task.create({
            card_id,
            title,
            description,
            due_date,
            position,
            priority,
        });

        res.status(201).json({
            message: "Task created successfully",
            data: newTask,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getTasks = async (req, res) => {
    const { card_id } = req.params;

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database using the decoded email
        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has access to the card (either admin or project member)
        const card = await Card.findOne({ where: { card_id: card_id } });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        if (user.role !== "admin") {
            const projectMember = await ProjectMembers.findOne({
                where: {
                    [Op.and]: [{ user_id: user.user_id }, { project_id: card.project_id }]
                }
            });

            if (!projectMember) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        const tasks = await Task.findAll({
            where: { card_id: card_id },
            order: [['position', 'ASC']] // Sort by 'position' in ascending order
        });

        res.status(200).json({ data: tasks });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.updateTask = async (req, res) => {
    const { task_id, title, description, due_date, position, priority, status, tags, assign_to_email } = req.body;
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the current user from the database
        const currentUser = await User.findOne({ where: { email: decodedToken.email } });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the task exists
        const task = await Task.findOne({ where: { task_id: task_id } });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check if the card exists
        const card = await Card.findOne({ where: { card_id: task.card_id } });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Check permissions (admin or project member)
        if (currentUser.role !== "admin") {
            const projectMember = await ProjectMembers.findOne({
                where: {
                    [Op.and]: [{ user_id: currentUser.user_id }, { project_id: card.project_id }]
                }
            });
            if (!projectMember) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        // Prepare update data
        const updateData = {
            title,
            description,
            due_date,
            position,
            priority,
            status,
            tag: JSON.stringify(tags),
            assign_by: currentUser.user_id // Set the assigner to current user
        };

        // Handle assignment if assign_to_email is provided
        if (assign_to_email) {
            const assigneeUser = await User.findOne({ where: { email: assign_to_email } });
            if (!assigneeUser) {
                return res.status(404).json({ message: "Assignee user not found" });
            }
            updateData.assign_to = assigneeUser.user_id;
        } else if (assign_to_email === null) {
            // Clear assignment if null is explicitly passed
            updateData.assign_to = null;
        }

        // Update the task
        await Task.update(updateData, { where: { task_id: task_id } });

        res.status(200).json({
            status: 1,
            message: "Task updated successfully",
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ status: 0, message: "Server error", error });
    }
};

exports.deleteTask = async (req, res) => {
    const { task_id } = req.params;

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database using the decoded email
        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has access to the task (either admin or project member)
        const task = await Task.findOne({ where: { task_id: task_id } });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const card = await Card.findOne({ where: { card_id: task.card_id } });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        if (user.role !== "admin") {
            const projectMember = await ProjectMembers.findOne({
                where: {
                    [Op.and]: [{ user_id: user.user_id }, { project_id: card.project_id }]
                }
            });

            if (!projectMember) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        await Task.destroy({ where: { task_id: task_id } });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.updateTaskPosition = async (req, res) => {

    const { taskId, newCardId, newPosition } = req.body;


    try {

        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database using the decoded email
        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        // Find the task to update
        const task = await Task.findOne({ where: { task_id: taskId } });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Find the new card to ensure it exists
        const newCard = await Card.findOne({ where: { card_id: newCardId } });
        if (!newCard) {
            return res.status(404).json({ message: "New card not found" });
        }

        if (user.role !== "admin") {
            const projectMember = await ProjectMembers.findOne({
                where: {
                    [Op.and]: [{ user_id: user.user_id }, { project_id: card.project_id }]
                }
            });

            if (!projectMember) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        // Fetch all tasks in the new card
        const tasksInNewCard = await Task.findAll({
            where: { card_id: newCardId },
            order: [["position", "ASC"]], // Sort by position
        });

        // Adjust positions of tasks in the new card to make space for the moved task
        for (let i = 0; i < tasksInNewCard.length; i++) {
            if (tasksInNewCard[i].position >= newPosition) {
                tasksInNewCard[i].position += 1; // Increment position
                await tasksInNewCard[i].save();
            }
        }

        // Update the task's card_id and position
        task.card_id = newCardId;
        task.position = newPosition;

        // Save the updated task
        await task.save();

        // Return success response
        res.status(200).json({ message: "Task position updated successfully" });
    } catch (error) {
        console.error("Error updating task position:", error);
        res.status(500).json({ message: "Failed to update task position" });
    }

};

exports.getUserTasks = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Verify the requesting user matches the token
        const user = await User.findOne({ where: { email: decodedToken.email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const user_id = user.user_id;

        const tasks = await Task.findAll({
            where: { assign_to: user_id },
            include: [
                {
                    model: Card,
                    attributes: ['card_id', 'title', 'project_id'],
                    include: [
                        {
                            model: Project,
                            attributes: ['project_id', 'project_name']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'Assigner',
                    attributes: ['user_id', 'name', 'email'],
                    foreignKey: 'assign_by'
                }
            ],
            order: [
                ['position', 'ASC'] // Sort tasks by position
            ]
        });

        // Format the response to include project, card, and assigner information
        const formattedTasks = tasks.map(task => ({
            task_id: task.task_id,
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            position: task.position,
            priority: task.priority,
            status: task.status,
            assign_by: task.Assigner ? task.Assigner.name : null, // Use assigner's name instead of ID
            assign_to: task.assign_to,
            created_at: task.created_at,
            updated_at: task.updated_at,
            card: {
                card_id: task.Card.card_id,
                title: task.Card.title,
                project: {
                    project_id: task.Card.Project.project_id,
                    project_name: task.Card.Project.project_name
                }
            }
        }));

        res.status(200).json({ data: formattedTasks });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getTaskDetails = async (req, res) => {
    const { task_id } = req.params;

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the current user from the database
        const currentUser = await User.findOne({ where: { email: decodedToken.email } });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch the task with associated card and project information
        const task = await Task.findOne({
            where: { task_id: task_id },
            include: [
                {
                    model: Card,
                    attributes: ['project_id'],
                },
                {
                    model: User,
                    as: 'Assignee',
                    attributes: ['user_id', 'name', 'email'],
                    required: false,
                    where: { user_id: Sequelize.col('task.assign_to') }
                },
                {
                    model: User,
                    as: 'Assigner',
                    attributes: ['user_id', 'name', 'email'],
                    required: false,
                    where: { user_id: Sequelize.col('task.assign_by') }
                }
            ],
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check permissions (admin or project member)
        if (currentUser.role !== "admin") {
            const projectMember = await ProjectMembers.findOne({
                where: {
                    [Op.and]: [
                        { user_id: currentUser.user_id },
                        { project_id: task.Card.project_id }
                    ]
                }
            });

            if (!projectMember) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        // Format the assign_by and assign_to data
        const assign_by = task.Assigner ? {
            user_id: task.Assigner.user_id,
            name: task.Assigner.name,
            email: task.Assigner.email
        } : null;

        const assign_to = task.Assignee ? {
            user_id: task.Assignee.user_id,
            name: task.Assignee.name,
            email: task.Assignee.email
        } : null;

        // Format the response with all task details
        const response = {
            project_id: task.Card.project_id,
            title: task.title,
            task_id: task.task_id,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assign_by,
            assign_to,
            due_date: task.due_date,
            position: task.position,
            tags: task.tag ? JSON.parse(task.tag) : [],
            created_at: task.created_at,
            updated_at: task.updated_at,
        };

        res.status(200).json({
            status: 1,
            message: "Task details fetched successfully",
            data: response
        });

    } catch (error) {
        console.error("Error fetching task details:", error);
        res.status(500).json({
            status: 0,
            message: "Server error",
            error: error.message
        });
    }
};

exports.getTasksData = async (req, res) => {
    try {
        // Verify the token and get user info
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // For admin, get all tasks. For regular users, get only tasks from projects they're members of
        let whereClause = {};

        if (user.role !== "admin") {
            // Get all project IDs where the user is a member
            const userProjects = await ProjectMembers.findAll({
                where: { user_id: user.user_id },
                attributes: ['project_id'],
                raw: true
            });

            const projectIds = userProjects.map(p => p.project_id);

            // Get all card IDs from these projects
            const projectCards = await Card.findAll({
                where: { project_id: { [Op.in]: projectIds } },
                attributes: ['card_id'],
                raw: true
            });

            const cardIds = projectCards.map(c => c.card_id);

            whereClause = { card_id: { [Op.in]: cardIds } };
        }

        // Group tasks by status and count them
        const taskData = await Task.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('task_id')), 'value']
            ],
            where: whereClause,
            group: ['status'],
            raw: true
        });

        // Format the response with all possible statuses (even those with zero counts)
        const allStatuses = ["Pending", "In progress", "To be verified", "Completed"];

        const formattedData = allStatuses.map(status => {
            const found = taskData.find(item => item.status === status);
            return {
                name: status,
                value: found ? parseInt(found.value) : 0
            };
        });

        res.status(200).json({ data: formattedData });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};