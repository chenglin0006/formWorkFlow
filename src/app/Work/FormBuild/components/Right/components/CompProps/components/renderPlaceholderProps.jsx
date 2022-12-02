/* 占位提示 */
import React, { Fragment } from 'react';
import { Input, Form } from 'antd';
import PropTypes from 'prop-types';

const RenderPlaceholderProps = ({ changeCardListStore }) => {
  return (
    <Fragment>
      <Form.Item label="占位提示" name="placeholder">
        <Input
          onChange={(v) => {
            changeCardListStore(v.target.value, 'placeholder');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderPlaceholderProps.propTypes = {
  changeCardListStore: PropTypes.func,
};

export default RenderPlaceholderProps;
