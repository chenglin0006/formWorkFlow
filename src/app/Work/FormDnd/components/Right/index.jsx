import React from 'react';
import './index.less';
import { Tabs } from 'antd';
import CompProps from './components/CompProps';

const { TabPane } = Tabs;

const Right = () => {
  return (
    <div>
      <Tabs className="form-build-item-props-tab" defaultActiveKey="1">
        <TabPane tab="组件属性" key="1">
          <CompProps />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Right;
