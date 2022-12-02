import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element } = props;
  return (
    <DatePicker
      allowClear
      placeholder={element.placeholder}
      showTime={element.showTime}
      defaultValue={element.defaultValue || null}
    />
  );
};

Index.propTypes = {
  element: PropTypes.object,
};

export default Index;
