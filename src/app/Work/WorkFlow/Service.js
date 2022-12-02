import CommonService from '@/service/CommonService';
import { Remote } from '@/util';

class Service extends CommonService {
  getApps(params) {
    return Remote.get('/app/appList', params);
  }
}

export default new Service();
