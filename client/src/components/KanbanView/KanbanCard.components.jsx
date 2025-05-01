import { Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
import {
  IconButton,
  Chip,
  Avatar,
  Typography,
  Box,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import FlagIcon from "@mui/icons-material/Flag";
import CircleIcon from "@mui/icons-material/Circle";

// Priority color mapping
const priorityColors = {
  High: 'error',
  Medium: 'warning',
  Low: 'success'
};

// Status color mapping
const statusColors = {
  Pending: 'default',
  Inprogress: 'primary',
  'To be verified': 'secondary',
  Completed: 'success'
};

const TaskInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 15px;
  min-height: 106px;
  border-radius: 5px;
  max-width: 311px;
  background: white;
  margin-top: 15px;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
  }
`;

const TaskTitle = styled(Typography)`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TaskDescription = styled(Typography)`
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 4px;
  border-left: 2px solid #eee;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 8px;
`;

const DueDateText = styled(Typography)`
  font-size: 0.75rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const KanbanCard = ({ item, index, onDelete, onDoubleClick }) => {
  return (
    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onDoubleClick={onDoubleClick}
        >
          <TaskInformation>
            <CardHeader>
              <TaskTitle variant="subtitle1">
                {item.Task}
              </TaskTitle>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                sx={{
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(244, 67, 54, 0.08)'
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </CardHeader>

            <CardContent>
              {item.description && (
                <TaskDescription variant="body2">
                  {item.description}
                </TaskDescription>
              )}

              <Box display="flex" gap={1} flexWrap="wrap">
                {item.priority && (
                  <Tooltip title="Priority">
                    <Chip
                      icon={<FlagIcon fontSize="small" />}
                      label={item.priority}
                      size="small"
                      color={priorityColors[item.priority] || 'default'}
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Tooltip>
                )}

                {item.status && (
                  <Tooltip title="Status">
                    <Chip
                      icon={<CircleIcon fontSize="small" />}
                      label={item.status}
                      size="small"
                      color={statusColors[item.status] || 'default'}
                      sx={{
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
            </CardContent>

            <CardFooter>
              {item.Due_Date && (
                <DueDateText variant="caption">
                  Due: {new Date(item.Due_Date).toLocaleDateString("en-us", {
                    month: "short",
                    day: "2-digit",
                  })}
                </DueDateText>
              )}
              {item.assign_to && (
                <Tooltip title="Assigned to">
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: 'primary.light',
                      '& .MuiSvgIcon-root': {
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                </Tooltip>
              )}
            </CardFooter>
          </TaskInformation>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;