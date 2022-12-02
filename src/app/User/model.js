import Service from './Service';

export default {
  state: {
    forgetPassword: {},
  },
  reducers: {
    save(state, data) {
      return {
        ...state,
        ...data,
      };
    },
  },
  effects: {
    async getMobileByEmployeeNumber(params) {
      const res = await Service.getMobileByEmployeeNumber(params);

      if (res.success && res.data) {
        this.save({
          forgetPassword: {
            employeeNumber: params.employeeNumber,
            mobile: res.data,
          },
        });
      }

      return res;
    },

    async postRestSms(params) {
      return Service.postRestSms(params);
    },

    async resetPassword(params) {
      return Service.resetPassword(params);
    },

    // 修改初始密码
    async updateInitPassword(params) {
      return Service.updateInitPassword(params);
    },
  },
};
