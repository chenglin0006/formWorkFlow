import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tools, TreeIterator } from '@/util';
import { DragDropContext } from 'react-beautiful-dnd';
import Right from './components/Right';
import Left from './components/Left';
import Center from './components/Center';
import { itemData } from './data';
import './index.less';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getNewItem = (ele) => {
  const obj = {
    ...ele,
    uuid: Tools.uuid(),
    itemParamName: '',
    colSpan: 24,
    isRequired: false,
    selectType: 1,
    mode: '',
    multiple: false,
    listType: ele.listType || 'text',
  };
  return obj;
};

// btdnd 从左侧移到中间
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  let [removed] = sourceClone.splice(droppableSource.index, 1);
  removed = getNewItem(removed);
  destClone.splice(droppableDestination.index, 0, removed);
  return destClone;
};

const App = () => {
  const [boxDragStart, setBoxDragStart] = useState(false);
  const [boxDragId, setBoxDragId] = useState('');
  const [boxList] = useState(itemData);

  const { Dnd } = useDispatch();
  const DndData = useSelector((state) => state.Dnd);

  const { save } = Dnd;
  const { cardList, activeFormItem, showHoverStyle, rightForm } = DndData;

  useEffect(() => {
    if (cardList.length === 0) {
      save({
        activeFormItem: {},
      });
    } else {
      const allCardList = TreeIterator.filter(cardList, (item) => {
        return item.id;
      });
      const l = allCardList.filter((ele) => {
        return ele.uuid === activeFormItem.uuid;
      });
      // 如果当前选中card被删除了，那将activeFormItem置为{}
      if (l.length === 0) {
        save({
          activeFormItem: {},
        });
      }
    }
  }, [cardList]);

  const changeCardList = (ele, action = 'add', addIndex) => {
    const element = Tools.deepClone(ele);
    if (action === 'add') {
      if (element.children) {
        element.children.forEach((s) => {
          s.uuid = Tools.uuid();
        });
      }
      const obj = getNewItem(element);
      const l = [...cardList];
      if (addIndex || addIndex === 0) {
        l.splice(addIndex + 1, 0, obj);
      } else {
        l.push(obj);
      }
      save({
        cardList: l,
      });
    } else {
      let l = [...cardList];
      l = l.filter((item) => {
        return item.uuid !== ele.uuid;
      });
      save({
        cardList: l,
      });
    }
  };

  const onDragEnd = (result) => {
    console.log('result', result);
    const { source, destination } = result;

    if (source.droppableId === 'droppableBox') {
      setBoxDragStart(false);
      setBoxDragId('');
    }

    if (!destination || (destination && destination.droppableId !== 'dropDus')) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(cardList, result.source.index, result.destination.index);
      save({
        cardList: items,
      });
    } else {
      const resultEnd = move(boxList, cardList, source, destination);
      save({
        cardList: resultEnd,
      });
    }
  };

  const onDragStart = (res) => {
    console.log(res);
    if (res.source.droppableId === 'droppableBox') {
      setBoxDragStart(true);
      setBoxDragId(res.draggableId);
    } else {
      setBoxDragStart(false);
      setBoxDragId('');
    }
  };

  return (
    <div className="container">
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="left-div">
          <Left boxDragId={boxDragId} boxDragStart={boxDragStart} boxList={boxList} changeCardList={changeCardList} />
        </div>
        <div className="center-div">
          <Center
            activeFormItem={activeFormItem}
            save={save}
            cardList={cardList}
            changeCardList={changeCardList}
            showHoverStyle={showHoverStyle}
            rightForm={rightForm}
          />
        </div>
      </DragDropContext>
      <div className="right-div">
        <Right activeFormItem={activeFormItem} save={save} cardList={cardList} />
      </div>
    </div>
  );
};

export default App;
