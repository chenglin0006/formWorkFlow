/* 添加枚举按钮 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const RenderAddEnumBtn = ({ setShowAddEnumModal, setEnumModalType, activeFormItem }) => {
  let title = '';
  if (activeFormItem) {
    if (activeFormItem.type === 'select' || activeFormItem.type === 'checkbox' || activeFormItem.type === 'radio') {
      title = '添加选项';
    } else if (activeFormItem.type === 'cascader' || activeFormItem.type === 'treeSelect') {
      title = '添加父级';
    }
  }

  return (
    <Fragment>
      <div>
        <Button
          size="small"
          onClick={() => {
            setEnumModalType('add');
            setShowAddEnumModal(true);
          }}
        >
          {title}
        </Button>
      </div>
    </Fragment>
  );
};

RenderAddEnumBtn.propTypes = {
  setShowAddEnumModal: PropTypes.func,
  setEnumModalType: PropTypes.func,
  activeFormItem: PropTypes.object,
};

export default RenderAddEnumBtn;
