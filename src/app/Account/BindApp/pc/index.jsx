import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Table, Badge, Button, Popconfirm } from 'antd';
import { defaultImg } from 'config/config';
import message from '@/components/message';
import AppItem from '../components/AppItem';

import styles from './index.module.less';

// 为提交时展示loading状态，简单封装Popconfirm
const PopconfirmBtn = (props) => {
  const { onOk, title, children, data } = props;
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    try {
      await onOk(data);
      setVisible(false);
      setConfirmLoading(false);
    } catch (error) {
      console.error(error);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Popconfirm
      title={title}
      visible={visible}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <Button size="small" danger onClick={showPopconfirm}>
        {children}
      </Button>
    </Popconfirm>
  );
};

PopconfirmBtn.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  data: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
};

const BindApp = (props) => {
  const [bindArray, setBindArray] = useState([]);
  const [unBindArray, setUnBindArray] = useState([]);
  const { bindApp, unbindApp, getRelateApps } = props;

  const initData = () => {
    getRelateApps().then((data) => {
      const blist = [];
      const ublist = [];
      data.forEach((ele) => {
        if (ele.bindUsername) {
          blist.push(ele);
        } else {
          ublist.push(ele);
        }
      });
      setBindArray(blist);
      setUnBindArray(ublist);
    });
  };

  useEffect(() => {
    initData();
  }, []);

  const onBindApp = async (params) => {
    const res = await bindApp(params);

    if (res.success) {
      message.success('绑定成功!');
      initData();
    }

    return res;
  };

  const onUnbindApp = async (record) => {
    const params = { appId: record.appId };
    const res = await unbindApp(params);

    if (res.success) {
      message.success('解除绑定成功!');
      initData();
    }

    return res;
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'credential',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '绑定账号信息',
      dataIndex: 'name',
      // align: 'right',
      render: (text, record) => {
        return (
          <span>
            <Avatar size={30} src={record.icon || defaultImg} />
            <span> {text}</span>
          </span>
        );
      },
    },
    {
      title: '详情',
      align: 'center',
      dataIndex: 'bindUsername',
    },
    {
      title: '绑定时间',
      align: 'center',
      dataIndex: 'bindTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: () => {
        return <Badge status="success" text="使用中" />;
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'protocol',
      render: (_, record) => {
        return (
          record.bindUsername && (
            <PopconfirmBtn data={record} title="确认解除绑定该账号？" onOk={onUnbindApp}>
              解除绑定
            </PopconfirmBtn>
          )
        );
      },
    },
  ];

  return (
    <div>
      <div className={styles.title}>关联应用</div>
      <div className={styles.content}>
        <div className={styles.tips}>关联应用后可以使用芝麻账号登录下列应用</div>
        <div className={styles.bindedTable}>
          <Table rowKey="appId" size="middle" columns={columns} dataSource={bindArray} bordered pagination={false} />
        </div>
        {unBindArray && !!unBindArray.length && (
          <div className={styles.unBindList}>
            <div className={styles.tips}>你还可以绑定以下第三方账号</div>
            <div>
              {unBindArray.map((item) => (
                <AppItem key={item.appId} data={item} onAdd={onBindApp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

BindApp.propTypes = {
  bindApp: PropTypes.func.isRequired,
  unbindApp: PropTypes.func.isRequired,
  getRelateApps: PropTypes.func.isRequired,
};

const mapDispatch = (dispatch) => {
  return {
    getCurrentUser: dispatch.common.getCurrentUser,
    getRelateApps: dispatch.homepage.getRelateApps,
    updateInfo: dispatch.account.updateInfo,
    bindApp: dispatch.account.bindApp,
    unbindApp: dispatch.account.unbindApp,
  };
};

const mapState = (state) => {
  return {
    data: state.common.currentUser,
  };
};

export default connect(mapState, mapDispatch)(BindApp);
