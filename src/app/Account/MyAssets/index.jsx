import React, { memo, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin, message } from 'antd';
import config from 'config/url';
import { Remote, Tools } from '@/util';
import styles from './index.module.less';

const MyAssets = memo(({ updateMaxWidth, logout, currentUser }) => {
  const env = Remote.getEnv();
  const session = Tools.getCookie('SESSION');
  const [iframeLoading, setIframeLoading] = useState(false);
  const [iframeurl, setIframeUrl] = useState(null);
  const iframeRef = useRef();
  const iframeListener = () => {
    window.onmessage = (event) => {
      try {
        console.log(event.data);
        const { funcName, type = 'error', msg } = event.data;
        if (funcName === 'msgToast') {
          message[type](msg);
          return;
        }
        if (funcName === 'loginInvalid') {
          logout({ shouldRequest: false });
        }
      } catch {
        message.error('iframe父子交互发生异常错误');
      }
    };
  };
  useEffect(() => {
    if (currentUser && currentUser.username) {
      setIframeUrl(`${config[env].assetsUrl}/${currentUser.username}/${session}`);
    }
  }, [currentUser]);
  useEffect(() => {
    if (iframeRef.current && currentUser && currentUser.username) {
      setIframeLoading(true);
      iframeRef.current.addEventListener('load', () => {
        setIframeLoading(false);
      });
    }
    iframeListener();
    updateMaxWidth({ isTeamPage: true });
    return () => {
      updateMaxWidth({ isTeamPage: false });
      window.removeEventListener('message');
    };
  }, []);
  return (
    <div className={styles.MyAssets}>
      <div className={styles.title}>我的资产</div>
      <Spin spinning={iframeLoading}>
        <div className={styles.iframeWrapper}>
          <iframe ref={iframeRef} className={styles.iframeAssets} title="assets" src={iframeurl} />
        </div>
      </Spin>
    </div>
  );
});
MyAssets.propTypes = {
  updateMaxWidth: PropTypes.func,
  currentUser: PropTypes.object,
  logout: PropTypes.func,
};
const mapState = (state) => ({
  currentUser: state.common.currentUser,
});
const mapDispatch = (dispatch) => ({
  updateMaxWidth: dispatch.account.save,
  logout: dispatch.common.logout,
});
export default connect(mapState, mapDispatch)(memo(MyAssets));
