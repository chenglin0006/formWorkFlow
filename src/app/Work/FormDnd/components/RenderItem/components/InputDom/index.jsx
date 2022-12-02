import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element, value = '', onChange } = props;
  return (
    <Input
      allowClear
      showCount={!!element.maxLength}
      maxLength={element.maxLength}
      placeholder={element.placeholder}
      defaultValue={element.defaultValue}
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
