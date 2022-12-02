import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Descriptions, Avatar, Table, Badge, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { genderMap } from '@/app/Account/dict';
import AvatarEdit from './AvatarEdit';
import AppItem from './AppItem';
import PopconfirmBtn from './PopConfirm';

import styles from './index.module.less';
import './index.less';

const Info = (props) => {
  const { data, getBindAccounts, bindAccounts, unbindAccount } = props;
  const { bindArray = [], unBindArray = [] } = bindAccounts;

  useEffect(() => {
    getBindAccounts();
  }, []);

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

  const onUnbindAccounts = async (record) => {
    const params = { source: record.source };
    const res = await unbindAccount(params);

    if (res.success) {
      message.success('解绑成功');
      getBindAccounts();
    }

    return res;
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'credential',
      align: 'left',
      render: (text, record, index) => index + 1,
    },
    {
      title: '绑定账号信息',
      dataIndex: 'name',
      align: 'left',
      render: (text, record) => {
        return (
          <span>
            <Avatar size={30} src={record.icon} />
            <span> {text}</span>
          </span>
        );
      },
    },
    {
      title: '详情',
      align: 'left',
      dataIndex: 'username',
      render: (text, record) => {
        return (
          <span>
            <Avatar size={30} src={record.avatar} />
            <span> {text}</span>
          </span>
        );
      },
    },
    {
      title: '绑定时间',
      align: 'left',
      dataIndex: 'bindTime',
    },
    {
      title: '状态',
      align: 'left',
      dataIndex: 'status',
      render: () => {
        return <Badge status="success" text="使用中" />;
      },
    },
    {
      title: '操作',
      align: 'left',
      dataIndex: 'protocol',
      render: (_, record) => {
        return (
          <PopconfirmBtn data={record} title={`是否解除【${record.name}】账号绑定？`} onOk={onUnbindAccounts}>
            解除绑定
          </PopconfirmBtn>
        );
      },
    },
  ];

  return (
    <>
      <div className={styles.title}>个人信息</div>
      <div className={styles.content}>
        <Descriptions className={styles.descriptions} column={2}>
          <Descriptions.Item label="头像">
            <Avatar size={56} src={data.picture} icon={<UserOutlined />} />
            <AvatarEdit onEdit={onUpdateInfo} initialData={data.picture} />
          </Descriptions.Item>
          <Descriptions.Item label=""> </Descriptions.Item>
          <Descriptions.Item label="姓名">{data.displayName}</Descriptions.Item>
          <Descriptions.Item label="性别">{genderMap[data.gender]}</Descriptions.Item>
          <Descriptions.Item label="生日" span={1}>
            {data.birthDate}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions className={styles.descriptions} column={2}>
          <Descriptions.Item label="工号">{data.employeeNumber}</Descriptions.Item>
          <Descriptions.Item label="入职时间">{data.entryDate}</Descriptions.Item>
          <Descriptions.Item label="职位">{data.jobTitle}</Descriptions.Item>
          <Descriptions.Item label="部门">{data.department}</Descriptions.Item>
          <Descriptions.Item label="上级">{data.leaderNo}</Descriptions.Item>
          <Descriptions.Item label="部门负责人">{data.departManager}</Descriptions.Item>
          <Descriptions.Item label="账号过期时间" span={1}>
            {data.expirationDate}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions className={styles.descriptions} column={2}>
          <Descriptions.Item label="手机号">{data.mobile}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{data.email}</Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.title}>第三方账号绑定</div>
      <div className={styles.appContent}>
        <div className={styles.bindedTips}>使用以下任一方式都可以登录到您的帐号，避免由于某个帐号失效导致无法登录</div>
        <div className={`${styles.bindedTable} binded-table`}>
          <Table
            rowKey="source"
            size="middle"
            bordered={false}
            columns={columns}
            dataSource={bindArray}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            pagination={false}
          />
        </div>
        {unBindArray && !!unBindArray.length && (
          <div className={styles.unBindList}>
            <div className={styles.unbindedTips}>你还可以绑定以下第三方账号</div>
            <div>
              {unBindArray.map((item) => (
                <AppItem key={item.source} data={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

Info.propTypes = {
  data: PropTypes.object,
  updateInfo: PropTypes.func.isRequired,
  getCurrentUser: PropTypes.func.isRequired,
  getBindAccounts: PropTypes.func.isRequired,
  bindAccounts: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  unbindAccount: PropTypes.func.isRequired,
};

const mapDispatch = (dispatch) => {
  return {
    getCurrentUser: dispatch.common.getCurrentUser,
    updateInfo: dispatch.account.updateInfo,
    unbindAccount: dispatch.account.unbindAccount,
    getBindAccounts: dispatch.account.getBindAccounts,
  };
};

const mapState = (state) => {
  return {
    data: state.common.currentUser,
    bindAccounts: state.account.bindAccounts,
  };
};

export default connect(mapState, mapDispatch)(Info);
