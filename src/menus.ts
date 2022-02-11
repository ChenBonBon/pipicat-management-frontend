export default [
  {
    key: 'home',
    path: '/',
    title: '首页',
  },
  {
    key: 'users',
    title: '用户管理',
    path: '/users',
    children: [
      {
        key: 'users',
        path: '/',
        title: '用户管理',
      },
      {
        key: 'roles',
        path: '/roles',
        title: '角色管理',
      },
      {
        key: 'permissions',
        path: '/permissions',
        title: '权限管理',
      },
    ],
  },
];
