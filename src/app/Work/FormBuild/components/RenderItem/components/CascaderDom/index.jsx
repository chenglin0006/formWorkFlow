import React from 'react';
import { Cascader } from 'antd';
import { useState, useEffect } from 'react';
import { TreeIterator, Tools } from '@/util';
import PropTypes from 'prop-types';

const Index = (props) => {
  const { element } = props;
  const [o, serO] = useState([]);
  useEffect(() => {
    if (element.options) {
      const options = Tools.deepClone(element.options);
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
    />
  );
};

Index.propTypes = {
  element: PropTypes.object,
};

export default Index;
