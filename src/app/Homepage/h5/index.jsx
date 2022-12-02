import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'antd-mobile';
import { Avatar, Modal, Button } from 'antd';
import message from '@/components/message';
import { connect } from 'react-redux';
import { open } from '@/util/common';
import { defaultImg } from 'config/config';
import PageLoading from '@/components/PageLoading';
import { Carousel } from 'antd-mobile';
import { Tools } from '@/util';

import styles from './index.module.less';

const ListGroup = ({ data = [], loading, renderItem, onClickItem, className }) => {
  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className={className}>
      {data.map((item) => {
        if (!item || !item.appList || !item.appList.length) {
          return null;
        }

        const { groupName, groupId, appList } = item;

        return (
          <div key={groupId} className={styles.gridWrap}>
            {groupName && <div className={styles.gridTitle}>{groupName}</div>}
            <Grid
              data={appList}
              columnNum={3}
              square={false}
              renderItem={renderItem}
              onClick={onClickItem}
              className="not-square-grid"
            />
          </div>
        );
      })}
    </div>
  );
};

ListGroup.propTypes = {
  data: PropTypes.array,
  renderItem: PropTypes.func,
  onClickItem: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

const Homepage = (props) => {
  const [imgHeight, setImgHeight] = useState(100);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [targetApp, setTargetApp] = useState(null);
  const [showAutoRegister, setShowAutoRegister] = useState(false);
  const preventDefault = (e) => {
    console.log(e, '----');
    // 禁用默认事件
    e.preventDefault();
    e.passive = false;
  };
  const {
    history,
    clear,
    loading,
    getAppsGroup,
    appGroups,
    usedArray,
    getUsedApps,
    getUsedAppsLoading,
    getBannerInfo,
    bannerInfo,
    ajaxRequest,
    autoRegister,
  } = props;
  useEffect(() => {
    const ajaxFlag = Tools.getUrlArg('requestUrl');
    if (ajaxFlag) {
      ajaxRequest({ url: ajaxFlag }).then((res) => {
        if (res.code === 0) {
          message.success(res.message);
          if (res.data && res.data.redirectUrl) {
            location.href = res.data.redirectUrl;
          }
        } else {
          message.error(res.message);
        }
      });
    }
    getBannerInfo({ pageSize: 100 });
    getAppsGroup();
    getUsedApps();
    document.getElementById('banner').addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      clear();
    };
  }, []);

  const handleNext = (data = {}) => {
    if (data.bind) {
      open(data.url);
    } else {
      setIsModalVisible(true);
      if (data.autoRegister) {
        setShowAutoRegister(true);
      } else {
        setShowAutoRegister(false);
      }
    }
  };

  const onGoApp = async (item) => {
    const { goToApp } = props;

    const data = await goToApp({
      appId: item.appId,
    });

    setTargetApp(item);

    if (data) {
      handleNext(data);
    }
  };

  const renderItem = (item) => {
    return (
      <div className={styles.cardWrap}>
        <div className={styles.cardAvatar}>
          <Avatar size={48} src={item.icon || defaultImg}>
            {item.name}
          </Avatar>
        </div>
        <div className={styles.cardTitle}>
          <span>{item.name}</span>
        </div>
      </div>
    );
  };

  const onClick = (el) => {
    onGoApp(el);
  };

  const renderBanner = () => {
    if (bannerInfo && bannerInfo.length) {
      if (bannerInfo.length === 1) {
        return (
          <a href={bannerInfo[0].content}>
            <img className={styles.bannerImg} alt="" src={bannerInfo[0].bannerObj.h5} />
          </a>
        );
      }
      return (
        <div>
          <Carousel
            autoplay
            infinite
            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
            afterChange={(index) => {
              const o = document.getElementById(`img${index}`).offsetHeight;
              console.log(o);
              document.getElementsByClassName('slider-list')[0].style.setProperty('height', `${o}px`);
            }}
          >
            {bannerInfo.map((val, index) => (
              <a key={val} href={val.content} style={{ display: 'inline-block', width: '100%', height: imgHeight }}>
                <img
                  id={`img${index}`}
                  src={val.bannerObj.h5}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                    setImgHeight('auto');
                  }}
                />
              </a>
            ))}
          </Carousel>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.homepageWrapper}>
      <div className={styles.bannerDiv} id="banner">
        {renderBanner()}
      </div>
      <div className={styles.title}>
        <h1>以下应用可以通过统一账号密码登录</h1>
        {/* <div className={styles.description}>以下应用可以通过统一账号密码登录</div> */}
      </div>
      <div className={styles.content}>
        {usedArray.length > 0 ? (
          <ListGroup
            className="normalDiv"
            data={[
              {
                groupId: '1',
                groupName: '常用应用',
                appList: usedArray,
              },
            ]}
            loading={getUsedAppsLoading}
            onClickItem={onClick}
            renderItem={renderItem}
          />
        ) : null}

        <ListGroup data={appGroups} loading={loading} renderItem={renderItem} onClickItem={onClick} />
      </div>
      <Modal
        title="未绑定该应用"
        visible={isModalVisible}
        destroyOnClose
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={
          <div>
            <Button
              onClick={() => {
                setIsModalVisible(false);
              }}
            >
              取消
            </Button>
            {showAutoRegister ? (
              <Button
                onClick={() => {
                  autoRegister({ appId: targetApp.appId }).then((res) => {
                    open(res.data.url);
                    setIsModalVisible(false);
                  });
                }}
                type="primary"
              >
                自动注册并登录
              </Button>
            ) : null}
            <Button
              type="primary"
              onClick={() => {
                history.push('/account/bind-app');
              }}
            >
              去绑定
            </Button>
          </div>
        }
      >
        <div>绑定应用后，可免密登录。是否需要去绑定？</div>
      </Modal>
    </div>
  );
};

Homepage.propTypes = {
  history: PropTypes.object.isRequired,
  goToApp: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  ajaxRequest: PropTypes.func.isRequired,
  getAppsGroup: PropTypes.func.isRequired,
  getUsedApps: PropTypes.func.isRequired,
  getBannerInfo: PropTypes.func.isRequired,
  autoRegister: PropTypes.func.isRequired,
  appGroups: PropTypes.array,
  usedArray: PropTypes.array,
  bannerInfo: PropTypes.array,
  loading: PropTypes.bool,
  getUsedAppsLoading: PropTypes.bool,
};

const mapDispatch = (dispatch) => {
  return {
    getApps: dispatch.homepage.getApps,
    goToApp: dispatch.homepage.goToApp,
    clear: dispatch.homepage.clear,
    getAppsGroup: dispatch.homepage.getAppsGroup,
    getUsedApps: dispatch.homepage.getUsedApps,
    getBannerInfo: dispatch.homepage.getBannerInfo,
    ajaxRequest: dispatch.homepage.ajaxRequest,
    autoRegister: dispatch.homepage.autoRegister,
  };
};

const mapState = (state) => {
  return {
    apps: state.homepage.apps,
    bannerInfo: state.homepage.bannerInfo,
    usedArray: state.homepage.usedArray,
    appGroups: state.homepage.appGroups,
    loading: state.loading.effects.homepage.getAppsGroup,
    getUsedAppsLoading: state.loading.effects.homepage.getUsedApps,
  };
};

export default connect(mapState, mapDispatch)(Homepage);
