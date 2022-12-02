import Service from './Service';

export default {
  state: {
    activeFormItem: {},
    rightForm: {},
    cardList: [],
    showHoverStyle: true,
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
      const { data } = await Service.getApps(params);
      this.save({
        apps: data,
      });
      return data;
    },
  },
};
