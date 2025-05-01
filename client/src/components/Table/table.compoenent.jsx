import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const TableComponent = ({
  rows = [],
  columns = [],
  handleClick,
  handleDelete,
  handleEdit,
  handleView,
  getRowId = (row) => row.id || row.key,
  emptyMessage = "No Data Found",
  isAdmin = false,
}) => {
  const hasActions = handleDelete || handleEdit || handleView;

  return (
    <TableContainer
      component={Paper}
      sx={{
        overflowX: "auto",
        borderRadius: 2,
        '& .MuiTableCell-root': {
          padding: '12px 16px'
        }
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.light }}>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                sx={{
                  color: (theme) => theme.palette.primary.contrastText,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: '0.875rem'
                }}
              >
                {col.headerName}
              </TableCell>
            ))}
            {hasActions && (
              <TableCell
                sx={{
                  color: (theme) => theme.palette.primary.contrastText,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: '0.875rem'
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: (theme) => theme.palette.action.hover
                  },
                  backgroundColor: (theme) =>
                    rows.indexOf(row) % 2 === 0
                      ? theme.palette.background.default
                      : theme.palette.action.selected
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={`${getRowId(row)}-${col.field}`}
                    onClick={() => handleClick?.(getRowId(row))}
                    sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      sx:"12px" //Maybe need to remove conflict occur
                    }}
                  >
                    {col.renderCell ? col.renderCell({ value: row[col.field], row }) : row[col.field]}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Box display="flex" gap={1}>
                      {handleView && (
                        <Tooltip title="View">
                          <IconButton
                            aria-label="view"
                            color="info"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(getRowId(row));
                            }}
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {(handleEdit && isAdmin) && (
                        <Tooltip title="Edit">
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(getRowId(row));
                            }}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {(handleDelete && isAdmin) && (
                        <Tooltip title="Delete">
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(getRowId(row));
                            }}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (hasActions ? 1 : 0)}
                align="center"
                sx={{ py: 4 }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;