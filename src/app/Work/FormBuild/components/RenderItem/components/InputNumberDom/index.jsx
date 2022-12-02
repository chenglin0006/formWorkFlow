import React from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element } = props;
  return (
    <InputNumber
      defaultValue={element.defaultValue}
      placeholder={element.placeholder}
      min={element.min || element.min === 0 ? element.min : null}
      max={element.max || element.max === 0 ? element.max : null}
      style={{ width: '100%' }}
    />
  );
};

Index.propTypes = {
  element: PropTypes.object,
};

export default Index;
