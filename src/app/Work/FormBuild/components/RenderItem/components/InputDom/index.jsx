import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element } = props;
  return (
    <Input
      allowClear
      showCount={!!element.maxLength}
      maxLength={element.maxLength}
      placeholder={element.placeholder}
      defaultValue={element.defaultValue}
    />
  );
};

Index.propTypes = {
  element: PropTypes.object,
};

export default Index;
