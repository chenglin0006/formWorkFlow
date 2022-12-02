import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Tabs, Modal, Empty, Spin } from 'antd';
import classNames from 'classnames';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import PermissionWrapper from '@/components/PermissionLIst';
import Service from '../../Service';
import PersonelItem from './PersonelItem';
import PersonelInfo from './PersonelInfo';
import styles from './index.module.less';

const { confirm } = Modal;
const { TabPane } = Tabs;
const { authMember, cancelAuthMember } = Service;
function MyTeam(props) {
  const {
    updateMaxWidth,
    getMyTeam,
    getTeamLoading,
    teamList,
    getMyTeamMemberInfo,
    getMyTeamInfoLoading,
    teamExistedPermissions,
    noteamExistedPermissions,
    userInfo,
  } = props;
  const [key, setKey] = useState('');
  const [activePerson, setActivePerson] = useState(null);
  const messageTrue = useMemo(
    () => (item, isGroup) => (
      <p>
        确认取消
        <span className={styles.textUnderline}>
          {userInfo?.realname}/{userInfo?.username}的
        </span>
        <span className={styles.textUnderline}>{item.name}</span>权限吗？，确定取消后，
        {isGroup ? '该权限组下角色授权将全部失效' : '该角色授权将失效'}
      </p>
    ),
    [userInfo],
  );
  const messageFalse = useMemo(
    () => (item) => (
      <p>
        确认将<span className={styles.textUnderline}>{item.name}</span>相关权限授权给
        <span className={styles.textUnderline}>
          {userInfo?.realname}/{userInfo?.username}
        </span>
        吗？
      </p>
    ),
    [userInfo],
  );
  const getMyPermissions = () => {
    getMyTeamMemberInfo({ key, username: activePerson });
  };
  useEffect(() => {
    getMyTeam();
  }, []);
  useEffect(() => {
    if (activePerson) {
      getMyPermissions();
    }
  }, [activePerson, key]);
  const handleChangePerson = useCallback((id) => {
    console.log(id);
    setActivePerson(id);
  }, []);
  const confirmFn = (item, isAuthorization, flag, onOk) => {
    return confirm({
      width: '500px',
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: isAuthorization ? messageTrue(item, flag) : messageFalse(item),
      okText: '确定',
      onOk,
    });
  };
  const fetch = async (id, isAuthorization, type) => {
    const { username } = userInfo;
    if (isAuthorization) {
      // 取消授权
      await cancelAuthMember({ id, type, username });
    } else {
      // 申请授权
      await authMember({ id, type, username });
    }
    getMyPermissions();
  };
  // 单个取消授权 或者单个授权
  const handleSingleAuthorization = useCallback(
    (item, isAuthorization) => {
      confirmFn(item, isAuthorization, false, async () => {
        await fetch(item.id, isAuthorization, 'ROLE');
      });
    },
    [userInfo],
  );
  // 权限组授权、取消授权
  const handleAuthorization = useCallback(
    (item, status) => {
      confirmFn(item, status, true, async () => {
        await fetch(item.id, status, 'PRIVILEGE_GROUP');
      });
    },
    [userInfo],
  );
  useEffect(() => {
    updateMaxWidth({ isTeamPage: true });
    return () => updateMaxWidth({ isTeamPage: false });
  }, []);
  return (
    <div className={styles.MyTeam}>
      <div className={styles.title}>我的团队</div>
      <div className={styles.myTeamWrapper}>
        <div className={styles.leftSearchWrapper}>
          <div className={styles.search}>
            <Input placeholder="请输入" onPressEnter={(e) => getMyTeam({ key: e.target.value })} />
          </div>
          <div className={styles.personelList}>
            <Spin spinning={getTeamLoading}>
              {teamList.length ? (
                teamList.map((person) => {
                  return (
                    <PersonelItem
                      key={person.username}
                      person={person}
                      activePerson={activePerson}
                      handleChangePerson={handleChangePerson}
                    />
                  );
                })
              ) : (
                <div className={styles.noTeamList}>暂无人员信息</div>
              )}
            </Spin>
          </div>
        </div>
        <div className={classNames(styles.rightContentWrapper, { [styles.flexEmpty]: !activePerson })}>
          {activePerson ? (
            <Spin spinning={getMyTeamInfoLoading}>
              <PersonelInfo userInfo={userInfo ?? {}} />
              <div className={styles.teamPermission}>
                <Tabs defaultActiveKey="1">
                  <TabPane key="1" tab="权限组" />
                </Tabs>
                <div className={styles.searchWrapper}>
                  <span className={styles.keyWord}>关键字：</span>
                  <Input
                    style={{ width: '200px' }}
                    onPressEnter={(e) => setKey(e.target.value)}
                    suffix={<SearchOutlined />}
                    placeholder="请输入关键字进行搜索"
                  />
                </div>
                {!teamExistedPermissions.length && !noteamExistedPermissions.length ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无权限组信息" />
                ) : (
                  <>
                    {teamExistedPermissions.length ? (
                      <div className={styles.permissionWrapper}>
                        <PermissionWrapper
                          list={teamExistedPermissions}
                          showAction
                          handleAuthorization={handleAuthorization}
                          handleSingleAuthorization={handleSingleAuthorization}
                        />
                      </div>
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无已分配权限组" />
                    )}
                    {noteamExistedPermissions.length ? (
                      <>
                        <div className={styles.permissionCopy}>
                          <span>
                            您可为
                            <span className={styles.manager}>
                              {userInfo?.realname}/{userInfo?.username}
                            </span>
                            进行以下权限授权
                          </span>
                        </div>
                        <div className={styles.permissionWrapper}>
                          <PermissionWrapper
                            list={noteamExistedPermissions}
                            handleSingleAuthorization={handleSingleAuthorization}
                            handleAuthorization={handleAuthorization}
                            showAction
                            showIcon={false}
                            isAuthorization={false}
                          />
                        </div>
                      </>
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无未分配权限组" />
                    )}
                  </>
                )}
              </div>
            </Spin>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="请选择团队成员" />
          )}
        </div>
      </div>
    </div>
  );
}
MyTeam.propTypes = {
  updateMaxWidth: PropTypes.func,
  teamList: PropTypes.array,
  getMyTeam: PropTypes.func,
  getTeamLoading: PropTypes.bool,
  getMyTeamMemberInfo: PropTypes.func,
  getMyTeamInfoLoading: PropTypes.bool,
  teamExistedPermissions: PropTypes.array,
  noteamExistedPermissions: PropTypes.array,
  userInfo: PropTypes.object,
};
const mapDispatch = (dispatch) => ({
  updateMaxWidth: dispatch.account.save,
  getMyTeam: dispatch.account.getMyTeam,
  getMyTeamMemberInfo: dispatch.account.getMyTeamMemberInfo,
});

const mapState = (state) => ({
  teamList: state.account.teamList,
  getTeamLoading: state.loading.effects.account.getMyTeam,
  getMyTeamInfoLoading: state.loading.effects.account.getMyTeamMemberInfo,
  teamExistedPermissions: state.account.teamExistedPermissions,
  noteamExistedPermissions: state.account.noteamExistedPermissions,
  userInfo: state.account.userInfo,
});
export default connect(mapState, mapDispatch)(memo(MyTeam));
