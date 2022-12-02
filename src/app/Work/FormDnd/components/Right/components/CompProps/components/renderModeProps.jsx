/* 是否多选 mode */
import React, { Fragment } from 'react';
import { Form, Switch } from 'antd';
import PropTypes from 'prop-types';

const RenderModProps = ({ changeCardListStore, setIsMultiple }) => {
  return (
    <Fragment>
      <Form.Item label="是否多选" name="mode" valuePropName="checked">
        <Switch
          onChange={(v) => {
            setIsMultiple(v);
            changeCardListStore(v ? 'multiple' : '', 'mode');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderModProps.propTypes = {
  changeCardListStore: PropTypes.func,
  setIsMultiple: PropTypes.func,
};

export default RenderModProps;
