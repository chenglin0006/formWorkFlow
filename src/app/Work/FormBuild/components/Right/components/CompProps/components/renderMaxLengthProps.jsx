/* 最多输入 */
import React, { Fragment } from 'react';
import { InputNumber, Form } from 'antd';
import PropTypes from 'prop-types';

const RenderMaxLengthProps = ({ changeCardListStore }) => {
  return (
    <Fragment>
      <Form.Item label="最多输入" name="maxLength">
        <InputNumber
          min={0}
          onChange={(v) => {
            changeCardListStore(v, 'maxLength');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderMaxLengthProps.propTypes = {
  changeCardListStore: PropTypes.func,
};

export default RenderMaxLengthProps;
