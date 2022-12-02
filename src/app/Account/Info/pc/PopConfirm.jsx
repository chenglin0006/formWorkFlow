import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';

// 为提交时展示loading状态，简单封装Popconfirm
const PopconfirmBtn = (props) => {
  const { onOk, title, children, data } = props;
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    try {
      await onOk(data);
      setVisible(false);
      setConfirmLoading(false);
    } catch (error) {
      console.error(error);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Popconfirm
      title={title}
      visible={visible}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <Button size="small" danger onClick={showPopconfirm}>
        {children}
      </Button>
    </Popconfirm>
  );
};

PopconfirmBtn.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  data: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default PopconfirmBtn;
