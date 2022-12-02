/* 标题 */
import React, { Fragment } from 'react';
import { Input, Form } from 'antd';
import PropTypes from 'prop-types';

const RenderTitleProps = ({ changeCardListStore }) => {
  return (
    <Fragment>
      <Form.Item label="标题" name="label">
        <Input
          onChange={(v) => {
            changeCardListStore(v.target.value, 'name');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderTitleProps.propTypes = {
  changeCardListStore: PropTypes.func,
};

export default RenderTitleProps;
