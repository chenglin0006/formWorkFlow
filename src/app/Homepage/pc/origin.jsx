/*eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { List, Card, Avatar, Modal, Skeleton } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { open } from '@/util/common';
import { defaultImg } from 'config/config';
import { titleMap } from '../dict';

import styles from './index.module.less';

const listGrid = {
  gutter: 16,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 4,
  xxl: 4,
};

const ListGroup = ({ data = [], loading, renderItem }) => {
  if (loading) {
    return (
      <List
        grid={listGrid}
        dataSource={[1, 2, 3, 4]}
        renderItem={() => (
          <List.Item>
            <Card className={styles.card}>
              <Skeleton loading avatar title={false} paragraph={{ rows: 3, width: '100%' }} active />
            </Card>
          </List.Item>
        )}
      />
    );
  }

  return (
    <div>
      {data.map((item) => {
        if (!item || !item.dataSource || !item.dataSource.length) {
          return null;
        }

        const { title, key, dataSource } = item;

        return <List key={key} header={title} grid={listGrid} dataSource={dataSource} renderItem={renderItem} />;
      })}
    </div>
  );
};

ListGroup.propTypes = {
  data: PropTypes.array,
  renderItem: PropTypes.func,
  loading: PropTypes.bool,
};

const Homepage = (props) => {
  const [usedListTemp, setUsedListTemp] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const { history, getApps, apps, loading, clear } = props;
  const [test, setTest] = useState(false);
  useEffect(() => {
    getApps().then((res) => {
      const list = res.bindArray.map((ele) => {
        return { isNormal: true, ...ele };
      });
      setUsedListTemp(list);
    });

    return () => {
      clear();
    };
  }, []);

  const handleNext = (data = {}) => {
    if (data.bind) {
      open(data.url);
    } else {
      Modal.confirm({
        title: '未绑定该应用',
        content: '绑定应用后，可免密登录。是否需要去绑定？',
        okText: '去绑定',
        cancelText: '取消',
        closable: true,
        maskClosable: true,
        onOk() {
          history.push('/account/bind-app');
        },
        // cancelButtonProps: {
        //   // onCancel会在modal关闭时触发，所以打开页面改到onClick事件
        //   onClick: () => {
        //     open(data.url);
        //   },
        // },
        // onCancel() {},
      });
    }
  };

  const onGoApp = async (item) => {
    const { goToApp } = props;

    const data = await goToApp({
      appId: item.appId,
    });

    if (data) {
      handleNext(data);
    }
  };

  const renderItem = (item) => {
    return (
      <List.Item>
        <Card
          className={styles.card}
          hoverable
          onClick={() => {
            onGoApp(item);
          }}
        >
          <div className={styles.cardBody}>
            <div className={styles.cardMeta}>
              <div className={styles.cardAvatar}>
                <Avatar size={48} src={item.icon || defaultImg}>
                  {item.name}
                </Avatar>
              </div>
              <div className={styles.cardTitle}> {item.name}</div>
            </div>
            <div className={styles.cardAction}>
              <RightOutlined />
            </div>
          </div>
        </Card>
      </List.Item>
    );
  };

  const appKeys = Object.keys(apps);

  const data = appKeys.reduce((acc, cur) => {
    acc.push({
      key: cur,
      title: titleMap[cur],
      dataSource: apps[cur],
    });

    return acc;
  }, []);

  return (
    <div className={styles.homepageWrapper}>
      <div className={styles.title}>
        <h1
          onClick={() => {
            setTest(!test);
          }}
        >
          以下应用可以通过统一账号密码登录{test ? 'true' : false}
        </h1>
        {/* <div className={styles.description}>以下应用可以通过统一账号密码登录</div> */}
      </div>
      <div className={styles.content}>
        <ListGroup
          data={[
            {
              key: 1,
              isNormal: true,
              title: '常用应用',
              dataSource: usedListTemp,
            },
          ]}
          loading={false}
          renderItem={(item) => renderItem(item, usedListTemp)}
        />
        <ListGroup data={data} loading={loading} renderItem={renderItem} />
      </div>
    </div>
  );
};

Homepage.propTypes = {
  history: PropTypes.object.isRequired,
  getApps: PropTypes.func.isRequired,
  goToApp: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  apps: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  loading: PropTypes.bool,
};

const mapDispatch = (dispatch) => {
  return {
    getApps: dispatch.homepage.getApps,
    goToApp: dispatch.homepage.goToApp,
    clear: dispatch.homepage.clear,
  };
};

const mapState = (state) => {
  return {
    apps: state.homepage.apps,
    loading: state.loading.effects.homepage.getApps,
  };
};

export default connect(mapState, mapDispatch)(Homepage);
