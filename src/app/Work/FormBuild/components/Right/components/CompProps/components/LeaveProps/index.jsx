import React, { Fragment } from 'react';
import { Form, Radio } from 'antd';
import PropTypes from 'prop-types';

const renderLeaveProps = ({ changeCardListStore }) => {
  return (
    <Fragment>
      <Form.Item label="排列方式" name="leaveLayout">
        <Radio.Group
          onChange={(v) => {
            changeCardListStore(v.target.value, 'leaveLayout');
          }}
        >
          <Radio value="horizon">横向</Radio>
          <Radio value="vertical">纵向</Radio>
        </Radio.Group>
      </Form.Item>
    </Fragment>
  );
};
renderLeaveProps.propTypes = {
  changeCardListStore: PropTypes.func,
};
export default renderLeaveProps;
