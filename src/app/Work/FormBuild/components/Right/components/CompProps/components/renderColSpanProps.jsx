/* 表单栅格 */
import React, { Fragment } from 'react';
import { Form, Slider } from 'antd';
import PropTypes from 'prop-types';

const RenderColSpanProps = ({ changeCardListStore }) => {
  return (
    <Fragment>
      <Form.Item label="表单栅格" name="colSpan">
        <Slider
          onChange={(v) => {
            changeCardListStore(v, 'colSpan');
          }}
          min={6}
          max={24}
          marks={{
            6: 6,
            8: 8,
            12: 12,
            24: 24,
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderColSpanProps.propTypes = {
  changeCardListStore: PropTypes.func,
};

export default RenderColSpanProps;
