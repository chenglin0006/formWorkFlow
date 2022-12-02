import React, { useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import update from 'immutability-helper';
import { Tools } from '@/util';
import Right from './components/Right';
import Left from './components/Left';
import Center from './components/Center';
import Context from './FormContext';
import './index.less';

let castListTemp = [];

const App = () => {
  const { Dnd } = useDispatch();
  const DndData = useSelector((state) => state.Dnd);

  const { save } = Dnd;
  const { cardList, activeFormItem, rightForm, showHoverStyle } = DndData;

  useEffect(() => {
    console.log('cardList', cardList);
    castListTemp = [...cardList];
    if (cardList.length === 0) {
      save({
        activeFormItem: {},
      });
    }
  }, [cardList]);

  const moveCard = useCallback(
    (dragIndex, hoverIndex, parentUuid) => {
      if (parentUuid) {
        console.log('dnd parentUuid', parentUuid);
        let detailCard = {};
        const s = castListTemp;
        s.forEach((ele) => {
          if (ele.uuid === parentUuid) {
            detailCard = ele;
          }
        });
        const dragCard = detailCard.children[dragIndex];
        const list = update(detailCard.children, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        });
        detailCard.children = list;
        save({
          cardList: s,
        });
      } else {
        const dragCard = cardList[dragIndex];
        const list = update(cardList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        });
        save({
          cardList: list,
        });
      }
    },
    [cardList],
  );

  const clearAll = () => {
    save({
      cardList: [],
    });
  };

  // 删除card
  const deleteCard = (ele) => {
    let d = castListTemp;
    if (ele.parentUuid) {
      d.forEach((e) => {
        if (e.uuid === ele.parentUuid) {
          e.children = (e.children || []).filter((f) => {
            return f.uuid !== ele.uuid;
          });
        }
      });
    } else {
      d = d.filter((item) => {
        return item.uuid !== ele.uuid;
      });
    }

    save({ cardList: d, ...(ele.uuid === activeFormItem.uuid ? { activeFormItem: {} } : null) });
  };

  // 新增Card 或者 插入card
  const addCard = (params) => {
    const { cardObj, addIndex, parentUuid, shoulsRemoveOut } = params;
    let d = castListTemp;
    const obj = {
      ...cardObj,
      uuid: Tools.uuid(),
      isRequired: false,
      selectType: 1,
      mode: '',
      multiple: false,
      listType: 'text',
      parentUuid: parentUuid || '',
    };
    // 插入到明细
    if (parentUuid) {
      d.forEach((ele) => {
        if (ele.uuid === parentUuid) {
          ele.children = ele.children || [];
          if (addIndex || addIndex === 0) {
            ele.children.splice(addIndex, 0, { ...obj });
          } else {
            ele.children.push({ ...obj });
          }
        }
      });
    } else if (addIndex || addIndex === 0) {
      d.splice(addIndex + 1, 0, obj);
    } else {
      d.push(obj);
    }

    // 对于dus里的card插入到明细的情况，插入之后需要删除dus里的card
    if (shoulsRemoveOut) {
      d = d.filter((ele) => {
        return ele.uuid !== cardObj.uuid;
      });
    }

    save({
      cardList: d,
    });
  };

  const getContext = () => {
    return {
      save,
      cardList,
      moveCard,
      addCard,
      rightForm,
      showHoverStyle,
      activeFormItem,
      clearAll,
      deleteCard,
    };
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Context.Provider value={getContext()}>
        <div className="container">
          <div className="left-div">
            <Left />
          </div>
          <div className="center-div">
            <Center />
          </div>
          <div className="right-div">
            <Right />
          </div>
        </div>
      </Context.Provider>
    </DndProvider>
  );
};

export default App;
