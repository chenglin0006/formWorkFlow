import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element, value, onChange } = props;
  return (
    <DatePicker
      allowClear
      placeholder={element.placeholder}
      showTime={element.showTime}
      defaultValue={element.defaultValue || null}
      value={value}
      onChange={(v) => {
        if (onChange) {
          onChange(v);
        }
      }}
    />
  );
};

Index.propTypes = {
  element: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Index;
