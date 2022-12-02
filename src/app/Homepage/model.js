/*eslint-disable */
import store from '@/store/index';
import Service from './Service';

export default {
  state: {
    apps: {}, // 初始化骨架屏空白占位
    usedArray: [], // 常用应用
    appGroups: [],
    bannerInfo: [],
  },

  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },

    clear() {
      return {
        apps: {},
        usedArray: [],
      };
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

    async getRelateApps(params) {
      const { data } = await Service.getRelateApps(params);
      return data;
    },

    async getAppsGroup(params) {
      const p = params || {};
      p.poolId = store.getState().common.deptPoolId;
      const { data } = await Service.getAppsGroup(p);
      data.forEach((ele) => {
        const { appList = [] } = ele;
        (appList || []).forEach((i) => {
          i.appId = i.id;
        });
      });
      this.save({
        appGroups: data,
      });
      return data;
    },

    async goToApp(params) {
      const { data } = await Service.goToApp(params);
      return data;
    },

    // 编辑应用
    async editApps(params) {
      const { data } = await Service.editApps(params);
      return data;
    },
    // 获取常用应用
    async getUsedApps(params) {
      const { data } = await Service.getUsedApps(params);
      const list = data.map((ele) => {
        return { isNormal: true, ...ele };
      });
      this.save({
        usedArray: list,
      });
      return data;
    },

    // 获取广告位消息
    async getBannerInfo(params) {
      const { data } = await Service.getBannerInfo(params);
      if (data.list && Array.isArray(data.list)) {
        data.list.forEach((ele) => {
          ele.bannerObj = JSON.parse(ele.banner);
        });
        // let mock = [
        //   {id:1,bannerObj:{
        //     h5:'https://res1.bnq.com.cn/iam/auth-boot/notice/%E6%96%B0%E4%BA%BA%E5%BC%95%E5%AF%BC-h5.png'
        //   }},
        //   {id:2,bannerObj:{
        //     h5:'https://res1.bnq.com.cn/e1c98656-6539-44ab-9884-6d8bd5de0ef8'
        //   }}
        // ]
        this.save({
          bannerInfo: data.list,
        });
      }
      return data;
    },

    // 飞书消息链接跳首页根据参数决定是否调接口
    async ajaxRequest(params) {
      const res = await Service.ajaxRequest(params);
      return res;
    },

    // 自动注册
    async autoRegister(params) {
      const res = await Service.autoRegister(params);
      return res;
    },
  },
};
