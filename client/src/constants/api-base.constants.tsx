export const apiBase: any = {
    apiUrl: import.meta.env.VITE_GATEWAY,

    userLogin: "api/users/login",
    userSignUp: "api/users/signup",
    resendVerificationEmail: "api/users/resend-verification-email",
    verifyEmail: "api/users/verify-email",
    forgotPassword: "api/users/forgot-password",
    resetPassword: "api/users/reset-password",
    validateToken: "api/users/validate-token",
    adminCreateUser: "api/users/admin/create-user",
    deleteEmployee: "api/users/employees/",

    getAllEmployees: "api/users/employees",
    updateEmployee: "api/users/update",
    getEmployeeDropdownList: "api/users/employee-dropdown",

    createProject: "api/project/create",
    getAllProjects: "api/project/all-project",
    getProject: "api/project/",
    deleteProject: "api/project/",
    updateProject: "api/project",
    getUsersForMember: "api/project/getuser/formember",

    getProjectsData: "api/project/project-data",
    getTasksData: "api/task/tasks/data",
    getEmployeesData: "api/member/employee-data",

    getCard: "api/card/",
    createCard: "api/card/create",
    getTask: "api/task/",
    updateCard: "api/card/update",
    deleteCard: "api/card/",
    updateTaskPosition: "api/task/tasks/updateTaskPosition",
    createTask: "api/task/create",
    deleteTask: "api/task/",
    updateTask: "api/task",
    startTimeTracking: "api/task-time-tracking/start",
    stopTimeTracking: "api/task-time-tracking/stop",
    getReportTimeTracking: "api/task-time-tracking/report",
    getActiveTimeTracking: "api/task-time-tracking/active",

    getTaskDetails: "api/task/task-details/",
    getUserTasks: "api/task/user/tasks",
    createComment: "api/comment/create",
    getComments: "api/comment/task/",

    getUsers: "api/member",
    getProjectMembers: "api/project/get-project-members/",
    addProjectMembers: "api/project/add-member-to-project",
    removerProjectMembers: "api/project/remove-member-from-project",
    getOrganizationTree: "api/organization-tree",

    submitManualTimeTracking:"api/manualTrackerRequest/manual-request/send",
    getAllManualTimeRequests:"api/manualTrackerRequest/manual-request/",
    updateManualTimeRequestStatus:"api/manualTrackerRequest/manual-request-action",

    getMissedTracker:"api/task-time-tracking/missed-tracker"
};
