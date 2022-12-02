/* eslint-disable no-useless-concat */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'antd-mobile';
import { genderMap } from '@/app/Account/dict';
import AvatarPicker from './AvatarPicker';

import styles from './index.module.less';

const { Item } = List;

const Info = (props) => {
  const { data } = props;

  const onUpdateInfo = async (params) => {
    const { getCurrentUser, updateInfo } = props;
    const res = await updateInfo({
      // username: data.username,
      ...params,
    });

    if (res.success) {
      getCurrentUser();
    }

    return res;
  };

  const onAvatarChange = (val) => {
    console.log('🚀 ~ file: index.jsx ~ line 33 ~ onAvatarChange ~ val', val);
    if (val && val.url) {
      onUpdateInfo({
        picture: val.url,
      });
    }
  };

  return (
    <div className={`${styles.wrap} ` + `list-item`}>
      <div className={styles.title}>个人信息</div>
      <div className={styles.listWrap}>
        <List className={styles.list}>
          <AvatarPicker maxSize={10} onChange={onAvatarChange} initialValue={{ url: data.picture }}>
            头像
          </AvatarPicker>
          <Item extra={data.displayName}>姓名</Item>
          <Item extra={genderMap[data.gender]}>性别</Item>
          <Item extra={data.birthDate}>生日</Item>
        </List>

        <List className={styles.list}>
          <Item extra={data.employeeNumber}>工号</Item>
          <Item extra={data.entryDate}>入职时间</Item>
          <Item extra={data.jobTitle}>职位</Item>
          <Item extra={data.leaderNo}>上级</Item>
          <Item extra={data.department}>部门</Item>
          <Item extra={data.departManager}>部门负责人</Item>
          <Item extra={data.expirationDate}>账号过期时间</Item>
        </List>

        <List className={styles.list}>
          <Item extra={data.mobile}>手机号</Item>
          <Item extra={data.email}>邮箱</Item>
        </List>
      </div>
    </div>
  );
};

Info.propTypes = {
  data: PropTypes.object,
  updateInfo: PropTypes.func.isRequired,
  getCurrentUser: PropTypes.func.isRequired,
};

const mapDispatch = (dispatch) => {
  return {
    getCurrentUser: dispatch.common.getCurrentUser,
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

export default connect(mapState, mapDispatch)(Info);
