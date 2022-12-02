/* eslint-disable */
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import star from '@/assets/img/star.png';
import styles from './index.module.less';

function PersonelInfo({ userInfo }) {
  PersonelInfo.propTypes = {
    userInfo: PropTypes.object,
  };
  PersonelInfo.defaultProps = {
    userInfo: {},
  };
  const fieldsList = useMemo(
    () => [
      {
        fieldName: '员工姓名',
        fieldValue: 'realname',
      },
      {
        fieldName: '员工工号',
        fieldValue: 'username',
      },
      {
        fieldName: '职位',
        fieldValue: 'title',
      },
      {
        fieldName: '部门',
        fieldValue: 'deptList',
        xl: 12,
        lg: 12,
        render: (values) => {
          return (
            <div className={styles.department}>
              <span className={styles.colTitle}>部门:</span>
              <div>
                {values?.map((item) => (
                  <p key={item.deptName} className={styles.departmentList}>
                    <span style={{ width: '24px' }}>{item.mainDept && <img src={star} alt="" />}</span>
                    {item.deptName}
                  </p>
                ))}
              </div>
            </div>
          );
        },
      },
    ],
    [userInfo],
  );
  return (
    <div className={styles.PersonelInfo}>
      <Row style={{ marginBottom: '5px' }}>
        {fieldsList.map((item) => {
          return (
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={item.lg || 8}
              xl={item.xl || 8}
              key={item.fieldValue}
              style={{ marginBottom: '10px' }}
            >
              {item.render ? (
                item.render(userInfo[item.fieldValue])
              ) : (
                <>
                  <span className={styles.colTitle}>{item.fieldName}:</span>
                  <span>{userInfo[item.fieldValue]}</span>
                </>
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
export default memo(PersonelInfo);
