import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout, Dropdown, Spin, Avatar, Menu, Tooltip } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  AppstoreAddOutlined,
  LogoutOutlined,
  DownOutlined,
  UnlockOutlined,
  TeamOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';
import PageLoading from '@/components/PageLoading';
import Exception403 from '@/components/Exception/403';
import Authorized from '@/util/Authorized';
import { isTouch } from '@/util/const';
// import logoImage from '@/assets/img/header-logo.svg';
import { defaultLogo } from 'config/config';
import styles from './SimpleLayout.module.less';
import Context from '../MenuContext';

const { Header, Content } = Layout;

class BasicLayout extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    children: PropTypes.node,
    route: PropTypes.object,
    isTeamPage: PropTypes.bool,

    getMenuData: PropTypes.func.isRequired,
    // menuData: PropTypes.array.isRequired,
    breadcrumbNameMap: PropTypes.object.isRequired,
  };

  static defaultProps = {
    currentUser: {},
    children: null,
    route: {},
    isTeamPage: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
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

    // 确保获取用户信息和权限后再渲染菜单
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

  onVisibleChange = (visible) => {
    this.setState({ visible });
  };

  onMenuClick = ({ key }) => {
    const { history } = this.props;

    if (key === 'logout') {
      this.onLogout();
    } else if (key === 'info') {
      history.push('/account/info');
    } else if (key === 'bind-app') {
      history.push('/account/bind-app');
    } else if (key === 'password') {
      history.push('/account/password');
    } else if (key === 'permission') {
      history.push('/account/permission');
    } else if (key === 'assets') {
      history.push('/account/assets');
    }
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

    // 确保用户信息返回后再渲染内容
    if (!currentUser.id) {
      return <PageLoading />;
    }

    const menu = (
      <Menu className="bnq-global-header-menu" selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="info">
          <UserOutlined />
          个人信息
        </Menu.Item>
        <Menu.Item key="assets">
          <TransactionOutlined />
          我的资产
        </Menu.Item>
        <Menu.Item key="permission">
          <UnlockOutlined />
          我的权限
        </Menu.Item>
        <Menu.Item key="bind-app">
          <AppstoreAddOutlined />
          关联应用
        </Menu.Item>
        <Menu.Item key="password">
          <LockOutlined />
          修改密码
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出
        </Menu.Item>
      </Menu>
    );

    const routerAuthority = this.getRouterAuthority(pathname, routes);

    return (
      <Context.Provider value={this.getContext()}>
        <Layout className={styles.simpleLayout}>
          <Header className={styles.header}>
            <div className={styles.headerContent}>
              <Link to="/">
                <div className={styles.left}>
                  <div className={styles.logo}>
                    <img src={defaultLogo} alt="logo" className="logo" />
                  </div>
                </div>
              </Link>

              <div className={styles.right}>
                {currentUser.id ? (
                  <Fragment>
                    <Tooltip title="我的团队" placement="top">
                      <Avatar
                        onClick={() => this.props.history.push('/account/team')}
                        alt="avatar"
                        style={{ cursor: 'pointer', marginRight: '8px' }}
                        size="small"
                        icon={<TeamOutlined />}
                      />
                    </Tooltip>
                    <Dropdown
                      overlay={menu}
                      trigger={isTouch ? ['click'] : ['hover']} // hover在ipad等触摸屏上上无法正常触发
                      // getPopupContainer={(triggerNode) => {
                      //   return triggerNode.parentElement;
                      // }}
                      onVisibleChange={this.onVisibleChange}
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className={styles.rightAction}>
                        <Avatar
                          size="small"
                          className={styles.avatar}
                          src={currentUser.picture}
                          icon={<UserOutlined />}
                          alt="avatar"
                        />
                        <span className={styles.username}>{currentUser.displayName}</span>
                        <span className={styles.arrow}>
                          <DownOutlined rotate={this.state.visible ? 180 : 0} />
                        </span>
                      </span>
                    </Dropdown>
                  </Fragment>
                ) : (
                  <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
                )}
              </div>
            </div>
          </Header>
          <Content className={styles.content} style={{ maxWidth: this.props.isTeamPage ? '1200px' : '1000px' }}>
            <React.Suspense fallback={<PageLoading delay={200} />}>
              <Authorized authority={routerAuthority} noMatch={<Exception403 />}>
                {children}
              </Authorized>
            </React.Suspense>
          </Content>
        </Layout>
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
    isTeamPage: state.account.isTeamPage,
  };
};

export default withRouter(connect(mapState, mapDispatch)(BasicLayout));
