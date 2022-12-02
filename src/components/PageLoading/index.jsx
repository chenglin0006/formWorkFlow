/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

const PageLoading = ({ delay }) => {
  // const [show, setShow] = useState(false);

  // useEffect(() => {
  //   const timeout = setTimeout(() => setShow(true), 300);
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, []);

  return (
    // show && (
    <div
      style={{
        position: 'fixed',
        left: '0',
        right: '0',
        top: '0',
        bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin size="large" delay={delay} />
    </div>
    // )
  );
};

PageLoading.propTypes = {
  delay: PropTypes.number,
};

export default PageLoading;
