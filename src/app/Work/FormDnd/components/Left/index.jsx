import React, { Fragment } from 'react';
import { Tabs } from 'antd';
import Box from '../Box';
import { itemData } from '../../../FormBuild/data';
import './index.less';

const { TabPane } = Tabs;

const Left = () => {
  const renderBox = (ele) => {
    return (
      <div key={ele.id}>
        <Box element={ele} type={ele.text} />
      </div>
    );
  };

  return (
    <Fragment>
      <Tabs defaultActiveKey="">
        <TabPane tab="常用组件" key="1">
          {itemData
            .filter((f) => {
              return f.componentType === 'simple';
            })
            .map((ele) => {
              return renderBox(ele);
            })}
        </TabPane>
        <TabPane tab="自定义组件" key="2">
          {itemData
            .filter((f) => {
              return f.componentType === 'own';
            })
            .map((ele) => {
              return renderBox(ele);
            })}
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

export default Left;
