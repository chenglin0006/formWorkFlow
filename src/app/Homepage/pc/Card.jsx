/*eslint-disable */
import React from 'react';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
// eslint-disable-next-line import/extensions
import { List, Card, Avatar, Modal, Skeleton } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import styles from './index.module.less';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
  display: 'inline-block',
};
export const DEMO = ({ id, text, index, moveCard, item, loading, defaultImg }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <List.Item>
        <Card
          className={styles.card}
          hoverable
          onClick={() => {
            onGoApp(item);
          }}
        >
          <Skeleton loading={loading} avatar title={false} paragraph={{ rows: 3, width: '100%' }} active>
            <div className={styles.cardBody}>
              <div className={styles.cardMeta}>
                <div className={styles.cardAvatar}>
                  <Avatar size={48} src={item.icon || defaultImg}>
                    {item.text}
                  </Avatar>
                </div>
                <div className={styles.cardTitle}> {item.text}</div>
              </div>
              <div className={styles.cardAction}>
                <RightOutlined />
              </div>
            </div>
          </Skeleton>
        </Card>
      </List.Item>
    </div>
  );
};
