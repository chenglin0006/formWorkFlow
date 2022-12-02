import { useDrop } from 'react-dnd';
import React, { useState, useContext } from 'react';
import { Form, Button, Row, Col, Drawer } from 'antd';
import Card from '../Card';
import RenderItem from '../RenderItem';
import { ItemTypes } from '../../types';
import FormContext from '../../FormContext';
import './index.less';

const Dustbin = () => {
  const [form] = Form.useForm();
  const [formPreview] = Form.useForm();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const { save, cardList, moveCard, addCard, clearAll } = useContext(FormContext);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.BOX],
    drop(item, monitor) {
      const dropResult = monitor.getDropResult();
      console.log('dnd dus drop drop', item, dropResult);
      if (item) {
        item.dragType = ItemTypes.CARD;
        if (dropResult === null) {
          addCard({
            cardObj: { ...item },
          });
        }
      }
      return { name: 'Dustbin' };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = canDrop && isOver;
  let backgroundColor = '#e1e1e1';
  if (isActive) {
    backgroundColor = '#999999';
  } else if (canDrop) {
    backgroundColor = '#666666';
  }

  const previewFun = () => {
    formPreview.resetFields();
    setShowPreviewModal(true);
  };

  const renderForm = (renderType) => {
    return (
      <Form form={renderType === 'render' ? form : formPreview}>
        <Row gutter={16}>
          {cardList.map((ele, index) => {
            return ele && ele.uuid ? (
              <Col span={24} key={ele.uuid}>
                {renderType === 'render' ? (
                  <Card index={index} moveCard={moveCard} element={ele}>
                    <RenderItem form={form} element={ele} renderType={renderType} />
                  </Card>
                ) : (
                  <RenderItem form={form} element={ele} renderType={renderType} />
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
      ref={drop}
      className="dustbin"
      style={{ backgroundColor }}
      onClick={() => {
        save({
          activeFormItem: {},
        });
      }}
    >
      {cardList.length ? (
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              previewFun();
            }}
          >
            预览
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
          >
            清空
          </Button>
        </div>
      ) : null}

      <div>{renderForm('render')}</div>
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

export default Dustbin;
