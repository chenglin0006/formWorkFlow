import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Popconfirm } from 'antd';
import { List, Modal } from 'antd-mobile';
import { defaultImg } from 'config/config';
import message from '@/components/message';
import AppItem from '../components/AppItem';

import styles from './index.module.less';

// 为提交时展示loading状态，简单封装Popconfirm
const PopconfirmBtn = (props) => {
  const { onOk, title, children, data } = props;
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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

  const showPopconfirm = () => {
    // setVisible(true);
    Modal.alert(title, null, [{ text: '取消' }, { text: '确定', onPress: handleOk }]);
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
      <Button size="small" danger type="text" onClick={showPopconfirm}>
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

  return (
    <div>
      <div className={styles.title}>关联应用</div>
      <div className={`${styles.content} full-width`}>
        <div className={styles.bindedList}>
          {/* <Table rowKey="appId" size="middle" columns={columns} dataSource={bindArray} bordered pagination={false} /> */}

          <div className={styles.tips}>关联应用后可以使用芝麻账号登录下列应用</div>
          {bindArray.length > 0 ? (
            <List>
              {bindArray.map((el) => {
                return (
                  <List.Item
                    className={styles.bindedListItem}
                    key={el.appId}
                    thumb={el.icon || defaultImg}
                    multipleLine
                    // extra={<Extra data={el} />}
                    extra={
                      el.bindUsername && (
                        <PopconfirmBtn data={el} title="确认解除绑定该账号？" onOk={onUnbindApp}>
                          解除绑定
                        </PopconfirmBtn>
                      )
                    }
                  >
                    {el.name}
                    <List.Item.Brief>{el.bindTime && `${el.bindTime}, ${el.bindUsername}`}</List.Item.Brief>
                  </List.Item>
                );
              })}
            </List>
          ) : (
            <div className={styles.noShow}>暂无</div>
          )}
        </div>
        {unBindArray && !!unBindArray.length && (
          <div className={styles.unBindList}>
            <div className={styles.tips}>你还可以绑定以下第三方账号</div>
            <div className={styles.unBindListItemWrap}>
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
    apps: state.homepage.apps,
  };
};

export default connect(mapState, mapDispatch)(BindApp);
