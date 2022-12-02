import React, { Fragment } from 'react';
import { Form, Select, DatePicker, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import './index.less';

const { Option } = Select;

const Index = (props) => {
  const { element, form } = props;
  return (
    <Fragment>
      <div className="own-title">请假组件</div>
      <Row gutter={10}>
        <Col span={element.leaveLayout === 'vertical' ? 24 : 12}>
          <Form.Item label="请假类型" name="leaveType" rules={[{ required: true, message: '请选择' }]}>
            <Select
              onChange={() => {
                form.setFieldsValue({ leaveTime: null });
              }}
            >
              <Option value={1}>事假</Option>
              <Option value={2}>年假</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={element.leaveLayout === 'vertical' ? 24 : 12}>
          <Form.Item label="请假时间" name="leaveTime" rules={[{ required: true, message: '请选择' }]}>
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>
    </Fragment>
  );
};

Index.propTypes = {
  element: PropTypes.object,
  form: PropTypes.object,
};

export default Index;
