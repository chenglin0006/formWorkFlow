import React from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element, value, onChange } = props;
  return (
    <Radio.Group
      defaultValue={element.defaultValue}
      value={value}
      onChange={(v) => {
        if (onChange) {
          onChange(v);
        }
      }}
    >
      {(element.options || []).map((ele) => {
        return (
          <Radio key={ele.value} value={ele.value}>
            {ele.label}
          </Radio>
        );
      })}
    </Radio.Group>
  );
};

Index.propTypes = {
  element: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Index;
