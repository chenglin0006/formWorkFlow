import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const Index = (props) => {
  const { element } = props;
  return (
    <TextArea
      allowClear
      showCount={!!element.maxLength}
      maxLength={element.maxLength}
      rows={4}
      defaultValue={element.defaultValue}
      placeholder={element.placeholder}
    />
  );
};

Index.propTypes = {
  element: PropTypes.object,
};

export default Index;
