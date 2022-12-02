import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';

const { RangePicker } = DatePicker;

const Index = (props) => {
  const { element, value, onChange } = props;
  return (
    <RangePicker
      allowClear
      placeholder={element.placeholder}
      showTime={element.showTime}
      defaultValue={element.defaultValue || []}
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
