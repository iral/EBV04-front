import { createBrowserRouter } from 'react-router';
import LoginNew from './components/auth/LoginNew';
import RegisterNew from './components/auth/RegisterNew';
import PasswordRecovery from './components/auth/PasswordRecovery';
import MainDashboard from './components/dashboard/MainDashboard';
import ProjectDetailNew from './components/project/ProjectDetailNew';
import CreateProjectNew from './components/project/CreateProjectNew';
import MyProjects from './components/project/MyProjects';
import MessagesPage from './components/messages/MessagesPage';
import NotificationsPage from './components/notifications/NotificationsPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ProfilePage from './components/profile/ProfilePage';

// Legacy components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateProject from './components/CreateProject';
import ProjectDetail from './components/ProjectDetail';
import PrototypeIndex from './components/prototypes/PrototypeIndex';
import DashboardV1 from './components/prototypes/DashboardV1';
import DashboardV2 from './components/prototypes/DashboardV2';
import DashboardV3 from './components/prototypes/DashboardV3';
import DashboardV4 from './components/prototypes/DashboardV4';
import DashboardFigma from './components/DashboardFigma';
import CreateProjectFigma from './components/CreateProjectFigma';
import ProjectDetailFigma from './components/ProjectDetailFigma';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginNew,
  },
  {
    path: '/register',
    Component: RegisterNew,
  },
  {
    path: '/recovery',
    Component: PasswordRecovery,
  },
  {
    path: '/dashboard',
    Component: MainDashboard,
  },
  {
    path: '/create-project',
    Component: CreateProjectNew,
  },
  {
    path: '/edit-project/:id',
    Component: CreateProjectNew,
  },
  {
    path: '/project/:id',
    Component: ProjectDetailNew,
  },
  {
    path: '/my-projects',
    Component: MyProjects,
  },
  {
    path: '/messages',
    Component: MessagesPage,
  },
  {
    path: '/notifications',
    Component: NotificationsPage,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
  {
    path: '/admin/users',
    Component: AdminDashboard,
  },
  {
    path: '/admin/analytics',
    Component: AdminDashboard,
  },
  {
    path: '/profile',
    Component: ProfilePage,
  },
  {
    path: '/settings',
    Component: ProfilePage,
  },
  // Legacy routes
  {
    path: '/old-login',
    Component: Login,
  },
  {
    path: '/old-register',
    Component: Register,
  },
  {
    path: '/old-dashboard',
    Component: Dashboard,
  },
  {
    path: '/dashboard-figma',
    Component: DashboardFigma,
  },
  {
    path: '/create-project-figma',
    Component: CreateProjectFigma,
  },
  {
    path: '/project-figma/:id',
    Component: ProjectDetailFigma,
  },
  {
    path: '/prototypes',
    Component: PrototypeIndex,
  },
  {
    path: '/prototype/v1',
    Component: DashboardV1,
  },
  {
    path: '/prototype/v2',
    Component: DashboardV2,
  },
  {
    path: '/prototype/v3',
    Component: DashboardV3,
  },
  {
    path: '/prototype/v4',
    Component: DashboardV4,
  },
]);
