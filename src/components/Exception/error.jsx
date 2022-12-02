import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

const Error = ({ code = 'error', msg }) => {
  let codeProp = code;
  const codeList = ['success', 'error', 'info', 'warning', '404', '403', '500'];
  if (codeList.indexOf(`${code}`) === -1) {
    codeProp = 'error';
  }
  const loginUrl = `/user/login?stayInLogin=true&redirect=${localStorage.getItem('redirectUrl')}`;
  return (
    <Result
      status={`${code}` === '50005' ? 500 : codeProp}
      title={code}
      subTitle={msg}
      extra={
        <span>
          {`${code}` === '50005' ? (
            <Link to={loginUrl}>
              <Button type="primary">返回登录页</Button>
            </Link>
          ) : (
            <Link to="/?stayInLogin=true">
              <Button type="primary">返回首页</Button>
            </Link>
          )}
        </span>
      }
    />
  );
};

Error.propTypes = {
  code: PropTypes.string,
  msg: PropTypes.string,
};

export default Error;
