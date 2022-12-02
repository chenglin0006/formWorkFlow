/* 是否必填 */
import React, { Fragment } from 'react';
import { Form, Switch } from 'antd';
import PropTypes from 'prop-types';

const RenderIsRequiredProps = ({ changeCardListStore }) => {
  return (
    <Fragment>
      <Form.Item label="是否必填" name="isRequired" valuePropName="checked">
        <Switch
          onChange={(v) => {
            console.log(v);
            changeCardListStore(v, 'required');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderIsRequiredProps.propTypes = {
  changeCardListStore: PropTypes.func,
};

export default RenderIsRequiredProps;
