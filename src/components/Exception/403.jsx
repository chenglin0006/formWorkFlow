import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

const Exception403 = () => (
  <Result
    status="403"
    title="403"
    subTitle="抱歉，您无权访问此页面"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
);

export default Exception403;
