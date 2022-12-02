import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Drawer } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import RenderItem from '../RenderItem';
import './index.less';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? '#f6f7ff' : 'transparent',
  border: isDragging ? 'dashed 1px #fe7100' : 'none',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightgrey' : 'lightgrey',
  minHeight: '90vh',
  padding: '8px',
});

const Center = ({ changeCardList, cardList, save, activeFormItem, showHoverStyle, rightForm }) => {
  const [form] = Form.useForm();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const renderForm = (renderType) => {
    return (
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          {cardList.map((ele, index) => {
            return ele && ele.uuid ? (
              <Col span={ele.colSpan} key={ele.uuid}>
                {renderType === 'render' ? (
                  <Draggable key={ele.uuid} draggableId={`centercard-${ele.uuid}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <RenderItem
                          changeCardList={changeCardList}
                          form={form}
                          element={ele}
                          activeFormItem={activeFormItem}
                          showHoverStyle={showHoverStyle}
                          save={save}
                          rightForm={rightForm}
                        />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <RenderItem
                    form={form}
                    element={ele}
                    renderType={renderType}
                    activeFormItem={activeFormItem}
                    showHoverStyle={showHoverStyle}
                    save={save}
                    rightForm={rightForm}
                  />
                )}
              </Col>
            ) : null;
          })}
        </Row>
      </Form>
    );
  };
  return (
    <div
      className="dustbin-bd"
      onClick={() => {
        save({
          activeFormItem: {},
        });
      }}
    >
      <div style={{ textAlign: 'right' }}>
        <EyeOutlined
          onClick={() => {
            if (cardList.length === 0) {
              return;
            }
            setShowPreviewModal(true);
          }}
        />
      </div>
      <Droppable droppableId="dropDus">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            <div>{renderForm('render')}</div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Drawer
        width={500}
        title="预览"
        visible={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
        }}
        footer={false}
        destroyOnClose
      >
        {renderForm('preview')}
      </Drawer>
    </div>
  );
};

Center.propTypes = {
  changeCardList: PropTypes.func,
  cardList: PropTypes.array,
  save: PropTypes.func,
  activeFormItem: PropTypes.object,
  rightForm: PropTypes.object,
  showHoverStyle: PropTypes.bool,
};

export default Center;
