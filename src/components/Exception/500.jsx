import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

const Exception500 = () => (
  <Result
    status="500"
    title="500"
    subTitle="抱歉，服务器出错了！请刷新后重试尝试"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
);

export default Exception500;
