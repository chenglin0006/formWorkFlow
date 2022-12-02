import CommonService from '@/service/CommonService';
import { Remote } from '@/util';
import store from '@/store/index';

class Service extends CommonService {
  // 根据工号显示手机号(用于忘记密码需要短信验证)
  getMobileByEmployeeNumber(params) {
    const p = params || {};
    p.deptPoolId = store.getState().common.deptPoolId;
    return Remote.get('/userInfo/getMobileByEmployeeNumber', p);
  }

  // 重置密码-发短信验证码
  postRestSms(params) {
    const p = params || {};
    p.deptPoolId = store.getState().common.deptPoolId;
    return Remote.post('/sms/resetPwd/send', p);
  }

  // 重置密码(忘记密码)-发送新密码给用户
  resetPassword(params) {
    const p = params || {};
    p.deptPoolId = store.getState().common.deptPoolId;
    return Remote.get('/portal/resetPassword', p);
  }

  // 第一次登录修改密码
  updateInitPassword(params) {
    return Remote.post('/portal/pwd/firstSet', params);
  }
}

export default new Service();
