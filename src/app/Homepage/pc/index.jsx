/*eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { List, Card, Avatar, Modal, Skeleton, Button, Message, Spin, message } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { open } from '@/util/common';
import { defaultImg } from 'config/config';
import { Tools } from '@/util';
import Swiper from 'swiper/swiper-bundle';
import 'swiper/swiper-bundle.min.css';
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

// 数组交换顺序 用于元素的前移或者后移
const swapItems = (arr, index1, index2) => {
  // eslint-disable-next-line prefer-destructuring
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};

const ListGroup = ({
  data = [],
  loading,
  renderItem,
  isEdit = false,
  setIsEdit = () => {},
  usedArray = [],
  setUsedListTemp = () => {},
  sureEditFun = () => {},
  editAppsLoading = false,
}) => {
  // 列表头部render
  const renderHeader = (item) => {
    const { groupName } = item;
    return (
      <div className={styles.listHeader}>
        <div className={styles.listTitle}>{groupName}</div>
        {item.canEdit ? (
          <div className={styles.listManu}>
            {isEdit ? (
              <div>
                <span
                  className={styles.cancelBtn}
                  onClick={() => {
                    setIsEdit(!isEdit);
                    setUsedListTemp(usedArray);
                  }}
                >
                  取消
                </span>
                <Button
                  className={styles.submitBtn}
                  loading={editAppsLoading}
                  size="small"
                  onClick={sureEditFun}
                  type="primary"
                >
                  确定
                </Button>
              </div>
            ) : (
              <div
                className={styles.editBtn}
                onClick={() => {
                  setIsEdit(!isEdit);
                }}
              >
                编辑{groupName}
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  if (loading) {
    return (
      <List
        grid={listGrid}
        dataSource={[1, 2, 3, 4]}
        renderItem={() => (
          <List.Item>
            <Card className={styles.cardNull}>
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
        if (!item || !item.appList || !item.appList.length) {
          // 对于可以编辑的分组应用出现数组为空时候的展示
          if (item.canEdit) {
            return (
              <div className={styles.addNull} key={item.groupId}>
                {renderHeader(item)}
                {isEdit ? (
                  <div className={styles.noDesc}>暂无常用应用。点击应用右上角的添加按钮可进行添加。</div>
                ) : (
                  <List
                    grid={listGrid}
                    dataSource={[1]}
                    renderItem={() => (
                      <List.Item>
                        <Card
                          className={styles.nullCard}
                          onClick={() => {
                            if (!isEdit) {
                              setIsEdit(true);
                            }
                          }}
                        >
                          <div className={styles.cardBody}>
                            <div className={styles.cardMeta}>
                              <div className={styles.cardAvatar}>
                                <div className={styles.addNullBtn}>+</div>
                              </div>
                              <div className={styles.cardTitle}>添加{item.groupName}</div>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            );
          }
          return null;
        }

        const { groupId, appList } = item;

        return (
          <List
            key={groupId}
            header={renderHeader(item)}
            grid={listGrid}
            dataSource={appList}
            renderItem={renderItem}
          />
        );
      })}
    </div>
  );
};

ListGroup.propTypes = {
  data: PropTypes.array,
  renderItem: PropTypes.func,
  loading: PropTypes.bool,
  isEdit: PropTypes.bool,
  editAppsLoading: PropTypes.bool,
  setUsedListTemp: PropTypes.func,
  sureEditFun: PropTypes.func,
  setIsEdit: PropTypes.func,
  usedArray: PropTypes.array,
};

const Homepage = (props) => {
  const [usedListTemp, setUsedListTemp] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [targetApp, setTargetApp] = useState(null);
  const [showAutoRegister, setShowAutoRegister] = useState(false);
  const {
    history,
    loading,
    clear,
    usedArray,
    editApps,
    editAppsLoading,
    getUsedApps,
    getUsedAppsLoading,
    appGroups,
    getAppsGroup,
    bannerInfo,
    getBannerInfo,
    getBannerLoading,
    ajaxRequest,
    autoRegister,
    goToAppLoading,
  } = props;
  const getUsedAppsFun = () => {
    getUsedApps().then((res) => {
      const list = res.map((ele) => {
        return { isNormal: true, ...ele };
      });
      setUsedListTemp(list);
    });
  };
  useEffect(() => {
    let ajaxFlag = Tools.getUrlArg('requestUrl');
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
    getBannerInfo({ pageSize: 100 }).then(() => {
      const m = new Swiper('.swiper-container', {
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        slideToClickedSlide: true,
        autoHeight: true,
        loop: true, // 无缝轮播
        pagination: {
          // 小圆点分页
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    });
    getAppsGroup();
    getUsedAppsFun();

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

  // 删除app图标展示
  const renderCutManu = (item) => {
    return (
      <div
        className={`remove-icon cut ${isEdit ? 'edit-status' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(item);
          const list = usedListTemp.map((ele) => {
            return ele;
          });
          list.forEach((ele, index) => {
            if (ele.appId === item.appId) {
              ele.isNormal = false;
              list.splice(index, 1);
            }
          });
          setUsedListTemp(list);
        }}
      >
        - 移除
      </div>
    );
  };

  // 添加app图标展示
  const renderAddManu = (item) => {
    return (
      <div
        className={`remove-icon add ${isEdit ? 'edit-status' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const obj = Tools.deepClone(item);
          obj.isNormal = true;
          const list = usedListTemp.map((ele) => {
            return ele;
          });
          list.push(obj);
          setUsedListTemp(list);
        }}
      >
        + 添加
      </div>
    );
  };

  // 移动app 前移或者后移
  const moveApp = (item, status) => {
    console.log(item);
    let targetIndex = 0;
    usedListTemp.forEach((ele, index) => {
      if (ele.appId === item.appId) {
        targetIndex = index;
      }
    });
    const temp = Tools.deepClone(usedListTemp);
    let list = [];
    if (status === 'pre') {
      list = swapItems(temp, targetIndex, targetIndex - 1);
    } else {
      list = swapItems(temp, targetIndex, targetIndex + 1);
    }
    setUsedListTemp(list);
  };

  const renderItem = (item, list) => {
    let indexT = 0;
    let showPre = false;
    let showNext = false;
    let showCut = false;
    let showAdd = false;
    if (list && Array.isArray(list)) {
      list.forEach((ele, i) => {
        if (ele.appId === item.appId) {
          indexT = i;
        }
      });
      if (indexT === 0) {
        showPre = false;
      } else {
        showPre = true;
      }
      if (indexT === list.length - 1) {
        showNext = false;
      } else {
        showNext = true;
      }
    }
    if (item.isNormal) {
      showCut = true;
      showAdd = false;
    } else {
      let contain = false;
      usedListTemp.forEach((ele) => {
        if (ele.appId === item.appId) {
          contain = true;
        }
      });
      if (contain) {
        showCut = true;
        showAdd = false;
      } else {
        showCut = false;
        showAdd = true;
      }
    }
    return (
      <List.Item className={'list-item'}>
        <Card
          className={styles.card}
          hoverable
          onClick={() => {
            if (isEdit) {
              return;
            }
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
              <div className={styles.cardTitle}>{item.name}</div>
            </div>
            <div className={styles.cardAction}>
              <RightOutlined />
            </div>
            {isEdit && item.isNormal ? (
              !showPre && !showNext ? null : (
                <div
                  className={`moveBtns ${indexT === 0 ? 'first ' : ''}${indexT === list.length - 1 ? 'last ' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {showPre ? (
                    <div
                      className="move-btn pre"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        moveApp(item, 'pre');
                      }}
                    >
                      前移
                    </div>
                  ) : null}
                  {showNext ? (
                    <div
                      type="primary"
                      className="move-btn next"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        moveApp(item, 'next');
                      }}
                    >
                      后移
                    </div>
                  ) : null}
                </div>
              )
            ) : null}
          </div>
        </Card>
        {showCut && renderCutManu(item)}
        {showAdd && renderAddManu(item)}
      </List.Item>
    );
  };

  const sureEditFun = () => {
    console.log(usedListTemp);
    const params = {
      idArray: '',
    };
    if (usedListTemp.length > 0) {
      const ids = usedListTemp
        .map((ele) => {
          return ele.appId;
        })
        .join(',');
      params.idArray = ids;
    }

    editApps(params).then(() => {
      Message.success('编辑成功');
      setIsEdit(false);
      getUsedAppsFun();
    });
  };

  const renderBanner = () => {
    if (bannerInfo && bannerInfo.length) {
      if (bannerInfo.length === 1) {
        return (
          <a href={bannerInfo[0].content} target="_blank">
            <img className={styles.bannerImg} alt="" src={bannerInfo[0].bannerObj.pc} />
          </a>
        );
      }
      return (
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {bannerInfo.map((ele) => {
              return (
                <a href={ele.content} target="_blank" className="swiper-slide" key={ele.id}>
                  <img src={ele.bannerObj.pc} alt="" />
                </a>
              );
            })}
          </div>
          <div className="swiper-pagination" />
        </div>
      );
    }
    return null;
  };

  console.log(appGroups, '-----appGroups');
  return (
    <div className={styles.homepageWrapper}>
      <Spin spinning={getBannerLoading}>
        <div className={styles.bannerDiv} id="banner">
          {renderBanner()}
        </div>
      </Spin>
      <div className={styles.title}>
        <h1>以下应用可以通过统一账号密码登录</h1>
        {/* <div className={styles.description}>以下应用可以通过统一账号密码登录</div> */}
      </div>
      <div className={styles.content}>
        <ListGroup
          data={[
            {
              groupId: 1,
              canEdit: true,
              groupName: '常用应用',
              appList: usedListTemp,
            },
          ]}
          loading={getUsedAppsLoading}
          isEdit={isEdit}
          setIsEdit={(b) => {
            setIsEdit(b);
          }}
          usedArray={usedArray}
          setUsedListTemp={(l) => {
            setUsedListTemp(l);
          }}
          sureEditFun={sureEditFun}
          editAppsLoading={editAppsLoading}
          renderItem={(item) => renderItem(item, usedListTemp)}
        />
        <ListGroup data={appGroups} loading={loading} renderItem={renderItem} />
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
  editApps: PropTypes.func.isRequired,
  goToApp: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  getUsedApps: PropTypes.func.isRequired,
  ajaxRequest: PropTypes.func.isRequired,
  getAppsGroup: PropTypes.func.isRequired,
  getBannerInfo: PropTypes.func.isRequired,
  autoRegister: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  editAppsLoading: PropTypes.bool,
  usedArray: PropTypes.array,
  getUsedAppsLoading: PropTypes.bool,
  appGroups: PropTypes.array,
  bannerInfo: PropTypes.array,
};

const mapDispatch = (dispatch) => {
  return {
    goToApp: dispatch.homepage.goToApp,
    clear: dispatch.homepage.clear,
    editApps: dispatch.homepage.editApps,
    getUsedApps: dispatch.homepage.getUsedApps,
    getAppsGroup: dispatch.homepage.getAppsGroup,
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
    loading: state.loading.effects.homepage.getApps,
    getUsedAppsLoading: state.loading.effects.homepage.getUsedApps,
    getBannerLoading: state.loading.effects.homepage.getBannerInfo,
    editAppsLoading: state.loading.effects.homepage.editApps,
    goToAppLoading: state.loading.effects.homepage.goToApp,
  };
};

export default connect(mapState, mapDispatch)(Homepage);
