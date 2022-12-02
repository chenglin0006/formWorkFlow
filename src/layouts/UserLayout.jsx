/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import GlobalFooter from '@/components/GlobalFooter';
import PageLoading from '@/components/PageLoading';
// import { projectName } from 'config/config';
import passwordLock from '@/assets/img/passwordLock.png';
import activatePasswordLock from '@/assets/img/passwordLock_activate.png';
import styles from './UserLayout.module.less';

class UserLayout extends Component {
  static propTypes = {
    // location: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  // componentDidMount() {
  //   const userContainer = document.getElementById('userContainer');
  //   userContainer.onscroll = (e) => {
  //     if (e.target.scrollTop > 100) {
  //       e.target.scrollTop = 0;
  //     }
  //   };
  // }
  handleSaveUnlock = () => {
    const { saveUnlock, saveType } = this.props;
    saveUnlock(true);
    // 切换账号密码登陆
    saveType('account');
  };
  render() {
    const { children, unlock, saveUnlock } = this.props;
    const showPasswordLogin = localStorage.getItem('showPasswordLogin');
    return (
      <div className={styles.container} id="userContainer">
        <div className={styles.content}>
          <div className={styles.center}>
            <div className={styles.header}>
              <Link to="/user/login?stayInLogin=true">
                <img
                  alt="logo"
                  className={styles.logo}
                  src="https://res1.bnq.com.cn/6e45fcfa-573d-4a07-82a0-20a960adaec1"
                />
                {/* <span className={styles.title}>{projectName}</span> */}
              </Link>
            </div>
            <div className={styles.main}>
              {showPasswordLogin ? (
                <img
                  alt=""
                  style={unlock ? { cursor: 'not-allowed' } : {}}
                  // 仅允许点击一次 为true后不允许操作
                  onClick={this.handleSaveUnlock}
                  className={styles.passwordLock}
                  src={unlock ? passwordLock : activatePasswordLock}
                />
              ) : null}
              <React.Suspense fallback={<PageLoading />}>{children}</React.Suspense>
            </div>
          </div>
        </div>
        <GlobalFooter copyright="百安居中国" />
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    getCopyright: dispatch.common.getCopyright,
    saveUnlock: dispatch.common.saveUnlock,
    saveType: dispatch.common.saveType,
  };
};

const mapState = (state) => {
  return {
    copyright: state.common.copyright,
    unlock: state.common.unlock,
  };
};

export default connect(mapState, mapDispatch)(UserLayout);
