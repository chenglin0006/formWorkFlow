import store from '@/store/index';
import { Remote } from '../util';

class CommonService {
  delay = (time) => {
    return new Promise((resolve) => {
      return setTimeout(() => {
        return resolve();
      }, time);
    });
  };

  login(params) {
    const p = params || {};
    p.deptPoolId = store.getState().common.deptPoolId;
    return Remote.post('/portal/login', p, { urlType: 'default', handleError: true });
  }

  loginCheckApi(params) {
    const p = params || {};
    return Remote.post('/portal/loginCheck', p, { urlType: 'default', handleError: true });
  }

  loginAndBind(params) {
    const p = params || {};
    p.deptPoolId = store.getState().common.deptPoolId;
    return Remote.post('/portal/loginAndBind', p);
  }

  logout() {
    return Remote.get('/portal/logout');
  }

  // 发送手机验证码
  querySms(params) {
    const p = params || {};
    p.deptPoolId = store.getState().common.deptPoolId;
    return Remote.post('/sms/login/send', p);
  }

  getMenus() {
    return Remote.get('/menu/list.do');
  }

  getCurrentUser(params) {
    return Remote.get('/userInfo/getMyUserInfo', params);
  }

  updatePassword(params) {
    return Remote.post('/updatePassword.do', params);
  }

  getCaptcha(params) {
    const p = params || {};
    p.deptPoolId = store.getState().common.deptPoolId;
    return Remote.get('/portal/captcha/get', p);
  }

  checkCaptcha(params) {
    return Remote.get('/portal/captcha/check', params, { urlType: 'default', handleError: true });
  }

  // 第三方登录后判断是否绑定了账户
  checkIfBind(params) {
    return Remote.get('/thirdLogin/loginResult', params, { urlType: 'default', handleError: true });
  }

  uploadFile(params) {
    const { fileType, ...restParams } = params;
    let url = '/fileUpload/uploadImageFile';
    if (fileType === 'file') {
      url = '/fileUpload/uploadFile';
    }
    return Remote.post(url, restParams, {
      urlType: 'upload',
      type: 'file',
    });
  }

  getFileByFileId(params) {
    return Remote.post('/fileUpload/getFileUrl', params, {
      urlType: 'upload',
    });
  }
}

export default CommonService;
