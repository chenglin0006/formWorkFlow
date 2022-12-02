import Service from './Service';
import data from './data.json';

// const config = data.data.nodeConfig;

export default {
  state: {
    flowConfig: {
      nodeName: '发起人',
      type: 0,
      flowPermission: '',
    },
  },

  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },

    clear() {
      return {};
    },
  },

  effects: {
    async getApps(params) {
      const { data: d } = await Service.getApps(params);
      data.data.nodeConfig = d;
      this.save({
        flowConfig: data.data.nodeConfig,
      });
      return d;
    },
  },
};
