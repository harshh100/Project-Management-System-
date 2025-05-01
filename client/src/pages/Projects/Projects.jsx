import React, { useState, useEffect } from "react";
import { Button, Container, CircularProgress, Alert, Snackbar, IconButton, Tooltip } from "@mui/material";
import TableComponent from "../../components/Table/table.compoenent";
import Pagination from "../../components/Pagination/pagination.component";
import AddProjectForm from "../../components/Modal/AddProjectForm";
import { useNavigate } from "react-router";
import { apiService, commonService } from "../../services";
import dayjs from "dayjs";
import EditProjectForm from "../../components/Modal/EditProjectForm";
import { Edit as EditIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import loginReducer from "../../store/reducers/loginReducer";

const Projects = () => {
  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editingProject, setEditingProject] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { isAdmin } = useSelector((state) => state.login);



  const [page, setPage] = useState(1);
  const pageLimit = 10;
  const [pageInformation, setPageInformation] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.GetAPICall("getAllProjects", `?page=${page}&limit=${pageLimit}`);
        // console.log(response);
        if (response?.data) {
          // Ensure each row has a unique key
          const formattedRows = response.data.page_data.map(row => ({
            ...row,
            key: row.project_id // Add key property
          }));

          setRows(formattedRows);
          setPageInformation(response.data?.page_information || {});
          commonService.resetAPIFlag("getAllProjects", false);
        } else {
          setError("No projects found");
          commonService.resetAPIFlag("getAllProjects", false);
        }
      } catch (err) {
        setError(err.message);
        commonService.resetAPIFlag("getAllProjects", false);
      } finally {
        commonService.resetAPIFlag("getAllProjects", false);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page]);

  const handleEdit = async (projectId) => {
    try {
      // Find the project to edit
      const projectToEdit = rows.find(project => project.project_id === projectId);
      if (!projectToEdit) {
        setSnackbarMessage("Project not found");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Set the project data for editing
      setEditingProject({
        project_id: projectToEdit.project_id,
        project_name: projectToEdit.project_name,
        description: projectToEdit.description,
        start_date: dayjs(projectToEdit.start_date),
        due_date: dayjs(projectToEdit.due_date),
        status: projectToEdit.status,
        technology: projectToEdit.technology
      });

      // Open the edit modal
      setEditModalOpen(true);
    } catch (err) {
      setSnackbarMessage("Error preparing project for edit");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error preparing project for edit:", err);
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      const body = {
        project_id: editingProject.project_id,
        project_name: formData.project_name,
        description: formData.description,
        start_date: formData.start_date,
        due_date: formData.due_date,
        status: formData.status,
        technology: formData.technology,
      };

      const response = await apiService.PutAPICall(
        "updateProject",
        body
      );

      if (response.status === 1 || response.message === "Project updated successfully") {
        setSnackbarMessage(response.message || "Project updated successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Refresh projects list
        const updatedResponse = await apiService.GetAPICall(
          "getAllProjects",
          `?page=${page}&limit=${pageLimit}`
        );
        setRows(updatedResponse.data?.page_data || []);
        setPageInformation(updatedResponse.data?.page_information || {});
      } else {
        setSnackbarMessage(response.message || "Failed to update project");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Error in updating project");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error in updating project:", err);
    } finally {
      commonService.resetAPIFlag("updateProject", false);
      commonService.resetAPIFlag("getAllProjects", false);
      setEditModalOpen(false);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this project?')) {
        return;
      }

      const response = await apiService.DeleteAPICall("deleteProject", projectId);

      if (response.status === 1) {
        setSnackbarMessage(response.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Refresh projects list
        const updatedResponse = await apiService.GetAPICall("getAllProjects", `?page=${page}&limit=${pageLimit}`);
        setRows(updatedResponse.data?.page_data || []);
        setPageInformation(updatedResponse.data?.page_information || {});
      } else {
        setSnackbarMessage(response.message || "Failed to delete project");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Error in deleting project");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error in deleting project:", err);
    }
  };
  const handleProjectSubmit = async (formData) => {
    try {
      const body = {
        project_name: formData.project_name,
        description: formData.description,
        start_date: formData.start_date,
        due_date: formData.due_date,
        status: "pending",
        technology: formData.technology,
      };

      const response = await apiService.PostAPICall("createProject", body);

      if (response.status === 1) {
        setSnackbarMessage(response.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        const updatedResponse = await apiService.GetAPICall("getAllProjects", `?page=${page}&limit=${pageLimit}`);

        setRows(updatedResponse.data?.page_data || []);
        setPageInformation(updatedResponse.data?.page_information || {});
      } else {
        setSnackbarMessage(response.message || "Failed to create project");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Error in creating project");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error in creating project:", err);
    } finally {
      commonService.resetAPIFlag("createProject", false);
      commonService.resetAPIFlag("getAllProjects", false);

    }
    setOpenModal(false);
  };

  const handleClick = (project_id) => {
    if (project_id) {
      navigate(`/management/projects/details/${project_id}`);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const columns = [
    { field: "project_id", headerName: "ID" },
    { field: "project_name", headerName: "Project Name" },
    { field: "status", headerName: "Status" },
    {
      field: "start_date",
      headerName: "Start Date",
      renderCell: (params) => dayjs(params.value).format("DD-MM-YYYY")
    },
    {
      field: "due_date",
      headerName: "Due Date",
      renderCell: (params) => dayjs(params.value).format("DD-MM-YYYY")
    },
    { field: "technology", headerName: "Technology" },
    ...(isAdmin
      ? [
        {
          field: "actions",
          headerName: "Actions",
          renderCell: (params) => {
            console.log(params.row);

            return (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(params.row.project_id);
                    }}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(params.row?.project_id);
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )
          },
        },
      ]
      : []),
  ];

  return (
    <Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {
        isAdmin &&
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenModal(true)}>
          Add Project
        </Button>
      }

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <TableComponent
              rows={rows}
              columns={columns}
              handleClick={handleClick}
              // handleDelete={handleDeleteProject}
              // handleEdit={handleEdit}
              getRowId={(row) => row.project_id}
            />
          </div>
          <div style={{ padding: "20px" }}>
            <Pagination
              pageInformation={pageInformation}
              page={page}
              setPage={setPage}
              totalPages={pageInformation?.last_page}
            />
          </div>
        </>
      )}

      <AddProjectForm open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleProjectSubmit} />
      {editingProject && (
        <EditProjectForm
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingProject(null);
          }}
          onSubmit={handleEditSubmit}
          initialValues={editingProject}
        />
      )}
    </Container>
  );
};

export default Projects;