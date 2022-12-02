/*eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar } from 'antd';
import { NavBar, List } from 'antd-mobile';
import { UserOutlined, LockOutlined, AppstoreAddOutlined, LogoutOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames';
import PageLoading from '@/components/PageLoading';
import Exception403 from '@/components/Exception/403';
import Authorized from '@/util/Authorized';
import { defaultLogo } from 'config/config';
import styles from './SimpleLayout.module.less';
import Context from '../MenuContext';

class BasicLayout extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    children: PropTypes.node,
    route: PropTypes.object,

    getMenuData: PropTypes.func.isRequired,
    // menuData: PropTypes.array.isRequired,
    breadcrumbNameMap: PropTypes.object.isRequired,
  };

  static defaultProps = {
    currentUser: {},
    children: null,
    route: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const {
      route: { routes, authority },
      getCurrentUser,
      getMenuData,
    } = this.props;

    // 确保获取商家信息和权限后再渲染菜单
    await getCurrentUser({ reAuth: true });
    getMenuData({ routes, authority });
  };

  getContext = () => {
    const {
      location,
      breadcrumbNameMap,
      route: { routes },
    } = this.props;
    return {
      location,
      breadcrumbNameMap,
      routes,
    };
  };

  onShowMenu = () => {
    this.setState({ showMenu: true });
  };

  onCloseMenu = () => {
    this.setState({ showMenu: false });
  };

  onMenuClick = (key) => {
    const { history } = this.props;

    if (key === 'logout') {
      this.onLogout();
    } else if (key === 'info') {
      history.push('/h5/account/info');
    } else if (key === 'bind-app') {
      history.push('/h5/account/bind-app');
    } else if (key === 'password') {
      history.push('/h5/account/password');
    }

    this.onCloseMenu();
  };

  onLogout = async () => {
    const { logout } = this.props;
    await logout({ shouldRequest: true, stayInLogin: true });
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority;
    // 递归遍历路由获取authority，子路由若没设置authority，将继承父路由authority
    const getAuthority = (key, routes) => {
      routes.forEach((route) => {
        if (route.path && pathToRegexp(route.path, [], { end: false }).test(key) && route.authority) {
          routeAuthority = route.authority;
        }
        if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  render() {
    const {
      currentUser,
      children,
      location: { pathname },
      route: { routes },
    } = this.props;

    const { showMenu } = this.state;

    // 确保用户信息返回后再渲染内容
    if (!currentUser.id) {
      return <PageLoading />;
    }

    const menu = (
      <List>
        <List.Item
          arrow="horizontal"
          thumb={<UserOutlined />}
          onClick={() => {
            this.onMenuClick('info');
          }}
        >
          个人信息
        </List.Item>
        <List.Item
          arrow="horizontal"
          thumb={<AppstoreAddOutlined />}
          onClick={() => {
            this.onMenuClick('bind-app');
          }}
        >
          关联应用
        </List.Item>
        <List.Item
          arrow="horizontal"
          thumb={<LockOutlined />}
          onClick={() => {
            this.onMenuClick('password');
          }}
        >
          修改密码
        </List.Item>
        <List.Item
          arrow="horizontal"
          thumb={<LogoutOutlined />}
          onClick={() => {
            this.onMenuClick('logout');
          }}
        >
          退出
        </List.Item>
      </List>
    );

    const routerAuthority = this.getRouterAuthority(pathname, routes);

    const LeftContent = (
      <Link to="/h5/homepage">
        <div className={styles.navbarLeft}>
          <div className={styles.logo}>
            <img src={defaultLogo} alt="logo" className="logo" />
          </div>
          {/* <div className={styles.title}>
            <div className={styles.mainTitle}>芝麻开门</div>
            <div className={styles.subTItle}>百安居统一登录门户</div>
          </div> */}
        </div>
      </Link>
    );

    const RightContent = (
      <div className={styles.navbarRight} onClick={this.onShowMenu}>
        <Avatar size="small" className={styles.avatar} src={currentUser.picture} icon={<UserOutlined />} alt="avatar" />
        <span className={styles.username}>{currentUser.displayName}</span>
      </div>
    );

    const wrapClx = classNames(styles.navbarWrap, { [styles.active]: showMenu });

    return (
      <Context.Provider value={this.getContext()}>
        <div className={styles.simpleLayout} id="simpleContainer">
          <div className={wrapClx}>
            <NavBar className={styles.navbar} mode="light" leftContent={LeftContent} rightContent={RightContent} />

            {showMenu && (
              <div className={styles.menu}>
                {menu}
                <div className={styles.closeBtn} onClick={this.onCloseMenu}>
                  <i className={styles.iconfont} />
                </div>
              </div>
            )}

            {showMenu && <div className={styles.menuMask} onClick={this.onCloseMenu} />}
          </div>

          <div className={styles.content}>
            <React.Suspense fallback={<PageLoading delay={200} />}>
              <Authorized authority={routerAuthority} noMatch={<Exception403 />}>
                {children}
              </Authorized>
            </React.Suspense>
          </div>
        </div>
      </Context.Provider>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    getCurrentUser: dispatch.common.getCurrentUser,
    getMenuData: dispatch.menu.getMenuData,
    logout: dispatch.common.logout,
  };
};

const mapState = (state) => {
  return {
    currentUser: state.common.currentUser,
    menuData: state.menu.menuData,
    breadcrumbNameMap: state.menu.breadcrumbNameMap,
  };
};

export default withRouter(connect(mapState, mapDispatch)(BasicLayout));
