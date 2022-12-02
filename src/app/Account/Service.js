import CommonService from '@/service/CommonService';
import { Remote } from '@/util';
import store from '@/store/index';

class Service extends CommonService {
  // 修改个人信息
  updateInfo(params) {
    return Remote.post('/userInfo/updateMyUserInfo', params);
  }

  // 登录状态下-修改密码-发短信验证码
  sendCaptchSms(params) {
    const p = params || {};
    p.deptPoolId = store.getState().common.deptPoolId;
    return Remote.post('/sms/updatePwd/send', p);
  }

  // 登录状态下-修改密码
  updatePassword(params) {
    const p = params || {};
    p.deptPoolId = store.getState().common.deptPoolId;
    return Remote.post('/portal/updatePassword', p);
  }

  // 绑定maxkey和应用账号
  bindApp(params) {
    return Remote.get('/app/appUserConfig', params);
  }

  // 应用解绑
  unbindApp(params) {
    return Remote.get('/app/unBindleApp', params);
  }

  // 账号解绑
  unbindAccount(params) {
    return Remote.get(`/thirdLogin/${params.source}/unbind`);
  }

  getBindAccounts(params) {
    return Remote.get('/thirdLogin/bindList', params);
  }

  // 获取我的权限
  getMyAuthInfo(params) {
    return Remote.get('/selfAuth/getMyAuthInfo', params);
  }

  // 获取团队成员列表
  getMyTeam(params) {
    return Remote.get('/selfAuth/getMyTeam', params);
  }

  // 获取团队详细信息
  getMyTeamMemberInfo(params) {
    return Remote.get('/selfAuth/getMyTeamMemberInfo', params);
  }

  // 下级向上级申请授权
  applyAuth(params) {
    return Remote.get('/selfAuth/applyAuth', params);
  }

  // 上级给下级授权
  authMember(params) {
    return Remote.get('/selfAuth/authMember', params);
  }

  // 上级给下级取消授权
  cancelAuthMember(params) {
    return Remote.get('/selfAuth/cancelAuthMember', params);
  }
}

export default new Service();
