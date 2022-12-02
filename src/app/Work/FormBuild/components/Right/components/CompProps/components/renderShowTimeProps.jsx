/* 是否多选 */
import React, { Fragment } from 'react';
import { Form, Switch } from 'antd';
import PropTypes from 'prop-types';

const RenderShowTimeProps = ({ changeCardListStore }) => {
  return (
    <Fragment>
      <Form.Item label="是否展示时间" name="showTime" valuePropName="checked">
        <Switch
          onChange={(v) => {
            changeCardListStore(v, 'showTime');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderShowTimeProps.propTypes = {
  changeCardListStore: PropTypes.func,
};

export default RenderShowTimeProps;
