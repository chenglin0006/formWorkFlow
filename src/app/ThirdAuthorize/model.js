import Service from './Service';

export default {
  state: {
    data: {},
    apps: {}, // 初始化骨架屏空白占位
  },

  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    async getAppInfo(params) {
      return Service.getAppInfo(params);
    },

    async authGitlab(params) {
      return Service.authGitlab(params);
    },
  },
};
