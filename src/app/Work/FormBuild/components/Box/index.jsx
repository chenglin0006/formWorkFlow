import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

const Box = ({ changeCardList, element, boxDragId }) => {
  return (
    <div
      onClick={() => {
        changeCardList({ ...element });
      }}
      className={`box-bd ${`leftbox-${element.id}` === boxDragId ? 'dragging' : ''}`}
    >
      {element.name}
    </div>
  );
};

Box.propTypes = {
  changeCardList: PropTypes.func,
  element: PropTypes.object,
  boxDragId: PropTypes.string,
};

export default Box;
