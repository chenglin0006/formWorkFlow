import CommonService from '@/service/CommonService';
import { Remote } from '@/util';

class Service extends CommonService {
  getAppInfo(params) {
    return Remote.get('/auth/getConfirmParams', params);
  }

  authGitlab(params) {
    return Remote.get('/oauth/loginGitlab', params);
  }
}

export default new Service();
