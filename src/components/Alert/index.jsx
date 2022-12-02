/* eslint-disable */
import { Alert } from 'antd';
import React, { memo, useEffect, useState, useRef } from 'react';
// import PropTypes from 'prop-types';
function Index(props) {
  const { duration } = props;
  const [time, setTime] = useState(true); //倒计时时间
  const timeRef = useRef(); //设置延时器

  useEffect(() => setTime(duration - 1), [props]);

  //倒计时
  useEffect(() => {
    //如果设置倒计时且倒计时不为0
    if (time && time !== 0) {
      timeRef.current = setTimeout(() => setTime((time) => time - 1), 1000);
    } else handleClose();
    return () => clearTimeout(timeRef.current);
  }, [time]);

  const handleClose = () => {
    setTime(0);
    props.clearMsg();
  };

  return !!time && <Alert {...props} afterClose={handleClose} />;
}
// Index.propTypes = {
//   duration: PropTypes.number,

// }
export default memo(Index);
