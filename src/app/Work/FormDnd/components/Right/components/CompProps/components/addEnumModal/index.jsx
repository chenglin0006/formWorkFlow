import React, { Fragment } from 'react';
import { Form, Modal, Input, message } from 'antd';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { TreeIterator } from '@/util';

const layout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

const Index = (props) => {
  const [form] = Form.useForm();
  const { onClose, onOk, activeEnumNode, enumModalType, enumModalData } = props;
  const save = async () => {
    const values = await form.validateFields();
    const l = TreeIterator.filter(enumModalData, (item) => {
      return item.value === values.value;
    });
    if (l.length) {
      message.error('选项值重复，请重新输入');
      form.setFieldsValue({
        value: '',
      });
      return;
    }
    onOk(values);
  };
  useEffect(() => {
    if (enumModalType === 'edit' && activeEnumNode) {
      form.setFieldsValue({
        label: activeEnumNode.label,
        value: activeEnumNode.value,
      });
    } else {
      form.setFieldsValue({
        label: '',
        value: '',
      });
    }
  }, [enumModalType, activeEnumNode]);

  let title = '';
  if (enumModalType === 'add') {
    if (activeEnumNode) {
      title = '添加子节点';
    } else {
      title = '添加父节点';
    }
  } else {
    title = '编辑节点';
  }

  return (
    <Fragment>
      <Modal
        visible
        title={title}
        destroyOnClose
        maskClosable={false}
        onOk={save}
        onCancel={() => {
          onClose();
        }}
      >
        <Form {...layout} form={form}>
          <Form.Item name="label" label="选项名" rules={[{ required: true, message: '请输入选项名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="value" label="选项值" rules={[{ required: true, message: '请输入选项值' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

Index.propTypes = {
  onClose: PropTypes.func,
  onOk: PropTypes.func,
  activeEnumNode: PropTypes.object,
  enumModalType: PropTypes.string,
  enumModalData: PropTypes.array,
};

export default Index;
