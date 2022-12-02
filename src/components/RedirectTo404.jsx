/*  全局404组件
 *  相关设置文件：
 *    src\app\index.jsx；
 *    src\app\404.jsx；
 *    src\router\renderRouter.jsx；
 *    src\components\RedirectTo404.jsx
 */
import React from 'react';
import { Redirect } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default ({ location }) => {
  return <Redirect to={{ ...location, state: { is404: true } }} />;
};
