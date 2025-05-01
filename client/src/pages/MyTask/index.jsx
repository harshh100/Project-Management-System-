import React, { useState, useEffect } from "react";
import {
  Container,
  Tabs,
  Tab,
  Paper,
  Divider,
  Chip,
  Button,
  Box,
  Typography
} from "@mui/material";
import TableComponent from "../../components/Table/table.compoenent";
import { useNavigate } from "react-router-dom";
import { apiService, commonService } from "../../services";
import { IconButton, Tooltip } from "@mui/material";
import { AddCircle, PlayArrow, Stop } from "@mui/icons-material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ManualTrackerModal from "../../components/Modal/ManualTrackerForm";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";




dayjs.extend(duration);

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [runningTask, setRunningTask] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [activeTracking, setActiveTracking] = useState(null);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [manualTimeData, setManualTimeData] = useState({
    taskId: null,
    startTime: "",
    endTime: "",
    reason: "",
  });


  const location = useLocation();
  const from = location.state?.from;
  const missedTrackerData = location.state?.data;

  useEffect(() => {
    if (from === "manualTimeRequestPage" && missedTrackerData) {
      console.log(missedTrackerData);
    }
  }, [from, missedTrackerData]);


  // Open modal for manual time request
  const handleOpenModal = (taskId) => {
    setManualTimeData({ ...manualTimeData, taskId });
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle form submission
  const handleSubmitManualTracker = async (values) => {
    const loadingToast = toast.loading('Submitting manual time entry...');

    try {
      const body = {
        task_id: values.task_id,
        date: values.date,
        start_time: values.start_time,
        end_time: values.end_time,
        reason: values.reason
      };

      const response = await apiService.PostAPICall("submitManualTimeTracking", body);

      switch (response.status) {
        case 1:
          toast.success(response.message, { id: loadingToast });
          setOpenModal(false);
          break;
        case 0:
          toast.error(response.message, { id: loadingToast });
          break;
        default:
          toast.error("Unexpected response", { id: loadingToast });
          throw new Error("Unexpected response status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit manual tracker", {
        id: loadingToast,
      });
      console.error("Manual tracker error:", error);
    } finally {
      commonService.resetAPIFlag("submitManualTimeTracking", false);
    }
  };



  const taskStatuses = ["Pending", "In progress", "To Be Verified", "Completed"];

  useEffect(() => {
    fetchTasks();
    checkActiveTracking();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiService.GetAPICall("getUserTasks");
      if (response.data) {
        setTasks(response.data);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      commonService.resetAPIFlag("getUserTasks", false);
      setLoading(false);
    }
  };

  const checkActiveTracking = async () => {
    try {
      const response = await apiService.GetAPICall("getActiveTimeTracking");
      console.log("Active Tracking Response:", response);

      if (response.status === 1 && response.data) {
        const trackingData = response.data;

        // Create a proper task object structure that matches your frontend expectations
        const taskData = {
          task_id: trackingData.task_id,
          title: trackingData.task?.title || "Unknown Task",
          card: {
            project: {
              project_name: "Unknown Project" // You might want to include this in your backend response
            }
          }
        };

        setActiveTracking(trackingData);
        setRunningTask(taskData);

        // Calculate elapsed seconds if tracking is active
        if (trackingData.start_time && !trackingData.end_time) {
          const startTime = dayjs(trackingData.start_time);
          const now = dayjs();
          setSecondsElapsed(now.diff(startTime, 'second'));
        } else {
          setSecondsElapsed(0);
        }
      } else {
        // No active tracking
        setActiveTracking(null);
        setRunningTask(null);
        setSecondsElapsed(0);
      }
    } catch (err) {
      console.error("Error checking active tracking:", err);
      setActiveTracking(null);
      setRunningTask(null);
      setSecondsElapsed(0);
    } finally {
      commonService.resetAPIFlag("getActiveTimeTracking", false);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeTracking && !activeTracking.end_time) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setSecondsElapsed(0);
    }
    return () => clearInterval(interval);
  }, [activeTracking]);

  const formatTime = (seconds) => {
    const dur = dayjs.duration(seconds, "seconds");
    return `${String(dur.hours()).padStart(2, "0")}:${String(dur.minutes()).padStart(2, "0")}:${String(dur.seconds()).padStart(2, "0")}`;
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const startTracking = async (taskId) => {
    try {
      const response = await apiService.PostAPICall("startTimeTracking", { task_id: taskId });
      console.log("response", response);
      if (response.data) {
        await checkActiveTracking();
        fetchTasks();
      }
    } catch (err) {
      console.error("Error starting tracking:", err);
      alert(err.response?.data?.message || "Failed to start tracking");
    } finally {
      commonService.resetAPIFlag("startTimeTracking", false);
    }
  };

  const stopTracking = async () => {
    if (!activeTracking) return;

    try {
      const response = await apiService.PostAPICall("stopTimeTracking", {
        task_id: activeTracking.task.task_id
      });
      if (response.data) {
        setActiveTracking(null);
        setRunningTask(null);
        fetchTasks();
      }
    } catch (err) {
      console.error("Error stopping tracking:", err);
      alert(err.response?.data?.message || "Failed to stop tracking");
    } finally {
      commonService.resetAPIFlag("stopTimeTracking", false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const normalizedStatus = task.status.toLowerCase().replace(/\s+/g, " ");
    const normalizedTabStatus = taskStatuses[selectedTab].toLowerCase().replace(/\s+/g, " ");
    return normalizedStatus === normalizedTabStatus;
  });

  const getPriorityChip = (priority) => {
    let color = "default";
    switch (priority) {
      case "High":
        color = "error";
        break;
      case "Medium":
        color = "warning";
        break;
      case "Low":
        color = "success";
        break;
      default:
        color = "default";
    }
    return <Chip label={priority} color={color} size="small" />;
  };

  const columns = [
    { field: "index", headerName: "#" },
    { field: "title", headerName: "Task Title" },
    { field: "due_date", headerName: "Due Date" },
    { field: "project_name", headerName: "Project" },
    { field: "card_title", headerName: "Stage" },
    {
      field: "priority",
      headerName: "Priority",
      renderCell: (params) => getPriorityChip(params.value),
    },
    { field: "assign_by", headerName: "Assigned By" },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        const isRunning = activeTracking?.task?.task_id === params.row.task_id;
        const isAnyRunning = activeTracking && !activeTracking.end_time;

        return (
          <>
            <Tooltip title={isRunning ? "Stop Task" : "Start Task"}>
              <IconButton
                size="small"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (isRunning) {
                    await stopTracking();
                  } else {
                    if (isAnyRunning) {
                      alert("Please stop the currently running task first");
                      return;
                    }
                    await startTracking(params.row.task_id);
                  }
                }}
                sx={{
                  border: "1px solid #ccc",
                  width: 32,
                  height: 32,
                  color: isRunning ? "error.main" : "primary.main"
                }}
              >
                {isRunning ? <Stop fontSize="small" /> : <PlayArrow fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Request Manual Tracker">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(params.row.task_id);
                }}
                sx={{
                  border: "1px solid #ccc",
                  width: 32,
                  height: 32,
                  color: "primary.main"
                }}
              >
                <AddCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          </>

        );
      },
    },
  ];

  const rows = filteredTasks.map((task, index) => ({
    ...task,
    index: index + 1,
    project_name: task.card?.project?.project_name || "N/A",
    project_id: task.card?.project?.project_id || "N/A",
    card_title: task.card?.title || "N/A",
    assign_by_name: task.assign_by?.name || "N/A",
  }));

  const handleClick = (task_id) => {
    const task = tasks.find((t) => t.task_id === task_id);
    if (task?.card?.project?.project_id) {
      navigate(`/management/projects/details/${task.card.project.project_id}`);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Container sx={{ backgroundColor: "white", borderRadius: "12px", padding: "10px" }}>
        <Paper sx={{ padding: 2, borderRadius: "12px", backgroundColor: "white", boxShadow: "none" }}>
          {/* Task Tracker UI */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: 2,
              mb: 3,
            }}
          >
            {activeTracking && !activeTracking.end_time ? (
              <>
                <Typography variant="subtitle1" fontWeight={600}>
                  {activeTracking.task?.title || "Current Task"}
                </Typography>
                <Box sx={{ display: "flex", gap: 4, alignItems: "center", pl: 4, borderLeft: "2px solid #ccc" }}>
                  <Typography color="#f47e53">
                    {activeTracking.task?.card?.project?.project_name || "--"}
                  </Typography>
                  <Typography variant="h5" width={100}>
                    {formatTime(secondsElapsed)}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Stop />}
                    onClick={stopTracking}
                  >
                    Stop
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No task being tracked currently
              </Typography>
            )}
          </Box>

          {/* Tabs */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {taskStatuses.map((status, index) => (
              <Tab key={index} label={status} />
            ))}
          </Tabs>

          <Divider sx={{ mb: 2 }} />

          <div style={{ marginTop: "20px", overflowX: "auto" }}>
            {loading ? (
              <div>Loading tasks...</div>
            ) : (
              <TableComponent
                rows={rows}
                columns={columns}
                emptyMessage={`No ${taskStatuses[selectedTab]} tasks found`}
                getRowId={(row) => row.task_id}
                handleClick={handleClick}
              />
            )}
          </div>
          <ManualTrackerModal
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={handleSubmitManualTracker}
            taskId={manualTimeData.taskId}
          />

        </Paper>
      </Container>
    </>

  );
};

export default MyTasks;