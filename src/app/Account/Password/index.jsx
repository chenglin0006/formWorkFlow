import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Form, Input, Button, Modal } from 'antd';
import { Form, Button, Modal } from 'antd';
import Captcha from '@/components/Inputs/Captcha';
import PasswordInput from '@/components/PasswordInput/index';
import { Tools } from '@/util';
import { isMobile } from '@/util/const';

import styles from './index.module.less';

const layout = {
  labelCol: {
    sm: { span: 8 },
    md: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 12 },
    md: { span: 8 },
  },
};
const tailLayout = {
  wrapperCol: {
    offset: layout.labelCol.span,
    span: layout.wrapperCol.span,
  },
};

const Password = (props) => {
  const [passwordDefault1, setPasswordDefault1] = useState(!isMobile);
  const [passwordDefault2, setPasswordDefault2] = useState(!isMobile);
  const [changeByOwn1, setChangeByOwn1] = useState(false);
  const [changeByOwn2, setChangeByOwn2] = useState(false);
  const [backUrl] = useState(Tools.getUrlArg('backUrl'));
  const { currentUser, sendCaptchSms, history, logout, submitLoading = false } = props;
  const [form] = Form.useForm();

  const countDown = () => {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: '密码修改成功',
      content: `将在${secondsToGo}秒后重新登录`,
      okText: '返回登录',
      onOk: () => {
        modal.destroy();
        if (backUrl) {
          window.location.href = decodeURIComponent(backUrl);
        } else {
          logout({ stayInLogin: true });
        }
      },
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `将在${secondsToGo}秒后重新登录`,
      });

      if (secondsToGo === 0) {
        clearInterval(timer);
        modal.destroy();
        if (backUrl) {
          window.location.href = backUrl;
        } else {
          logout({ stayInLogin: true });
        }
      }
    }, 1000);
  };

  const onFinish = async (values) => {
    const { updatePassword } = props;

    const params = {
      mobile: values.mobile,
      verifyCode: values.captcha,
      newPassword: values.password,
    };
    const res = await updatePassword(params);

    if (res.success) {
      countDown();
    }
  };

  const onBack = () => {
    history.goBack();
  };

  return (
    <div>
      <div className={styles.title}>修改密码</div>
      <div className={styles.content}>
        <Form
          {...layout}
          className={styles.form}
          layout="horizontal"
          name="basic"
          form={form}
          initialValues={{ mobile: currentUser.mobile }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="工号">
            <span className="ant-form-text">{currentUser.employeeNumber}</span>
          </Form.Item>

          <Form.Item name="mobile" label="手机号">
            <span className="ant-form-text">{currentUser.mobile}</span>
          </Form.Item>

          <Form.Item
            label="短信验证码"
            name="captcha"
            rules={[
              {
                required: true,
                message: '请输入短信验证码',
              },
            ]}
          >
            <Captcha form={form} target="mobile" queryCaptcha={sendCaptchSms} />
          </Form.Item>

          <PasswordInput
            passwordDefault={passwordDefault1}
            label="新密码"
            name="password"
            prefixShow={false}
            changeByOwn={changeByOwn1}
            bordered
            autoComplete="new-password"
            classStr={styles.updatePasswordItem}
            extra="8～20位，必须包含字母大小写"
            rules={[
              {
                required: true,
                message: '请输入新密码',
              },
            ]}
            toggleType={(boolChange) => {
              setPasswordDefault1(boolChange);
              setPasswordDefault2(boolChange);
              setChangeByOwn1(true);
              setChangeByOwn2(false);
            }}
          />

          <PasswordInput
            passwordDefault={passwordDefault2}
            label="确认新密码"
            classStr={styles.updatePasswordItem}
            name="confirm"
            dependencies={['password']}
            prefixShow={false}
            changeByOwn={changeByOwn2}
            bordered
            onFocus={() => {
              if (isMobile) {
                // fix 移动端input遮住了部分输入框
                document.getElementById('simpleContainer').scrollTop = document.getElementById(
                  'simpleContainer',
                ).offsetHeight;
              }
            }}
            rules={[
              {
                required: true,
                message: '请输入确认新密码',
              },
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

          {/* <Form.Item
            label="确认新密码"
            name="confirm"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: '请输入确认新密码',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item> */}

          <Form.Item {...tailLayout} className={styles.btns}>
            <Button style={{ marginRight: '8px' }} onClick={onBack}>
              返回
            </Button>

            <Button type="primary" htmlType="submit" loading={submitLoading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

Password.propTypes = {
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  updatePassword: PropTypes.func.isRequired,
  sendCaptchSms: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  submitLoading: PropTypes.bool,
};

const mapDispatch = (dispatch) => {
  return {
    sendCaptchSms: dispatch.account.sendCaptchSms,
    updatePassword: dispatch.account.updatePassword,
    logout: dispatch.common.logout,
  };
};

const mapState = (state) => {
  return {
    currentUser: state.common.currentUser,
    submitLoading: state.loading.effects.account.updatePassword,
  };
};

export default connect(mapState, mapDispatch)(Password);
