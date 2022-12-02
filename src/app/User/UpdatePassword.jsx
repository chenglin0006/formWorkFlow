import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, Result } from 'antd';
import classNames from 'classnames';
import PasswordInput from '@/components/PasswordInput/index';
import { isMobile } from '@/util/const';
import { getQueryPath } from '@/util/common';

import './index.less';
import styles from './index.module.less';

const UpdatePassword = (props) => {
  const [done, setDone] = useState(false);
  const [passwordDefault1, setPasswordDefault1] = useState(!isMobile);
  const [passwordDefault2, setPasswordDefault2] = useState(!isMobile);
  const [changeByOwn1, setChangeByOwn1] = useState(false);
  const [changeByOwn2, setChangeByOwn2] = useState(false);
  const { submitLoading } = props;

  const onFinish = async (values) => {
    const { updateInitPassword } = props;

    const res = await updateInitPassword({
      newPassword: values.password,
    });

    if (res.success) {
      setDone(true);
    }
  };

  const onFinishFailed = () => {};

  const onGoLogin = () => {
    const { history } = props;
    if (localStorage.getItem('redirectUrl')) {
      const nextUrl = getQueryPath('/user/login', {
        redirect: localStorage.getItem('redirectUrl'),
        stayInLogin: true,
      });
      history.push(nextUrl);
    } else {
      history.push('/user/login?stayInLogin=true');
    }
  };

  return done ? (
    <Result
      status="success"
      title="修改成功"
      subTitle="密码修改成功，请返回登录页重新登录"
      extra={[
        <Button type="primary" key="back" onClick={onGoLogin}>
          返回登录
        </Button>,
      ]}
    />
  ) : (
    <div className={classNames('bnq-login-form bnq-forget-form', styles.updatePassword)}>
      <h2 className={classNames('bnq-login-form-title', styles.title)}>修改密码后才可以使用系统</h2>
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
        <PasswordInput
          passwordDefault={passwordDefault1}
          name="password"
          placeholder="新密码"
          size="large"
          extra="8～20位，必须包含字母大小写"
          changeByOwn={changeByOwn1}
          rules={[{ required: true, message: '请输入新密码!' }]}
          toggleType={(boolChange) => {
            // 将两个输入框的密码状态同步
            setPasswordDefault1(boolChange);
            setPasswordDefault2(boolChange);
            // 当前输入框是自己触发的密码变更，另外的输入框是其他输入框密码变更引起的
            setChangeByOwn1(true);
            setChangeByOwn2(false);
          }}
        />
        <PasswordInput
          passwordDefault={passwordDefault2}
          changeByOwn={changeByOwn2}
          name="confirm"
          dependencies={['password']}
          onFocus={() => {
            if (isMobile) {
              // fix 移动端input遮住了部分输入框
              document.getElementById('userContainer').scrollTop = document.getElementById(
                'userContainer',
              ).offsetHeight;
            }
          }}
          placeholder="确认新密码"
          size="large"
          extra="8～20位，必须包含字母大小写"
          rules={[
            { required: true, message: '请输入确认新密码!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
          toggleType={(boolChange) => {
            setPasswordDefault1(boolChange);
            setPasswordDefault2(boolChange);
            setChangeByOwn2(true);
            setChangeByOwn1(false);
          }}
        />

        <Form.Item>
          <Button type="primary" size="large" htmlType="submit" className="login-form-button" loading={submitLoading}>
            确认
          </Button>
        </Form.Item>

        {/* <Form.Item className="g-no-m">
          <Link className="login-form-forgot" to="/user/login">
            忘记密码
          </Link>
        </Form.Item> */}
      </Form>
    </div>
  );
};

UpdatePassword.propTypes = {
  history: PropTypes.object.isRequired,
  updateInitPassword: PropTypes.func.isRequired,
  submitLoading: PropTypes.bool,
};

const mapDispatch = (dispatch) => {
  return {
    updateInitPassword: dispatch.user.updateInitPassword,
  };
};

const mapState = (state) => {
  return {
    submitLoading: state.loading.effects.user.updateInitPassword,
  };
};

export default connect(mapState, mapDispatch)(UpdatePassword);
