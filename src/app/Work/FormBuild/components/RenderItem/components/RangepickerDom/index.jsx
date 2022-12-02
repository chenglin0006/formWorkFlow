import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';

const { RangePicker } = DatePicker;

const Index = (props) => {
  const { element } = props;
  return (
    <RangePicker
      allowClear
      placeholder={element.placeholder}
      showTime={element.showTime}
      defaultValue={element.defaultValue || []}
    />
  );
};

Index.propTypes = {
  element: PropTypes.object,
};

export default Index;
