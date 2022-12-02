import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element } = props;
  return (
    <Checkbox.Group defaultValue={element.defaultValue}>
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
};

export default Index;
