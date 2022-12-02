import React from 'react';
import { Form, Input } from 'antd';
import './index.less';

const Index = () => {
  const [form] = Form.useForm();
  return (
    <div className="basic-container">
      <Form form={form} layout="vertical">
        <Form.Item
          label="表单名称"
          name="formName"
          rules={[
            {
              required: true,
              message: 'Please input',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Index;
