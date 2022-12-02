/* eslint-disable import/no-cycle */
import { useDrop } from 'react-dnd';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Col, message } from 'antd';
import Card from '../../../Card';
import RenderItem from '../../index';
import FormContext from '../../../../FormContext';
import Preview from './preview';
import { ItemTypes } from '../../../../types';
import './index.less';

const DetailIndex = (props) => {
  const { element, form, renderType = 'render' } = props;
  const { children = [] } = element;

  const { moveCard, save, addCard } = useContext(FormContext);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.BOX, ItemTypes.CARD],
    drop: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult === null) {
        const { uuid } = element;
        if (item.type === 'detailList') {
          message.error('暂不支持该控件添加到明细');
          return null;
        }
        const p = {
          cardObj: { ...item },
          addIndex: item.addIndex,
          parentUuid: uuid,
          shoulsRemoveOut: false,
        };
        if (item.dragType === ItemTypes.BOX) {
          p.shoulsRemoveOut = false;
        } else if (item.dragType === ItemTypes.CARD) {
          item.addIndex = '';
          p.cardObj = { ...item };
          p.shoulsRemoveOut = true;
        }
        addCard(p);
      }
      return { name: `Detail-${element.uuid}` };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = canDrop && isOver;
  let backgroundColor = '#e1e1e1';
  if (isActive) {
    backgroundColor = 'transpant';
  } else if (canDrop) {
    backgroundColor = '#ffffff';
  }

  const renderForm = () => {
    return (
      <>
        {(children || []).map((ele, index) => {
          return ele && ele.uuid ? (
            <Col span={ele.colSpan} key={ele.uuid}>
              {renderType === 'render' ? (
                <Card index={index} moveCard={moveCard} element={ele}>
                  <RenderItem element={ele} form={form} renderType={renderType} />
                </Card>
              ) : (
                <RenderItem element={ele} renderType={renderType} />
              )}
            </Col>
          ) : null;
        })}
      </>
    );
  };

  const renderFun = () => {
    if (renderType === 'render') {
      return <div className="detail-list-div">{children.length ? renderForm() : <span>拖拽至此处</span>}</div>;
    }
    return (
      <div>
        <Preview form={form} element={element} />
      </div>
    );
  };

  return (
    <div
      ref={drop}
      className="dustbin-detail-list"
      style={{ backgroundColor, minHeight: '100px' }}
      onClick={() => {
        save({
          activeFormItem: {},
        });
      }}
    >
      {renderFun()}
    </div>
  );
};

DetailIndex.propTypes = {
  element: PropTypes.object,
  renderType: PropTypes.string,
  form: PropTypes.object,
};

export default DetailIndex;
