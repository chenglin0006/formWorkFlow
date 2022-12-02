/* eslint-disable react/button-has-type */
/* eslint-disable import/no-cycle */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AddNode from './Add';
import Render from './Render';
import { NodeTypes } from './Constants';
import WFC from '../OperatorContext';

function CoverLine({ first = false, last = false }) {
  return (
    <React.Fragment>
      {first && <div className="top-left-cover-line" />}
      {first && <div className="bottom-left-cover-line" />}
      {last && <div className="top-right-cover-line" />}
      {last && <div className="bottom-right-cover-line" />}
    </React.Fragment>
  );
}

CoverLine.propTypes = {
  first: PropTypes.bool,
  last: PropTypes.bool,
};

function BranchNode(props) {
  const { first = false, last = false, onBranchClick, objRef, sortLeft, branchData, delBranch, sortRight } = props;
  return (
    <div className="condition-node">
      <div className="condition-node-box">
        <div className="auto-judge" onClick={() => onBranchClick(objRef)}>
          {!first && (
            <div
              className="sort-left"
              onClick={(e) => {
                e.stopPropagation();
                sortLeft();
              }}
            >
              《
            </div>
          )}
          <div className="title-wrapper">
            <span className="editable-title">{branchData.nodeName}</span>
            <span className="priority-title">优先级{branchData.priorityLevel}</span>
            <i
              className="anticon anticon-close close"
              onClick={(e) => {
                e.stopPropagation();
                delBranch();
              }}
            />
          </div>
          {!last && (
            <div
              className="sort-right"
              onClick={(e) => {
                e.stopPropagation();
                sortRight();
              }}
            >
              》
            </div>
          )}
          <div className="content">
            <div className="text">
              {branchData.owner ? branchData.owner : <span className="placeholder">请设置条件</span>}
            </div>
            {/* <i className="anticon anticon-right arrow"></i> */}
          </div>
        </div>
        <AddNode objRef={props.objRef} />
      </div>
    </div>
  );
}

BranchNode.propTypes = {
  first: PropTypes.bool,
  last: PropTypes.bool,
  onBranchClick: PropTypes.func,
  sortLeft: PropTypes.func,
  sortRight: PropTypes.func,
  delBranch: PropTypes.func,
  objRef: PropTypes.object,
  branchData: PropTypes.object,
};

function ConditionNode({ conditionNodes: branches = [], ...restProps }) {
  const { onAddNode, onDeleteNode, onSelectNode, branchMove } = useContext(WFC);
  function addBranch() {
    onAddNode(NodeTypes.BRANCH, restProps.pRef, restProps.objRef);
  }
  function delBranch(i) {
    if (branches.length === 2) {
      onDeleteNode(restProps.pRef, restProps.objRef);
      return;
    }
    console.log('delBranch(i)', i);
    onDeleteNode(restProps.pRef, restProps.objRef, NodeTypes.BRANCH, i);
  }
  function sortLeft(i) {
    branchMove(restProps.objRef, -1, i);
  }
  function sortRight(i) {
    branchMove(restProps.objRef, 1, i);
  }
  function onBranchClick(objRef) {
    onSelectNode(restProps.objRef, objRef);
  }

  return (
    branches &&
    branches.length > 0 && (
      <div className="branch-wrap">
        <div className="branch-box-wrap">
          <div className="branch-box">
            <button className="add-branch" onClick={addBranch}>
              添加条件
            </button>
            {branches.map((item, index) => {
              return (
                <div className="col-box" key={index.toString()}>
                  <BranchNode
                    {...item}
                    branchData={item}
                    first={index === 0}
                    onBranchClick={onBranchClick}
                    delBranch={() => delBranch(index)}
                    last={index === branches.length - 1}
                    objRef={item}
                    sortRight={() => sortRight(index)}
                    sortLeft={() => sortLeft(index)}
                  />
                  {item.childNode && <Render pRef={item} config={item.childNode} />}
                  <CoverLine first={index === 0} last={index === branches.length - 1} />
                </div>
              );
            })}
          </div>
          <AddNode objRef={restProps.objRef} />
        </div>
      </div>
    )
  );
}

ConditionNode.propTypes = {
  conditionNodes: PropTypes.array,
};

export default ConditionNode;
