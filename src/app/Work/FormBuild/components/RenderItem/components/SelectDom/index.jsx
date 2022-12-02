import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

const Index = (props) => {
  const { element } = props;
  return (
    <Select
      allowClear
      mode={element.mode}
      placeholder={element.placeholder}
      showSearch={element.showSearch}
      filterOption={(inputValue, option) => option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
      defaultValue={element.defaultValue}
    >
      {(element.options || []).map((e) => {
        return (
          <Option key={e.value} value={e.value}>
            {e.label}
          </Option>
        );
      })}
    </Select>
  );
};

Index.propTypes = {
  element: PropTypes.object,
};

export default Index;
