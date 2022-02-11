import { lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const UserList = lazy(() => import('./pages/Users/List'));
const RoleList = lazy(() => import('./pages/Users/Roles/List'));
const PermissionList = lazy(() => import('./pages/Users/Permissions/List'));

export default [
  {
    key: 'home',
    path: '/',
    element: <Home />,
  },
  {
    key: 'users',
    path: '/users',
    element: <UserList />,
  },
  {
    key: 'roles',
    path: '/users/roles',
    element: <RoleList />,
  },
  {
    key: 'permissions',
    path: '/users/permissions',
    element: <PermissionList />,
  },
];
