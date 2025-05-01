import React, { useState, useEffect } from "react";
import { Button, Container, CircularProgress, Alert, Snackbar, IconButton, Tooltip } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import TableComponent from "../../components/Table/table.compoenent";
import Pagination from "../../components/Pagination/pagination.component";
import { apiService, commonService } from "../../services";
import AddEmployeeForm from "../../components/Modal/AddEmployeeForm"

import UpdateEmployeeForm from "../../components/Modal/UpdateEmployeeForm";
import { apiBase } from "../../constants";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";

const Employee = () => {
  const [employees, setEmployees] = useState([]);

  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [dropdownLoading, setDropdownLoading] = useState(true);

  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [page, setPage] = useState(1);
  const pageLimit = 10;
  const [pageInformation, setPageInformation] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const { isAdmin } = useSelector((state) => state.login);

  useEffect(() => {
    const fetchEmployees = async () => {

      setEmployeeLoading(true);
      try {
        const response = await apiService.GetAPICall("getAllEmployees", `?page=${page}&limit=${pageLimit}`);
        if (response?.data?.page_data) {
          setEmployees(response.data.page_data);
          setPageInformation(response.data.page_information);
          commonService.resetAPIFlag("getAllEmployees", false);
        } else {
          console.log("setting error");

          setError("No employees found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        commonService.resetAPIFlag("getAllEmployees", false);
        setEmployeeLoading(false);
      }
    };

    fetchEmployees();
  }, [page]);

  useEffect(() => {
    fetchEmployeeDropList();
  }, []);

  const fetchEmployeeDropList = async () => {
    setDropdownLoading(true);
    try {
      const response = await apiService.GetAPICall("getEmployeeDropdownList");
      console.log(response);
      if (response?.data) {

        setEmployeeList(response.data.employees);

        commonService.resetAPIFlag("getEmployeeDropdownList", false);
      } else {
        // setError("No employees found djfsdjlsj");
        console.log("No employee found");

      }
    } catch (err) {
      setError(err.message);
    } finally {
      commonService.resetAPIFlag("getEmployeeDropdownList", false);
      setDropdownLoading(false);
    }
  }

  const handleEditClick = (employee) => {
    console.log("Employee : ", employee);

    setSelectedEmployee(employee);
    setOpenEditModal(true);
  };

  const handleUpdateEmployee = async (updatedData) => {
    try {
      const response = await apiService.PutAPICall("updateEmployee", updatedData);
      if (response.status === 1) {
        setSnackbarMessage(response.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        commonService.resetAPIFlag("updateEmployee", false);
        const updatedResponse = await apiService.GetAPICall("getAllEmployees", `?page=${page}&limit=${pageLimit}`);
        setEmployees(updatedResponse.data.page_data);
        setPageInformation(updatedResponse.data.page_information);
        commonService.resetAPIFlag("getAllEmployees", false);
      } else {
        commonService.resetAPIFlag("updateEmployee", false);
        throw new Error(response.message);
      }
    } catch (err) {
      setSnackbarMessage("Error updating employee");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      commonService.resetAPIFlag("updateEmployee", false);
    }
    setOpenEditModal(false);
  };

  // // Pagination state
  // const [page, setPage] = useState(1);
  // const pageLimit = 10;
  // const [pageInformation, setPageInformation] = useState({});

  const columns = [
    { field: "user_id", headerName: "ID" },
    { field: "name", headerName: "Full Name" },
    { field: "email", headerName: "Email" },
    { field: "mobile_no", headerName: "Mobile" },
    { field: "role", headerName: "Role" },
    { field: "technology", headerName: "Technology" },
    {
      field: "reporting_person",
      headerName: "Reporting Person",
      renderCell: (params) => params.row.reportingPerson?.name || "--",
    },
    ...(isAdmin
      ? [
        {
          field: "actions",
          headerName: "Actions",
          renderCell: (params) => {

            return (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(params.row);
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
                      handleDeleteEmployee(params.row?.user_id);
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
  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       setEmployeeLoading(true);
  //       const response = await apiService.GetAPICall(
  //         "getUsers",
  //         `?page=${page}&limit=${pageLimit}`
  //       );

  //       if (response?.data) {
  //         setEmployees(response.data.page_data || []);
  //         setPageInformation(response.data.page_information || {});
  //         commonService.resetAPIFlag("getUsers", false);
  //       } else {
  //         setError("No employees found");
  //         commonService.resetAPIFlag("getUsers", false);
  //       }
  //     } catch (err) {
  //       setError(err.message || "Failed to fetch employees");
  //       commonService.resetAPIFlag("getUsers", false);
  //     } finally {
  //       setEmployeeLoading(false);
  //       commonService.resetAPIFlag("getUsers", false);
  //     }
  //   };

  //   fetchEmployees();
  // }, [page]);

  const handleAddEmployee = async (formData) => {
    try {
      const response = await apiService.PostAPICall("adminCreateUser", formData);

      if (response.message) {
        setSnackbarMessage(response.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Refresh employee list
        const updatedResponse = await apiService.GetAPICall(
          "getAllEmployees",
          `?page=${page}&limit=${pageLimit}`
        );
        setEmployees(updatedResponse.data?.page_data || []);
        setPageInformation(updatedResponse.data?.page_information || {});
      } else {
        setSnackbarMessage("Failed to create employee");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage(err.message || "Error creating employee");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error creating employee:", err);
    } finally {
      commonService.resetAPIFlag("adminCreateUser", false);
      commonService.resetAPIFlag("getAllEmployees", false);
    }
  };


  const handleDeleteEmployee = async (employeeId) => {
    console.log(employeeId);

    try {
      if (!window.confirm('Are you sure you want to delete this employee?')) {
        return;
      }

      const response = await apiService.DeleteAPICall("deleteEmployee", employeeId);

      if (response.status === 1) {
        setSnackbarMessage(response.message || "Employee deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Refresh employee list
        const updatedResponse = await apiService.GetAPICall(
          "getUsers",
          `?page=${page}&limit=${pageLimit}`
        );
        commonService.resetAPIFlag("getUsers", false);

        setEmployees(updatedResponse.data?.page_data || []);
        setPageInformation(updatedResponse.data?.page_information || {});
      } else {
        setSnackbarMessage(response.message || "Failed to delete employee");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      commonService.resetAPIFlag("deleteEmployee", false);
      commonService.resetAPIFlag("getUsers", false);

    } catch (err) {
      commonService.resetAPIFlag("deleteEmployee", false);
      commonService.resetAPIFlag("getUsers", false);


      setSnackbarMessage("Error deleting employee");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error deleting employee:", err);
    } finally {
      commonService.resetAPIFlag("deleteEmployee", false);
      commonService.resetAPIFlag("getUsers", false);

    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Container>
      {/* Snackbar for Notifications */}
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

      {/* Add Employee Button for admin only*/}
      {
        isAdmin &&
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => setOpenModal(true)}
        >
          Add Employee
        </Button>
      }
      {/* Loading, Error, or Table */}
      {/* Conditional rendering for loading, error, or table */}
      {(employeeLoading || dropdownLoading) ? (
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
              rows={employees}
              columns={columns}
              isAdmin={isAdmin}
              // handleDelete={handleDeleteEmployee}
              getRowId={(row) => row.user_id}
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

      {/* Update Employee Modal */}
      <UpdateEmployeeForm open={openEditModal} onClose={() => setOpenEditModal(false)} onSubmit={handleUpdateEmployee} initialData={selectedEmployee} employeeList={employeeList} />
      {/* Add Employee Modal */}
      <AddEmployeeForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddEmployee}
      />
    </Container>
  );
};

export default Employee;