import React from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element } = props;
  return (
    <Radio.Group defaultValue={element.defaultValue}>
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
};

export default Index;
