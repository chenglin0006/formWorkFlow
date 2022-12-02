import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { connect } from 'react-redux';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import CaptchaMobile from '@/components/Inputs/Captcha';

import styles from './index.module.less';

const Captcha = ({ onStep, forgetPassword, postRestSms, resetPassword, submitLoading }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const res = await resetPassword(values);
    if (res.success) {
      onStep('result');
    }
  };

  const onClickPre = () => {
    onStep('account');
  };
  return (
    <Form
      form={form}
      onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
      initialValues={{
        employeeNumber: forgetPassword.employeeNumber,
      }}
    >
      <Form.Item>
        <div className={styles.mobileItem}>
          <MobileOutlined />
          {forgetPassword.mobile}
        </div>
      </Form.Item>
      <Form.Item name="employeeNumber" style={{ display: 'none' }} />

      <Form.Item name="verifyCode" rules={[{ required: true, message: '请输入验证码!' }]}>
        <CaptchaMobile
          form={form}
          prefix={<LockOutlined />}
          bordered={false}
          target="employeeNumber"
          queryCaptcha={postRestSms}
          size="large"
          placeholder="验证码"
        />
      </Form.Item>

      <Form.Item className={styles.btnGroup}>
        <Button type="link" size="large" className="login-form-button" onClick={onClickPre}>
          上一步
        </Button>

        <Button type="primary" size="large" htmlType="submit" className="login-form-button" loading={submitLoading}>
          确认
        </Button>
      </Form.Item>
    </Form>
  );
};

Captcha.propTypes = {
  forgetPassword: PropTypes.object.isRequired,
  postRestSms: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  onStep: PropTypes.func.isRequired,
  submitLoading: PropTypes.bool,
};

const mapDispatch = (dispatch) => {
  return {
    postRestSms: dispatch.user.postRestSms,
    resetPassword: dispatch.user.resetPassword,
  };
};

const mapState = (state) => {
  return {
    forgetPassword: state.user.forgetPassword,
    submitLoading: state.loading.effects.user.resetPassword,
  };
};

export default connect(mapState, mapDispatch)(Captcha);
