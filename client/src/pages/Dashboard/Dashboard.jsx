import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { apiService, commonService } from "../../services"; // Adjust path as needed

const Dashboard = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState({
    employees: true,
    projects: true,
    tasks: true
  });
  const [error, setError] = useState({
    employees: null,
    projects: null,
    tasks: null
  });

  // Colors for Charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Fetch employee data
  const fetchEmployeeData = async () => {
    try {

      const response = await apiService.GetAPICall("getEmployeesData");
      if (response.data) {
        // Format data to match expected structure
        const formattedData = response.data.map(item => ({
          name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
          value: item.value
        }));
        setEmployeeData(formattedData);
      }
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setError(prev => ({ ...prev, employees: err.message }));
    } finally {
      commonService.resetAPIFlag("getEmployeesData", false);
      setLoading(prev => ({ ...prev, employees: false }));
    }
  };

  // Fetch project data
  const fetchProjectData = async () => {
    try {
      const response = await apiService.GetAPICall("getProjectsData");
      if (response.data) {
        // Format data to match expected structure
        const formattedData = response.data.map(item => ({
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          count: item.count
        }));
        setProjectData(formattedData);
      }
    } catch (err) {
      console.error("Error fetching project data:", err);
      setError(prev => ({ ...prev, projects: err.message }));
    } finally {
      commonService.resetAPIFlag("getProjectsData", false);
      setLoading(prev => ({ ...prev, projects: false }));
    }
  };

  // Fetch task data
  const fetchTaskData = async () => {
    try {
      const response = await apiService.GetAPICall("getTasksData");
      if (response.data) {
        setTaskData(response.data);
      }
    } catch (err) {
      console.error("Error fetching task data:", err);
      setError(prev => ({ ...prev, tasks: err.message }));
    } finally {
      commonService.resetAPIFlag("getTasksData", false);
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  useEffect(() => {
    fetchEmployeeData();
    fetchProjectData();
    fetchTaskData();
  }, []);

  if (loading.employees || loading.projects || loading.tasks) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography>Loading dashboard data...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>

        {/* Employees Count (Pie Chart) */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="h6">Employee Distribution</Typography>
            {error.employees ? (
              <Typography color="error">Error loading employee data</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={employeeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {employeeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Projects by Status (Bar Chart) */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="h6">Projects by Status</Typography>
            {error.projects ? (
              <Typography color="error">Error loading project data</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={projectData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
                  <Legend />
                  <Bar dataKey="count" fill="#3f51b5" name="Projects" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Tasks by Status (Donut Chart) */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="h6">Tasks Status Overview</Typography>
            {error.tasks ? (
              <Typography color="error">Error loading task data</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="value"
                    label
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
};

export default Dashboard;