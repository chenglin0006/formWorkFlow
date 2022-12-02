import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Modal, Form, Input } from 'antd';
import PasswordInput from '@/components/PasswordInput/index';
import { isMobile } from '@/util/const';

import { defaultImg } from 'config/config';
import styles from './AppItem.module.less';

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 10 },
};

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, visible }) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;
  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  }, [visible]);
};

const ModalForm = ({ title, visible, onCancel, onSubmit }) => {
  const [passwordDefault, setPasswordDefault] = useState(!isMobile);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useResetFormOnCloseModal({ form, visible });

  const onOk = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      await onSubmit(values);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={title}
      visible={visible}
      okText="提交"
      onOk={onOk}
      confirmLoading={loading}
      cancelText="返回"
      onCancel={onCancel}
    >
      <Form {...layout} onFinish={onFinish} form={form} name="userForm">
        <Form.Item label="账号" name="identity_username" rules={[{ required: true, message: '请输入账号' }]}>
          <Input />
        </Form.Item>

        <PasswordInput
          name="identity_password"
          label="密码"
          bordered
          prefixShow={false}
          passwordDefault={passwordDefault}
          rules={[{ required: true, message: '请输入密码' }]}
          toggleType={(boolChange) => {
            setPasswordDefault(boolChange);
          }}
        />

        {/* <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

ModalForm.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

const AppItem = (props) => {
  const { data = {}, onAdd } = props;
  const [visible, setVisible] = useState(false);

  const onShow = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onSubmit = async (values) => {
    const params = {
      ...values,
      protocol: data.protocol,
      credential: data.credential,
      appId: data.appId,
    };

    const res = await onAdd(params);

    if (res.success) {
      onClose();
    }
  };

  return (
    <>
      <div className={styles.appItem} onClick={onShow}>
        <div className={styles.appIcon}>
          <Avatar src={data.icon || defaultImg} />
        </div>
        <div className={styles.appName}>{data.name}</div>
      </div>
      <ModalForm title={`绑定第三方账号 - ${data.name}`} visible={visible} onCancel={onClose} onSubmit={onSubmit} />
    </>
  );
};

AppItem.propTypes = {
  data: PropTypes.object,
  onAdd: PropTypes.func.isRequired,
};

export default AppItem;
