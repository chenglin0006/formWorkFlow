import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import NodeWrap from './Wrap';
import WFC from '../OperatorContext';

function StartNode(props) {
  const { onSelectNode } = useContext(WFC);
  const { pRef, objRef, onContentClick, nodeData } = props;
  function onContentClickFun() {
    onSelectNode(pRef, objRef);
    if (onContentClick) {
      onContentClick();
    }
  }

  return (
    <NodeWrap
      type={0}
      objRef={props.objRef}
      onContentClick={onContentClickFun}
      title={<span>{nodeData.nodeName}</span>}
    >
      <div className="text">{nodeData.flowPermission || '所有人'}</div>
      <i className="anticon anticon-right arrow" />
    </NodeWrap>
  );
}
StartNode.propTypes = {
  pRef: PropTypes.object,
  objRef: PropTypes.object,
  onContentClick: PropTypes.func,
  flowPermission: PropTypes.string,
  nodeName: PropTypes.string,
  nodeData: PropTypes.object,
};

export default StartNode;
