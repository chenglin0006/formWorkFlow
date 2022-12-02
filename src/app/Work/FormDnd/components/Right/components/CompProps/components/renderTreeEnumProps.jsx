/* 树形枚举 */
import React, { useState, useEffect, Fragment } from 'react';
import { Tree } from 'antd';
import { PlusCircleFilled, EditFilled, DeleteFilled } from '@ant-design/icons';
import { TreeIterator } from '@/util';
import PropTypes from 'prop-types';

const RenderTreeEnumProps = ({
  setShowAddEnumModal,
  selectTreeEnumList,
  setEnumModalType,
  setActiveEnumNode,
  setSelectTreeEnumList,
}) => {
  const [treeData, setTreeData] = useState([]);
  useEffect(() => {
    const t = TreeIterator.map(selectTreeEnumList, (item) => {
      item.key = item.value;
      item.title = (
        <div className="tree-title-div">
          {item.label}
          <span className="add-icon">
            <PlusCircleFilled
              onClick={() => {
                setEnumModalType('add');
                setActiveEnumNode(item);
                setShowAddEnumModal(true);
              }}
            />
            <EditFilled
              onClick={() => {
                setEnumModalType('edit');
                setActiveEnumNode(item);
                setShowAddEnumModal(true);
              }}
            />
            <DeleteFilled
              onClick={() => {
                const l = TreeIterator.filterAsTree(selectTreeEnumList, (i) => {
                  return i.value !== item.value;
                });
                setSelectTreeEnumList(l);
              }}
            />
          </span>
        </div>
      );
      return item;
    });
    setTreeData(t);
  }, [selectTreeEnumList]);
  return (
    <Fragment>
      <div className="select-enum-list-div">
        <Tree selectable={false} blockNode treeData={treeData} />
      </div>
    </Fragment>
  );
};

RenderTreeEnumProps.propTypes = {
  setShowAddEnumModal: PropTypes.func,
  selectTreeEnumList: PropTypes.array,
  setEnumModalType: PropTypes.func,
  setActiveEnumNode: PropTypes.func,
  setSelectTreeEnumList: PropTypes.func,
};

export default RenderTreeEnumProps;
