/*eslint-disable */
import React from 'react';
import { Button, Drawer } from 'antd';
const Index = (props) => {
  const { onOk, onClose, currentNode } = props;
  console.log('currentNode', currentNode);
  return (
    <Drawer
      visible
      title={currentNode.current.nodeName}
      onClose={onClose}
      footer={
        <div>
          <Button
            onClick={() => {
              onOk('test');
            }}
          >
            确定
          </Button>
        </div>
      }
    >
      12313
    </Drawer>
  );
};
export default Index;
