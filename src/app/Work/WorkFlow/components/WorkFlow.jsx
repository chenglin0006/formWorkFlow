import React, { useState } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import EndNode from './Nodes/End';
import Render from './Nodes/Render';
import ZoomLayout from './ZoomLayout';
import { OptionTypes, NodeTemplates, NodeTypes } from './Nodes/Constants';
import NodeDetail from './Drawers/NodeDetail';
import WFC from './OperatorContext';

let currentNode = null;
function WorkFlow({ config: _config }) {
  const [config, setConfig] = useState(_config);
  const [showNodeDetail, setShowNodeDetail] = useState(false);
  function updateNode() {
    setConfig({ ...config });
  }
  // 链表操作: 几种行为， 添加行为，删除行为，点击行为     pRef.childNode -> objRef.childNode -> 后继
  // 添加节点
  function onAddNode(type, pRef, objRef) {
    const o = objRef.childNode;
    if (type === OptionTypes.APPROVER) {
      objRef.childNode = { ...NodeTemplates[OptionTypes.APPROVER], childNode: o };
    }
    if (type === OptionTypes.NOTIFIER) {
      objRef.childNode = { ...NodeTemplates[OptionTypes.NOTIFIER], childNode: o };
    }
    if (type === OptionTypes.CONDITION) {
      objRef.childNode = {
        ...NodeTemplates[OptionTypes.CONDITION],
        childNode: o,
        conditionNodes: [
          { ...NodeTemplates[OptionTypes.BRANCH], nodeName: '条件1', priorityLevel: 1 },
          { ...NodeTemplates[OptionTypes.BRANCH], nodeName: '条件2', priorityLevel: 2 },
        ],
      };
    }
    if (type === OptionTypes.BRANCH) {
      const ob = { ...NodeTemplates[NodeTypes.BRANCH] };
      ob.nodeName = `条件${objRef.conditionNodes.length + 1}`;
      ob.priorityLevel = objRef.conditionNodes.length + 1;
      objRef.conditionNodes.push(ob);
    }
    console.log('config', config);
    updateNode();
  }
  // 删除节点
  function onDeleteNode(pRef, objRef, type, index) {
    Modal.confirm({
      title: '是否删除节点？',
      onOk: () => {
        if (type === NodeTypes.BRANCH) {
          console.log([...objRef.conditionNodes], index);
          objRef.conditionNodes.splice(index, 1);
          console.log(objRef.conditionNodes);
        } else {
          const newObj = objRef.childNode;
          pRef.childNode = newObj;
        }
        updateNode();
      },
    });
  }

  // 获取节点
  function onSelectNode(pRef, objRef) {
    currentNode = {
      current: objRef,
      prev: pRef,
    };
    console.log('currentNode:', currentNode);
    console.log('config:', config);
    setShowNodeDetail(true);
  }

  const onOkDetailModal = (data) => {
    console.log('currentNode', currentNode);
    if (currentNode.current.type === 0) {
      currentNode.current.flowPermission = data;
    } else {
      currentNode.current.owner = data;
    }

    setShowNodeDetail(false);
  };

  const branchMove = (objRef, offset, index) => {
    console.log('branch move', objRef, offset, index);
    const o = objRef.conditionNodes[index];
    objRef.conditionNodes[index] = objRef.conditionNodes[index + offset];
    objRef.conditionNodes[index + offset] = o;
    updateNode();
  };

  return (
    <WFC.Provider value={{ config, updateNode, onAddNode, onDeleteNode, onSelectNode, branchMove }}>
      <section className="dingflow-design">
        <ZoomLayout>
          <Render config={config} />
          <EndNode />
        </ZoomLayout>
      </section>
      {showNodeDetail ? (
        <NodeDetail
          currentNode={currentNode}
          onClose={() => {
            setShowNodeDetail(false);
          }}
          onOk={onOkDetailModal}
        />
      ) : null}
    </WFC.Provider>
  );
}

WorkFlow.propTypes = {
  config: PropTypes.object,
};

export default WorkFlow;
