export default {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/setting',
        handler: 'controller.getSettings',
        config: {
          policies: ['admin::isAuthenticatedAdmin']
        },
      },
      {
        method: 'POST',
        path: '/setting',
        handler: 'controller.setSettings',
        config: {
          policies: ['admin::isAuthenticatedAdmin']
        },
      }
    ],
  },
};


