import Service from './Service';

export default {
  state: {
    data: {},
    bindAccounts: {},
    isTeamPage: false,
    existedPermissions: [],
    nonExistedPermissions: [],
    teamExistedPermissions: [],
    noteamExistedPermissions: [],
    leaderInfo: null,
    userInfo: null,
    teamList: [],
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
    async updateInfo(params) {
      return Service.updateInfo(params);
    },

    async sendCaptchSms(params) {
      return Service.sendCaptchSms(params);
    },

    async updatePassword(params) {
      return Service.updatePassword(params);
    },
    async bindApp(params) {
      return Service.bindApp(params);
    },

    async unbindApp(params) {
      return Service.unbindApp(params);
    },

    async unbindAccount(params) {
      return Service.unbindAccount(params);
    },

    async getBindAccounts(params) {
      const { data } = await Service.getBindAccounts(params);

      this.save({
        bindAccounts: data,
      });
      return data;
    },
    async getMyAuthInfo(params) {
      const { data } = await Service.getMyAuthInfo(params);
      const { existedPrivilegeGroupList = [], nonExistedPrivilegeGroupList = [], leaderJobNo, leaderName } = data || {};
      this.save({
        existedPermissions: existedPrivilegeGroupList,
        nonExistedPermissions: nonExistedPrivilegeGroupList,
        leaderInfo: {
          leaderName,
          leaderJobNo,
        },
      });
      console.log(data);
    },
    async getMyTeam(params) {
      try {
        const { data } = await Service.getMyTeam(params);
        this.save({
          teamList: data,
        });
      } catch (err) {
        this.save({
          teamList: [],
        });
      }
    },
    async getMyTeamMemberInfo(params) {
      const { data } = await Service.getMyTeamMemberInfo(params);
      const {
        existedPrivilegeGroupList = [],
        nonExistedPrivilegeGroupList = [],
        deptList = [],
        title,
        realname,
        username,
      } = data || {};
      this.save({
        teamExistedPermissions: existedPrivilegeGroupList,
        noteamExistedPermissions: nonExistedPrivilegeGroupList,
        userInfo: {
          deptList,
          title,
          realname,
          username,
        },
      });
    },
  },
};
