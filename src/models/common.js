import { Modal } from 'antd';
import { setAuthority } from '@/util/authority';
import { reloadAuthorized } from '@/util/Authorized';
import CommonService from '@/service/CommonService';
import history from '@/router/history';
import { getQueryPath } from '@/util/common';
import { Tools } from '@/util';
import { defaultAvatar } from 'config/config';

const Services = new CommonService();

// 互踢参数设置
const setHutiParams = (paramsT) => {
  const params = paramsT || {};
  // 接口加参数baseUrl-- 应用级别互踢设置需求
  let redirectUrl = localStorage.getItem('redirectUrl') || '';
  if (redirectUrl) {
    redirectUrl = decodeURIComponent(redirectUrl);
  }
  // 如果是跳转到芝麻内部的链接，不用传baseUrl
  const outLink = ['localhost.bnq.com.cn', 'z-dev.bnq.com.cn', 'z-test.bnq.com.cn', 'z.bnq.com.cn'];
  let ifInOutLink = false;
  outLink.forEach((ele) => {
    if (redirectUrl.indexOf(ele) > -1) {
      ifInOutLink = true;
    }
  });
  if (redirectUrl && !ifInOutLink) {
    params.baseUrl = redirectUrl;
  }
  return params;
};

export default {
  state: {
    currentUser: {},
    deptPoolId: 2, // 用户池id
    unlock: false, // 是否显示密码登陆
    type: 'mobile', // tab active
  },
  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
    saveType(state, type) {
      return {
        ...state,
        type,
      };
    },
    saveUnlock(state, unlock) {
      return {
        ...state,
        unlock,
      };
    },
    saveLoginStatus(state, payload) {
      const { data, success } = payload;

      // 修改过初始密码后才能进入页面
      if (success && data && data.hasChangedPwd) {
        setAuthority('admin');
      } else {
        setAuthority();
      }

      return {
        ...state,
        loginData: data,
      };
    },
  },
  effects: {
    // 登录或登录绑定
    // 登录后重定向redirect：目前第三方登录，首次登录后修改初始密码等，会无法重定向
    async login(data) {
      const { modalType, loginTabType, ...restParams } = data;

      const query = modalType === 'bind' ? Services.loginAndBind : Services.login;

      const paramsT = setHutiParams(restParams);
      const res = await query(paramsT);

      this.saveLoginStatus(res);

      if (res.success) {
        let type = loginTabType;
        if (modalType === 'bind') {
          type = 'third';
        }
        Tools.setCookie('loginTabType', type, '/');

        reloadAuthorized();
        if (window._bnq_trace) {
          // eslint-disable-next-line no-undef
          window._bnq_trace.push({
            type: 'event',
            eventId: 'login_success',
            eventLabel: '登录成功',
          });
        }

        if (res.data && !res.data.hasChangedPwd) {
          Modal.confirm({
            className: 'bnq-info-modal',
            title: '首次登录时需要修改密码',
            okText: '去修改',
            cancelButtonProps: { style: { display: 'none' } },
            onOk() {
              history.push('/user/update-password');
            },
          });
        } else {
          Tools.loginRedirect();
        }
      }
      return res;
    },
    async loginCheck(params) {
      const res = await Services.loginCheckApi(params);
      return res;
    },
    /*  // 登录并绑定
    async loginAndBind(data) {
      const res = await Services.loginAndBind(data);

      this.saveLoginStatus(res);

      if (res.success) {
        reloadAuthorized();
      }
      return res;
    }, */
    // 用户主动退出/401未登录/未设置权限时，会触发logout，清除权限并跳转login页面
    async logout(data = {}) {
      const { shouldRequest = false, redirect, stayInLogin } = data;

      let res;
      if (shouldRequest) {
        res = await Services.logout();
      }

      const nextUrl = getQueryPath('/user/login', {
        redirect,
        stayInLogin,
      });

      setAuthority();
      reloadAuthorized();
      history.push(nextUrl);
      return res;
    },

    // 请求发送手机验证码
    async querySms(params) {
      return Services.querySms(params);
    },

    // 获取滑动验证码
    async getCaptcha(params) {
      return Services.getCaptcha(params);
    },

    // 验证滑动验证码
    async checkCaptcha(params) {
      return Services.checkCaptcha(params);
    },

    // 获取用户信息
    async getCurrentUser() {
      const { data } = await Services.getCurrentUser();

      this.save({
        currentUser: {
          ...data,
          picture: data.picture || defaultAvatar,
        },
      });
    },

    // 修改密码
    async updatePassword() {
      const res = await Services.updatePassword();
      return res;
    },
    // 第三方登录后判断是否绑定了账户
    async checkIfBind(params) {
      const paramsT = setHutiParams(params);
      const res = await Services.checkIfBind(paramsT);

      this.saveLoginStatus(res);

      if (res.success) {
        reloadAuthorized();
      }
      return res;
    },

    async uploadFile(params) {
      params.bucket = 'bnq-zhima';
      const { content } = await Services.uploadFile(params);
      return content;
    },

    async getFileByFileId(params) {
      params.bucket = 'bnq-zhima';
      const { content } = await Services.getFileByFileId(params);
      return content;
    },
  },
};
