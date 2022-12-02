import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form } from 'antd';
import AvatarUpload from '@/components/Inputs/AvatarUpload';

import styles from './index.module.less';

const AvatarEdit = ({ initialData, onEdit }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onShow = () => {
    setVisible(true);
  };

  const onHide = () => {
    setVisible(false);
  };

  const onFinish = async (values) => {
    const { avatar } = values;
    setLoading(true);

    try {
      const res = await onEdit({
        picture: avatar && avatar.url,
      });

      if (res.success) {
        setVisible(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const checkAvatar = (_, value) => {
    if (value && value.url) {
      return Promise.resolve();
    }

    return Promise.reject(new Error('请上传头像'));
  };

  return (
    <>
      <Button type="link" onClick={onShow}>
        修改
      </Button>
      <Modal
        className={styles.uploadModal}
        visible={visible}
        onOk={onHide}
        onCancel={onHide}
        footer={null}
        destroyOnClose
      >
        <div className={styles.uploadModalTitle}>头像</div>
        <div>
          <Form initialValues={{ avatar: { url: initialData } }} onFinish={onFinish} validateTrigger={false}>
            <Form.Item name="avatar" className={styles.uploadModalInput} rules={[{ validator: checkAvatar }]}>
              <AvatarUpload maxSize={10} />
            </Form.Item>

            <Form.Item className={styles.uploadModalFooter}>
              <Button onClick={onHide}>取消</Button>

              <Button type="primary" htmlType="submit" loading={loading}>
                确定
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

AvatarEdit.propTypes = {
  onEdit: PropTypes.func.isRequired,
  initialData: PropTypes.string,
};

export default AvatarEdit;
