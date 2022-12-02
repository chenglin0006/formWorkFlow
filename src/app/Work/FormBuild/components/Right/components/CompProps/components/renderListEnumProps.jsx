/* 列表型枚举展示 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? 'transparent' : 'transparent',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'transparent' : 'transparent',
});

const RenderListEnumProps = ({
  selectEnumList,
  setSelectEnumList,
  setShowAddEnumModal,
  setActiveEnumNode,
  setEnumModalType,
}) => {
  const item = (ele) => {
    return (
      <div className="select-enum-item-div">
        {ele.label}
        <div className="select-enum-list-btn-div">
          <EditFilled
            onClick={() => {
              setActiveEnumNode(ele);
              setEnumModalType('edit');
              setShowAddEnumModal(true);
            }}
          />
          <DeleteFilled
            onClick={() => {
              const l = selectEnumList.filter((f) => {
                return f.value !== ele.value;
              });
              setSelectEnumList(l);
            }}
          />
        </div>
      </div>
    );
  };

  // beautifulDnd 排序
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onBtDndDragEnd = (result) => {
    console.log(result);
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(selectEnumList, result.source.index, result.destination.index);
      setSelectEnumList(items);
    }
  };

  const renderBtBnd = () => {
    return (
      <DragDropContext onDragEnd={onBtDndDragEnd}>
        <Droppable droppableId="dropEnum">
          {(provided1, snapshot1) => (
            <div {...provided1.droppableProps} ref={provided1.innerRef} style={getListStyle(snapshot1.isDraggingOver)}>
              {selectEnumList.map((ele, index) => {
                return (
                  <Draggable key={ele.value} draggableId={`enum-${ele.value}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        {item(ele)}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided1.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <Fragment>
      <div className="select-enum-list-div">{renderBtBnd()}</div>
    </Fragment>
  );
};

RenderListEnumProps.propTypes = {
  selectEnumList: PropTypes.array,
  setSelectEnumList: PropTypes.func,
  setShowAddEnumModal: PropTypes.func,
  setActiveEnumNode: PropTypes.func,
  setEnumModalType: PropTypes.func,
};

export default RenderListEnumProps;
