import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'core-js/stable';
import Verify from './app/VerifyPage/index';
import store from './store/index';

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <Verify />
    </ConfigProvider>
  </Provider>,
  document.getElementById('verify'),
);
