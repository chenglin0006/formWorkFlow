import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import PageLoading from '@/components/PageLoading';
import { Tools } from '@/util';
import { getPageQuery } from '@/util/common';
import bnqLogo from '@/assets/img/logo.png';
import zmLogo from '@/assets/img/zmLogo.png';

import styles from './index.module.less';

const ThirdAuthorize = (props) => {
  const { getAppInfo, authGitlab, loading, submitLoading } = props;
  const { appId } = getPageQuery();
  const [app, setApp] = useState({});

  useEffect(() => {
    getAppInfo({ appId }).then(({ data }) => {
      setApp(data);
    });
  }, []);

  const onClick = async () => {
    const params = {
      appId,
    };
    if (Tools.getUrlArg('returnUrl')) {
      params.returnUrl = Tools.getUrlArg('returnUrl');
    }
    if (Tools.getUrlArg('env')) {
      params.env = Tools.getUrlArg('env');
    }
    const { data } = await authGitlab(params);
    if (data) {
      window.location.href = data;
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      <div className={styles.authWrap}>
        <div className={styles.title}>授权请求</div>

        <div className={styles.authAppWrap}>
          <div className={styles.authApp}>
            <div className={styles.authItem}>
              <div className={styles.iconWrap}>
                <img className={styles.icon} src={app.icon || bnqLogo} alt="logo" />
              </div>
            </div>
            <div className={styles.authConnector}>
              <SwapOutlined />
            </div>
            <div className={styles.authItem}>
              <div className={styles.iconWrap}>
                <img className={styles.icon} src={zmLogo} alt="logo" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.authAppDetail}>
          <div>
            <span style={{ fontWeight: 'bold' }}>{app.name}</span>应用请求获取你的个人信息
          </div>
        </div>

        <div className={styles.operation}>
          <Button type="primary" onClick={onClick} loading={submitLoading}>
            同意授权
          </Button>
        </div>
      </div>
    </>
  );
};

ThirdAuthorize.propTypes = {
  getAppInfo: PropTypes.func.isRequired,
  authGitlab: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  submitLoading: PropTypes.bool.isRequired,
};

const mapDispatch = (dispatch) => {
  return {
    getAppInfo: dispatch.thirdAuthorize.getAppInfo,
    authGitlab: dispatch.thirdAuthorize.authGitlab,
  };
};

const mapState = (state) => {
  return {
    loading: state.loading.effects.thirdAuthorize.getAppInfo,
    submitLoading: state.loading.effects.thirdAuthorize.authGitlab,
  };
};

export default connect(mapState, mapDispatch)(ThirdAuthorize);
