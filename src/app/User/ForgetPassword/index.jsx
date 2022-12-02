import React, { useState } from 'react';
import { Form, Result as AntdResult } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { getQueryPath } from '@/util/common';
import Account from './Account';
import Captcha from './Captcha';

import '../index.less';
import styles from './index.module.less';

const Result = () => {
  return <AntdResult status="success" title="密码已通过短信发送，请注意查收" className={styles.result} />;
};

const ForgetPassword = () => {
  const [step, setStep] = useState('account'); // account->captcha->result

  const onStep = (curStep) => {
    setStep(curStep);
  };

  const renderContent = () => {
    if (step === 'account') {
      return <Account onStep={onStep} />;
    }
    if (step === 'captcha') {
      return <Captcha onStep={onStep} />;
    }
    return <Result />;
  };

  // const onGetEmployeeInfo () => {

  // }

  let redirect = '';
  let nextUrl = '/user/login';
  if (localStorage.getItem('redirectUrl')) {
    redirect = localStorage.getItem('redirectUrl');
  }

  nextUrl = getQueryPath('/user/login', {
    redirect,
    stayInLogin: true,
  });

  return (
    <div className={classNames('bnq-login-form', 'bnq-forget-form', { [styles.resultForm]: step === 'result' })}>
      <h2 className="bnq-login-form-title">忘记密码</h2>

      {renderContent()}

      <Form.Item className="g-no-m">
        <span className="login-form-tips">有问题请致电 Helpdesk: 021-31264877</span>

        <Link className="login-form-forgot" to={nextUrl}>
          去登录
        </Link>
      </Form.Item>
    </div>
  );
};

ForgetPassword.propTypes = {
  // getMobileByEmployeeNumber: PropTypes.func.isRequired,
};

const mapDispatch = () => {
  return {};
};

const mapState = () => {
  return {};
};

export default connect(mapState, mapDispatch)(ForgetPassword);
