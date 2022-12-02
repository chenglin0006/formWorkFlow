/*eslint-disable */
import React, { useState, useContext } from 'react';
import AddNodeList from './AddOptionList';
import { Popover } from 'antd';
import WFC from '../OperatorContext';
function AddNode(props) {
  let [showPop, setShowPop] = useState(false);
  const { onAddNode } = useContext(WFC);
  function onOptionClick(type) {
    onAddNode(type, props.pRef, props.objRef);
    setShowPop(false);
  }
  return (
    <div className="add-node-btn-box">
      <div className="add-node-btn">
        {/* {showPop && (
          <div className="add-popover" style={{ position: 'absolute', zIndex: '10' }}>
            <AddNodeList onOptionClick={onOptionClick} />
          </div>
        )} */}
        <span>
          <Popover
            placement="right"
            trigger="hover"
            overlayClassName="add-node-popover-div"
            content={
              <div className="add-popover" style={{ position: 'absolute', zIndex: '10', display: 'contents' }}>
                <AddNodeList onOptionClick={onOptionClick} />
              </div>
            }
          >
            <button className="btn">
              <span className="iconfont"></span>
            </button>
          </Popover>
        </span>
      </div>
    </div>
  );
}

export default AddNode;
