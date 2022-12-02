import React from 'react';
import { TreeSelect } from 'antd';
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
        item.title = item.label;
        if (item.children && item.children.length === 0) {
          delete item.children;
        }
      });
      serO(options);
    }
  }, [element.options]);

  return (
    <TreeSelect
      allowClear
      style={{ width: '100%' }}
      defaultValue={element.defaultValue}
      treeData={o}
      placeholder={element.placeholder}
      showSearch={element.showSearch}
      filterTreeNode={(inputValue, treeNode) => {
        return treeNode.props.title.indexOf(inputValue) > -1;
      }}
      multiple={element.multiple}
      treeDefaultExpandAll
    />
  );
};

Index.propTypes = {
  element: PropTypes.object,
};

export default Index;
