import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs, Input, Spin, Modal, Empty } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import PermissionWrapper from '@/components/PermissionLIst';
import Service from '../../Service';
import styles from './index.module.less';

const { TabPane } = Tabs;
const { confirm } = Modal;
const { applyAuth } = Service;
function MyPermission(props) {
  const { getMyAuthInfo, existedPermissions, nonExistedPermissions, loading, leaderInfo } = props;
  const [key, setKey] = useState('');
  const confirmMessage = useMemo(
    () => (name, flag) => (
      <p>
        请确认您将向上级发起<span className={styles.textUnderline}>{name}</span>
        {flag ? '权限组' : '角色'}授权申请
      </p>
    ),
    [],
  );
  const confirmFn = (name, isAuthorization, onOk) => {
    return confirm({
      width: '500px',
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: confirmMessage(name, isAuthorization),
      okText: '确定',
      onOk,
    });
  };
  const getPermissionList = () => {
    getMyAuthInfo({ key });
  };
  // 批量申请授权
  const handleAuthorization = useCallback(({ name, id }) => {
    confirmFn(name, true, async () => {
      await applyAuth({ id, type: 'PRIVILEGE_GROUP' });
      getPermissionList();
    });
  }, []);

  // 单个申请授权
  const handleSingleAuthorization = useCallback(({ name, id }) => {
    confirmFn(name, false, async () => {
      await applyAuth({ id, type: 'ROLE' });
      getPermissionList();
    });
  }, []);
  useEffect(() => {
    getPermissionList();
  }, [key]);
  return (
    <Spin spinning={loading}>
      <div className={styles.title}>我的权限</div>
      <div className={styles.content}>
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
        {!existedPermissions.length && !nonExistedPermissions.length ? (
          <div className={styles.emptyWrapper}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无权限信息" />
          </div>
        ) : (
          <>
            {existedPermissions.length ? (
              <div className={styles.permissionWrapper}>
                <PermissionWrapper list={existedPermissions} />
              </div>
            ) : (
              <div>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无已授权权限信息" />
              </div>
            )}
            {nonExistedPermissions.length ? (
              <>
                <div className={styles.permissionCopy}>
                  <span>
                    您当前尚未获得以下授权，如需要请联系您的
                    <span className={styles.manager}>上级管理者</span>@
                    <span className={styles.managerName}>{`${leaderInfo?.leaderName}/${leaderInfo?.leaderJobNo}`}</span>
                    为您授权
                  </span>
                </div>
                <div className={styles.permissionWrapper}>
                  <PermissionWrapper
                    list={nonExistedPermissions}
                    handleSingleAuthorization={handleSingleAuthorization}
                    handleAuthorization={handleAuthorization}
                    showIcon={false}
                    isAuthorization={false}
                    showAction
                    isTeam={false}
                  />
                </div>
              </>
            ) : (
              <div>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无未授权权限信息" />
              </div>
            )}
          </>
        )}
      </div>
    </Spin>
  );
}
const mapState = (state) => ({
  myPermissions: state.account.myPermissions,
  existedPermissions: state.account.existedPermissions,
  leaderInfo: state.account.leaderInfo,
  nonExistedPermissions: state.account.nonExistedPermissions,
  loading: state.loading.effects.account.getMyAuthInfo,
});
const mapDispatch = (dispatch) => ({
  getMyAuthInfo: dispatch.account.getMyAuthInfo,
});
MyPermission.propTypes = {
  getMyAuthInfo: PropTypes.func,
  existedPermissions: PropTypes.array,
  nonExistedPermissions: PropTypes.array,
  loading: PropTypes.bool,
  leaderInfo: PropTypes.object,
};
export default connect(mapState, mapDispatch)(memo(MyPermission));
