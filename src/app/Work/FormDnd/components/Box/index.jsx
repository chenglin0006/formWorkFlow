import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';
import { ItemTypes } from '../../types';
import FormContext from '../../FormContext';
import './index.less';

const Box = ({ element }) => {
  const { addCard } = useContext(FormContext);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: () => {
      return { ...element, dragType: ItemTypes.BOX };
    },
    end: (item, monitor) => {
      console.log('dnd box drag end', item, monitor.getDropResult());
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const opacity = isDragging ? 0.4 : 1;
  return (
    <div
      ref={drag}
      onClick={() => {
        addCard({ cardObj: element });
      }}
      className="box"
      style={{ opacity }}
    >
      {element.name}
    </div>
  );
};

Box.propTypes = {
  element: PropTypes.object,
};

export default Box;
