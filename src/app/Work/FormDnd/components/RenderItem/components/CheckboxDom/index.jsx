import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element, value, onChange } = props;
  return (
    <Checkbox.Group
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
          <Checkbox key={ele.value} value={ele.value}>
            {ele.label}
          </Checkbox>
        );
      })}
    </Checkbox.Group>
  );
};

Index.propTypes = {
  element: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Index;
