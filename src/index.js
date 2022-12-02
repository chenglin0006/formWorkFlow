import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Tools } from '@/util';
import App from './app';
import store from './store/index';
import './style/common.css';
import './index.less';

dayjs.locale('zh-cn');

const showPasswordLogin = Tools.getUrlArg('showPasswordLogin');
if (showPasswordLogin) {
  localStorage.setItem('showPasswordLogin', 'true');
} else {
  localStorage.setItem('showPasswordLogin', '');
}

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById('app'),
);
