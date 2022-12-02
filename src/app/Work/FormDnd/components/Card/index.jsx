/* eslint-disable no-lonely-if */
import React, { useRef, useState, Fragment, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import { message } from 'antd';
import store from '@/store';
import { ItemTypes } from '../../types';
import FormContext from '../../FormContext';
import './index.less';

const Card = ({ index, children, element }) => {
  const ref = useRef(null);

  const [targtIndex, setTargetIndex] = useState();

  const { moveCard, activeFormItem, addCard } = useContext(FormContext);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    end: (item, monitor) => {
      console.log('dnd card drag end', item, monitor.getDropResult());
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    item: { index, isSource: true, ...element, dragType: ItemTypes.CARD },
  });
  const [{ canDrop, isOver, isOverShallow }, drop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.BOX],
    collect: (monitor) => {
      return {
        dropRes: monitor.getDropResult(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        // You can check monitor.isOver({ shallow: true })to test whether the hover happens over only the current target, or over a nested one
        isOverShallow: monitor.isOver({ shallow: true }),
      };
    },
    drop(item, monitor) {
      const dropResult = monitor.getDropResult();
      console.log('dnd card drop drop', item, monitor.getDropResult(), element);
      store.dispatch.Dnd.save({
        showHoverStyle: false,
      });

      // 表示是落在了card上
      if (dropResult === null) {
        // 表示是左边插入
        if (item.dragType === ItemTypes.BOX) {
          if (element.parentUuid) {
            // 如果是插入到明细里面的某个元素
            const { parentUuid } = element;
            if (item.type === 'detailList') {
              message.error('暂不支持该控件添加到明细');
              return null;
            }
            addCard({
              cardObj: { ...item },
              addIndex: item.addIndex,
              parentUuid,
            });
          } else {
            addCard({
              cardObj: { ...item },
              addIndex: item.addIndex - 1,
            });
          }
        } else {
          // 表示是dus的card插入明细或者card之间调整顺序

          if (element.parentUuid && item.parentUuid && element.parentUuid === item.parentUuid) {
            // 明细里面的card调整顺序
            moveCard(item.index, targtIndex, item.parentUuid);
          } else if (element.parentUuid && !item.parentUuid) {
            // dus里面的card插入到detailList
            const { parentUuid } = element;
            if (item.type === 'detailList') {
              message.error('暂不支持该控件添加到明细');
              return null;
            }
            addCard({
              cardObj: { ...item },
              addIndex: item.addIndex,
              parentUuid,
              shoulsRemoveOut: true,
            });
          } else {
            //  dus里的card调整顺序
            if (targtIndex || targtIndex === 0) {
              moveCard(item.index, targtIndex);
            }
          }
        }
      }
      return { index, isTarget: true, name: 'Dustbin-card' };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
      if (dragIndex === hoverIndex && item.uuid === element.uuid) {
        return;
      }
      // 左侧的组件拖动插入到cardlist不用考虑是向下还是向上拖拽
      if (item.dragType === ItemTypes.BOX) {
        item.addIndex = hoverIndex;
      }
      // dus的card往明细里面移动时不用考虑是向下还是向上拖拽
      if (item.dragType === ItemTypes.CARD && element.type !== 'detailList' && element.parentUuid && !item.parentUuid) {
        item.addIndex = hoverIndex;
        setTargetIndex(hoverIndex);
        return;
      }

      // 确定屏幕上矩形范围
      const hoverBoundingRect = ref.current && ref.current.getBoundingClientRect();
      // 获取中点垂直坐标
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // 确定鼠标位置
      const clientOffset = monitor.getClientOffset();
      // 获取距顶部距离
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      /**
       * 只在鼠标越过一半物品高度时执行移动。
       *
       * 当向下拖动时，仅当光标低于50%时才移动。
       * 当向上拖动时，仅当光标在50%以上时才移动。
       *
       * 可以防止鼠标位于元素一半高度时元素抖动的状况
       */

      // 向下拖动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        setTargetIndex(null);
        return;
      }
      // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        setTargetIndex(null);
        return;
      }
      setTargetIndex(hoverIndex);
    },
  });

  const isActive = canDrop && isOver && isDragging;
  let backgroundColor = 'transparent';
  if (isActive) {
    backgroundColor = 'transparent';
  } else if (canDrop) {
    backgroundColor = 'transparent';
  }

  /**
   * 使用 drag 和 drop 对 ref 进行包裹，则组件既可以进行拖拽也可以接收拖拽组件
   * 使用 dragPreview 包裹组件，可以实现拖动时预览该组件的效果
   */
  //   dragPreview(drop(ref));
  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  let showInStatus = false;
  if (isOver && index === targtIndex && isOverShallow) {
    showInStatus = true;
  }

  return (
    <Fragment>
      {showInStatus ? <div className="in-div" /> : null}
      <div
        className={`card ${element.uuid === activeFormItem.uuid ? 'active' : ''}`}
        ref={ref}
        style={{ backgroundColor, opacity }}
      >
        {children}
      </div>
    </Fragment>
  );
};

Card.propTypes = {
  index: PropTypes.number,
  children: PropTypes.object,
  element: PropTypes.object,
};

export default Card;
