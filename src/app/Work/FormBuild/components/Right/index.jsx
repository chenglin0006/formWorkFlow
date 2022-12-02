import React from 'react';
import PropTypes from 'prop-types';
import './index.less';
import { Tabs } from 'antd';
import CompProps from './components/CompProps';

const { TabPane } = Tabs;

const Right = ({ save, activeFormItem, cardList }) => {
  return (
    <div>
      <Tabs className="form-build-item-props-tab" defaultActiveKey="">
        <TabPane tab="组件属性" key="1">
          <CompProps activeFormItem={activeFormItem} save={save} cardList={cardList} />
        </TabPane>
      </Tabs>
    </div>
  );
};
Right.propTypes = {
  save: PropTypes.func,
  activeFormItem: PropTypes.object,
  cardList: PropTypes.array,
};

export default Right;
