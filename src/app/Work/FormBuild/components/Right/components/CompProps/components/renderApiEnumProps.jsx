/* 枚举api输入框 */
import React, { Fragment } from 'react';
import { Input, Form } from 'antd';
import PropTypes from 'prop-types';

const RenderApiEnumProps = ({ setData }) => {
  return (
    <Fragment>
      <Form.Item label="api" name="apiUrl">
        <Input
          onBlur={(v) => {
            console.log(v.target.value);
            const list = [
              { label: '3', value: '3' },
              { label: '4', value: '4' },
            ];
            setData(list, v.target.value);
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderApiEnumProps.propTypes = {
  setData: PropTypes.func,
};

export default RenderApiEnumProps;
