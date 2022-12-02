import React, { memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Tooltip } from 'antd';
import successIcon from '@/assets/img/success-icon.png';
// import failIcon from '@/assets/img/close-icon.png';
import './index.less';

function PermissionWrapper(props) {
  const { list, showIcon, showAction, isAuthorization, handleAuthorization, isTeam, handleSingleAuthorization } = props;
  const getInnerHtml = useMemo(
    () => (flag) => {
      if (isAuthorization) {
        // 未授权 需要判断当下级具备当前管理上级没有的权限组/角色权限时 隐藏”取消授权“按钮
        if (flag) return '授权中';
        return '取消授权';
      }
      if (isTeam) {
        if (flag) return '授权中';
        return '授权';
      }
      return '申请授权';
    },
    [isAuthorization, isTeam],
  );
  useEffect(() => {
    // 因为items默认高度为行高50 直接使用item的offsetHeight来计算会出现问题 所以需要计算高度
    const items = document.querySelectorAll('.item'); // 拿到所有的卡片
    const itemHeaders = document.querySelectorAll('.item-header'); // 拿到所有的卡片头部(权限组名称)
    const itemContent = document.querySelectorAll('.item-content'); // 拿到所有的卡片body(角色名称)
    for (let i = 0; i < items.length; i++) {
      // 通过每一个卡片的头部高度+每一个卡片中所有角色累计起来的高度 计算出卡片的高度
      const height = itemContent[i].offsetHeight + itemHeaders[i].offsetHeight;
      // 通过卡片的高度来计算卡片的偏移行数 卡片高度 / 默认卡片的行高 得到需要偏移的行数
      items[i].style.gridRowEnd = `span ${Math.floor(height / 50)}`;
    }
  }, [list]);
  return (
    <div className="permission-grid">
      {list.map((item) => {
        return (
          <div className={classNames('item', { 'is-authorization': !isAuthorization })} key={item.id}>
            <div className="item-header">
              <Tooltip title={item.name}>
                <span className="item-org-name">{item.name}</span>
              </Tooltip>
              {showAction && item.canCancel && (
                <Button
                  type="link"
                  disabled={item.approving}
                  onClick={() => handleAuthorization(item, isAuthorization)}
                >
                  {getInnerHtml(item.approving)}
                </Button>
              )}
            </div>
            <div className="item-content">
              {item.roleList.map((ele) => {
                return (
                  <div key={ele.id} className="item-org">
                    <Tooltip title={ele.name}>
                      <span className="item-org-name">
                        {showIcon && <img src={successIcon} style={{ marginRight: '8px' }} alt="" />}
                        {ele.name}
                      </span>
                    </Tooltip>
                    {showAction && ele.canCancel && (
                      <Button
                        type="link"
                        disabled={ele.approving}
                        onClick={() => handleSingleAuthorization(ele, isAuthorization)}
                      >
                        {getInnerHtml(ele.approving)}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
PermissionWrapper.propTypes = {
  showIcon: PropTypes.bool, // 是否有前面的icon
  showAction: PropTypes.bool, // 是否有操作
  isAuthorization: PropTypes.bool, // 是否已经授权
  handleAuthorization: PropTypes.func, // 点击权限组名称
  handleSingleAuthorization: PropTypes.func, // 单个授权 或者取消授权 或者申请授权
  isTeam: PropTypes.bool, // 是否为团队
  list: PropTypes.array,
};
PermissionWrapper.defaultProps = {
  showIcon: true,
  showAction: false,
  isAuthorization: true,
  isTeam: true,
  list: [],
};
export default memo(PermissionWrapper);
