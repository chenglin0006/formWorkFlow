import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';

const Account = ({ onStep, getMobileByEmployeeNumber, submitLoading }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const res = await getMobileByEmployeeNumber(values);

    if (res.success) {
      onStep('captcha');
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        className="bnq-forget-items"
        name="employeeNumber"
        rules={[{ required: true, message: '请输入账号或工号' }]}
      >
        <Input prefix={<UserOutlined />} size="large" bordered={false} placeholder="账号/工号" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          className="login-form-button"
          // onClick={onClick}
          loading={submitLoading}
        >
          下一步
        </Button>
      </Form.Item>
    </Form>
  );
};

Account.propTypes = {
  onStep: PropTypes.func.isRequired,
  getMobileByEmployeeNumber: PropTypes.func.isRequired,
  submitLoading: PropTypes.bool,
};

const mapDispatch = (dispatch) => {
  return {
    getMobileByEmployeeNumber: dispatch.user.getMobileByEmployeeNumber,
  };
};

const mapState = (state) => {
  return {
    submitLoading: state.loading.effects.user.getMobileByEmployeeNumber,
  };
};

export default connect(mapState, mapDispatch)(Account);
