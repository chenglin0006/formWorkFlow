import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

import styles from './index.module.less';

const AppItem = (props) => {
  const { data = {} } = props;

  const toBind = () => {
    if (data.source) {
      const redirectUrl = location.href;
      if (location.origin.indexOf('localhost') > -1) {
        window.location.href = `https://authn-test.bnq.com.cn/authnService/thirdLogin/${data.source}/bind?uri=${redirectUrl}`;
      } else {
        window.location.href = `${location.origin}/authnService/thirdLogin/${data.source}/bind?uri=${redirectUrl}`;
      }
    }
  };

  return (
    <>
      <div className={styles.appItem} onClick={toBind}>
        <div className={styles.appIcon}>
          <Avatar src={data.icon} />
        </div>
        <div className={styles.appName}>{data.name}</div>
      </div>
    </>
  );
};

AppItem.propTypes = {
  data: PropTypes.object,
};

export default AppItem;
