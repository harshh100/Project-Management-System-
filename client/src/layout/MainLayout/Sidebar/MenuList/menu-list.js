import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccountTreeIcon from '@mui/icons-material/AccountTree'; 

const menuItem = {
  items: [
    {
      id: 'navigation',
      title: 'Materially',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/dashboard',
          icon: DashboardIcon,
        },
      ],
    },
    {
      id: 'management',
      title: 'Management',
      type: 'group',
      children: [
        {
          id: 'employees',
          title: 'Employees',
          type: 'item',
          url: '/management/employees',
          icon: PeopleIcon,
        },
        {
          id: 'projects',
          title: 'Projects',
          type: 'item',
          url: '/management/projects',
          icon: WorkIcon,
        },
        {
          id: 'my-tasks',
          title: 'My Tasks',
          type: 'item',
          url: '/management/my-tasks',
          icon: AssignmentTurnedInIcon,
        },
        {
          id: 'organization',
          title: 'Organization',
          type: 'item',
          url: '/management/organization',
          icon: AccountTreeIcon, 
        },
      ],
    },
  ],
};

export default menuItem;
