/**
 * 根据设备类型使用对应的轻提醒组件
 * 传参和antd.message一致
 */

import { message as antdMessage } from 'antd';
import { Toast } from 'antd-mobile';
import { isMobile } from '@/util/const';

const message = isMobile
  ? {
      success: Toast.success,
      error: Toast.fail,
      info: Toast.info,
      warning: Toast.info,
      warn: Toast.info,
      loading: Toast.loading,
    }
  : antdMessage;

export default message;
