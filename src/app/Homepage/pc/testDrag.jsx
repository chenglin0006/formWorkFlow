/*eslint-disable */
import React, { useEffect } from 'react';
import { useState, useCallback } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { List, Card, Avatar, Modal, Skeleton } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { open } from '@/util/common';
import { defaultImg } from 'config/config';
import { titleMap } from '../dict';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DEMO } from './Card';

import styles from './index.module.less';
import { forwardRef } from 'react';
import { css } from '@emotion/react';
import './index.less';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  SortableContext,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const Item = forwardRef(({ id, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className="item-div"
      css={css`
        width: 100px;
        height: 100px;
        background: grey;
      `}
    >
      {id}
    </div>
  );
});

const SortableItem = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return <Item ref={setNodeRef} style={style} {...attributes} {...listeners} id={id} />;
};

// fake data generator
const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

const TestDrag = (props) => {
  const { history, getApps, apps, loading } = props;
  const [cards, setCards] = useState([
    {
      id: 1,
      text: '1Write a cool JS library',
    },
    {
      id: 2,
      text: '2Make it generic enough',
    },
    {
      id: 3,
      text: '3Write a cool JS library',
    },
    {
      id: 4,
      text: '4Make it generic enough',
    },
    {
      id: 5,
      text: '5Write a cool JS library',
    },
    {
      id: 6,
      text: '6Make it generic enough',
    },
  ]);
  const [data, setData] = useState(['1', '2', '3', '4', '5', '6']);
  const [bitems, setBitems] = useState(getItems(10));
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']);
  useEffect(() => {
    getApps();
  }, []);

  const handleNext = (data = {}) => {
    if (data.bind) {
      open(data.url);
    } else {
      Modal.confirm({
        title: '未绑定该应用',
        content: '绑定应用后，可免密登录。是否需要去绑定？',
        okText: '去绑定',
        cancelText: '原账号密码登录',
        closable: true,
        maskClosable: true,
        onOk() {
          history.push('/account/bind-app');
        },
        cancelButtonProps: {
          // onCancel会在modal关闭时触发，所以打开页面改到onClick事件
          onClick: () => {
            open(data.url);
          },
        },
        onCancel() {},
      });
    }
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(bitems, result.source.index, result.destination.index);

    setBitems(items);
    console.log(bitems, '=====');
  };

  const onGoApp = async (item) => {
    const { goToApp } = props;

    const data = await goToApp({
      appId: item.appId,
    });

    if (data) {
      handleNext(data);
    }
  };

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex];
      setCards(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      );
      console.log(cards, '====');
    },
    [cards],
  );

  return (
    <div className={styles.homepageWrapper}>
      <h1>react-dnd</h1>
      <DndProvider backend={HTML5Backend}>
        <div>
          {cards.map((card, i) => {
            return (
              <DEMO
                key={card.id}
                index={i}
                id={card.id}
                text={card.text}
                moveCard={moveCard}
                item={card}
                loading={loading}
                defaultImg={defaultImg}
              />
            );
          })}
        </div>
        {/* <Container data={data} /> */}
      </DndProvider>
      <h1>kit-dnd</h1>
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => {
            setActiveId(event.active.id);
          }}
          onDragEnd={({ active, over }) => {
            if (!over) return null;
            if (active.id === over.id) return null;
            const items = data;
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            setData(newItems);
            setActiveId(null);
          }}
        >
          <div
            css={css`
              width: 400px;
              margin-top: 45px;
              display: grid;
              align-items: center;
              max-width: 100%;
              grid-template-columns: repeat(3, 1fr);
              gap: 30px;
            `}
            className="container-drag-div"
          >
            <SortableContext items={data} strategy={rectSortingStrategy}>
              {data.map((item, index) => {
                return <SortableItem id={item} key={item} isDragging={activeId === item} />;
              })}
            </SortableContext>
          </div>
          <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
        </DndContext>
      </div>
      <h1>beautiful-dnd</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              className={'beautiful-drag'}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {bitems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={'beautiful-item'}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

TestDrag.propTypes = {
  history: PropTypes.object.isRequired,
  getApps: PropTypes.func.isRequired,
  goToApp: PropTypes.func.isRequired,
  apps: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  loading: PropTypes.bool,
};

const mapDispatch = (dispatch) => {
  return {
    getApps: dispatch.homepage.getApps,
    goToApp: dispatch.homepage.goToApp,
  };
};

const mapState = (state) => {
  return {
    apps: state.homepage.apps,
    loading: state.loading.effects.homepage.getApps,
  };
};

export default connect(mapState, mapDispatch)(TestDrag);
