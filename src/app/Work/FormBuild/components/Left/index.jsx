import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Box from '../Box';
import './index.less';

const { TabPane } = Tabs;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? '#f6f7ff' : 'transparent',
  border: isDragging ? 'dashed 1px #e1e1e1' : 'none',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'transparent' : 'transparent',
});

const Left = (props) => {
  const { changeCardList, boxList, boxDragStart, boxDragId } = props;

  const renderBox = (ele, index) => {
    return (
      <div key={ele.id}>
        <Draggable key={ele.id} draggableId={`leftbox-${ele.id}`} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            >
              <Box boxDragId={boxDragId} element={ele} type={ele.text} changeCardList={changeCardList} />
            </div>
          )}
        </Draggable>
      </div>
    );
  };

  const renderBoxStatic = (ele) => {
    return (
      <div className="box-bd-static" key={`${ele.id}static`}>
        {ele.name}
      </div>
    );
  };

  return (
    <Fragment>
      <Droppable droppableId="droppableBox">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
            <Tabs className="form-build-tab" defaultActiveKey="">
              <TabPane tab="常用组件" key="1">
                {boxList
                  .filter((f) => {
                    return f.componentType === 'simple';
                  })
                  .map((ele, index) => {
                    return (
                      <div className={`box-bd-div ${boxDragStart ? 'box-drag' : ''}`} key={ele.id}>
                        {renderBox(ele, index)}
                        {renderBoxStatic(ele)}
                      </div>
                    );
                  })}
              </TabPane>
              <TabPane tab="自定义组件" key="2">
                {boxList
                  .filter((f) => {
                    return f.componentType === 'own';
                  })
                  .map((ele, index) => {
                    return (
                      <div className={`box-bd-div ${boxDragStart ? 'box-drag' : ''}`} key={ele.id}>
                        {renderBox(ele, index)}
                        {renderBoxStatic(ele)}
                      </div>
                    );
                  })}
              </TabPane>
            </Tabs>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Fragment>
  );
};

Left.propTypes = {
  changeCardList: PropTypes.func,
  boxList: PropTypes.array,
  boxDragStart: PropTypes.bool,
  boxDragId: PropTypes.string,
};

export default Left;
