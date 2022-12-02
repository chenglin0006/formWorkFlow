import React from 'react';
import { Cascader } from 'antd';
import { useState, useEffect } from 'react';
import { TreeIterator } from '@/util';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element, value, onChange } = props;
  const [o, serO] = useState([]);
  useEffect(() => {
    if (element.options) {
      const options = [...element.options];
      TreeIterator.each(options, (item) => {
        if (item.children && item.children.length === 0) {
          delete item.children;
        }
      });
      serO(options);
    }
  }, [element.options]);

  function filter(inputValue, path) {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  return (
    <Cascader
      defaultValue={element.defaultValue}
      placeholder={element.placeholder}
      options={o}
      multiple={element.multiple}
      showSearch={element.showSearch ? { filter } : false}
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
