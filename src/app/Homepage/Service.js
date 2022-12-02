/* eslint-disable no-unused-vars */
import CommonService from '@/service/CommonService';
import { Remote } from '@/util';

class Service extends CommonService {
  getApps(params) {
    return Remote.get('/app/appList', params);
  }

  getRelateApps(params) {
    return Remote.get('/app/appBindList', params);
  }

  getAppsGroup(params) {
    return Remote.get('/app/appGroupList', params);
  }

  goToApp(params) {
    return Remote.get('/loginApi', params);
  }

  editApps(params) {
    return Remote.post('/myapps/update', params);
  }

  getUsedApps(params) {
    return Remote.get('/myapps/list', params);
  }

  getBannerInfo(params) {
    return Remote.get('/notice/page/list', params);
  }

  ajaxRequest(params) {
    return Remote.get(decodeURIComponent(params.url), {}, { urlType: 'default', handleError: true });
  }

  // 自动注册接口
  autoRegister(params) {
    return Remote.get('/autoRegister', params);
  }
}

export default new Service();
