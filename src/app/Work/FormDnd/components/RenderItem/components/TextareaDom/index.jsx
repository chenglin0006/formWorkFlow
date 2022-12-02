import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const Index = (props) => {
  const { element, value, onChange } = props;
  return (
    <TextArea
      allowClear
      showCount={!!element.maxLength}
      maxLength={element.maxLength}
      rows={4}
      defaultValue={element.defaultValue}
      placeholder={element.placeholder}
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
