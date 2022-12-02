/* 最大值和最小值 */
import React, { Fragment } from 'react';
import { InputNumber, Form } from 'antd';
import PropTypes from 'prop-types';

const RenderMaxAndMinProps = ({ changeCardListStore }) => {
  return (
    <Fragment>
      <Form.Item label="最大值" name="max">
        <InputNumber
          onChange={(v) => {
            changeCardListStore(v, 'max');
          }}
        />
      </Form.Item>
      <Form.Item label="最小值" name="min">
        <InputNumber
          onChange={(v) => {
            changeCardListStore(v, 'min');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderMaxAndMinProps.propTypes = {
  changeCardListStore: PropTypes.func,
};

export default RenderMaxAndMinProps;
