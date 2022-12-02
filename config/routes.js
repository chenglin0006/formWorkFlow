import Authorized from '@/app/Authorized';

export default [
  {
    path: '/thirdLogin',
    component: () => import(/* webpackChunkName: 'UserLayout' */ '@/app/ThirdLogin/Bind'),
  },
  // 便于本地调试单独的verify.html
  {
    path: '/debug/verify',
    component: () => import(/* webpackChunkName: 'UserLayout' */ '@/app/VerifyPage'),
  },
  // work
  {
    path: '/work',
    component: () => import(/* webpackChunkName: 'UserLayout' */ '@/app/Work'),
  },
  {
    path: '/exceptionError',
    component: () => import(/* webpackChunkName: 'UserLayout' */ '@/app/Result/Exception'),
  },
  {
    path: '/user',
    component: () => import(/* webpackChunkName: 'UserLayout' */ '../src/layouts/UserLayout'),
    routes: [
      { path: '/user', redirect: '/user/login' },
      {
        path: '/user/login',
        component: () => import(/* webpackChunkName: 'UserLayout' */ '@/app/User/Login'),
      },
      {
        path: '/user/forget-password',
        component: () => import(/* webpackChunkName: 'ForgetPassword' */ '@/app/User/ForgetPassword'),
      },
      {
        path: '/user/update-password',
        component: () => import(/* webpackChunkName: 'UpdatePassword' */ '@/app/User/UpdatePassword'),
      },
    ],
  },
  {
    path: '/oauth',
    component: () => import(/* webpackChunkName: 'UserLayout' */ '../src/layouts/UserLayout'),
    routes: [
      { path: '/oauth', redirect: '/oauth/authorize' },
      {
        path: '/oauth/authorize',
        name: '授权登录',
        icon: 'icon-home',
        component: () => import(/* webpackChunkName: 'ThirdAuthorize' */ '@/app/ThirdAuthorize'),
      },
    ],
  },
  {
    path: '/h5',
    component: () => import(/* webpackChunkName: 'SimpleLayout' */ '../src/layouts/h5/SimpleLayout'),
    Routes: [Authorized],
    authority: ['admin'],
    routes: [
      { path: '/h5', redirect: '/h5/homepage' },
      {
        path: '/h5/homepage',
        name: '首页',
        icon: 'icon-home',
        component: () => import(/* webpackChunkName: 'Homepage' */ '@/app/Homepage/h5'),
      },
      {
        path: '/h5/account',
        name: '我的账号',
        icon: 'icon-project',
        routes: [
          { path: '/h5/account', redirect: '/h5/account/info' },
          {
            path: '/h5/account/info',
            name: '个人信息',
            component: () => import('@/app/Account/Info/h5'),
          },
          {
            path: '/h5/account/bind-app',
            name: '关联应用',
            component: () => import('@/app/Account/BindApp/h5'),
          },

          {
            path: '/h5/account/password',
            name: '修改密码',
            component: () => import('@/app/Account/Password'),
          },
        ],
      },
    ],
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'SimpleLayout' */ '../src/layouts/pc/SimpleLayout'),
    Routes: [Authorized],
    authority: ['admin'],
    routes: [
      { path: '/', redirect: '/homepage' },
      {
        path: '/homepage',
        name: '首页',
        icon: 'icon-home',
        component: () => import(/* webpackChunkName: 'Homepage' */ '@/app/Homepage/pc'),
      },
      {
        path: '/appEdit',
        name: '应用变更',
        icon: 'icon-home',
        component: () => import('@/app/AppEdit/pc'),
      },
      {
        path: '/account',
        name: '我的账号',
        icon: 'icon-project',
        routes: [
          { path: '/account', redirect: '/account/info' },
          {
            path: '/account/info',
            name: '个人信息',
            component: () => import('@/app/Account/Info/pc'),
          },
          {
            path: '/account/bind-app',
            name: '关联应用',
            component: () => import('@/app/Account/BindApp/pc'),
          },

          {
            path: '/account/password',
            name: '修改密码',
            component: () => import('@/app/Account/Password'),
          },
          {
            path: '/account/permission',
            name: '我的权限',
            component: () => import('@/app/Account/Permission/pc'),
          },
          {
            path: '/account/team',
            name: '我的团队',
            component: () => import('@/app/Account/Team/pc'),
          },
          {
            path: '/account/assets',
            name: '我的资产',
            component: () => import('@/app/Account/MyAssets'),
          },
        ],
      },
    ],
  },
];
