import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Dropdown, Spin, Avatar, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';
import SiderMenu from '@/components/SiderMenu';
import PageLoading from '@/components/PageLoading';
import Exception403 from '@/components/Exception/403';
import Authorized from '@/util/Authorized';
import { LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined, CaretDownOutlined } from '@ant-design/icons';
import Context from './MenuContext';

import './BasicLayout.less';

const { Header, Content } = Layout;

class BasicLayout extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    logout: PropTypes.func,
    getCurrentUser: PropTypes.func,
    currentUser: PropTypes.object,
    children: PropTypes.node,
    route: PropTypes.object,

    getMenuData: PropTypes.func.isRequired,
    menuData: PropTypes.array.isRequired,
    breadcrumbNameMap: PropTypes.object.isRequired,
  };

  static defaultProps = {
    logout: () => {},
    getCurrentUser: () => {},
    currentUser: {},
    children: null,
    route: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false, // 当前侧边栏收起状态
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

  /**
   * 渲染左侧菜单
   */
  genMenu = () => {
    const { collapsed } = this.state;
    const {
      // route: { routes },
      menuData,
      // breadcrumbNameMap,
    } = this.props;

    return menuData ? (
      <SiderMenu
        className="bnq-sidermenu-wrapper"
        menu={menuData}
        collapsed={collapsed}
        setMenuCollapsed={() => {
          this.setMenuCollapsed();
        }}
        {...this.props}
      />
    ) : null;
  };

  /**
   * 设置菜单收缩状态
   */
  setMenuCollapsed = (iscollapsed) => {
    const collapsed = iscollapsed || !this.state.collapsed;
    this.setState({ collapsed });
  };

  onMenuClick = ({ key }) => {
    const { logout } = this.props;

    if (key === 'logout') {
      logout({ shouldRequest: true, stayInLogin: true });
    }
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
    const { collapsed } = this.state;

    if (!currentUser.id) {
      return <PageLoading />;
    }

    const menu = (
      <Menu className="bnq-global-header-menu" selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出
        </Menu.Item>
      </Menu>
    );

    const routerAuthority = this.getRouterAuthority(pathname, routes);

    return (
      <Context.Provider value={this.getContext()}>
        <Layout className="container">
          {this.genMenu()}
          <Layout
            className="bnq-basiclayout-main"
            style={{
              paddingLeft: collapsed ? '80px' : '230px',
            }}
          >
            <Header className="bnq-global-header">
              <span
                className="bnq-global-header-trigger"
                onClick={() => {
                  this.setMenuCollapsed();
                }}
              >
                {this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </span>
              <div className="bnq-global-header-right">
                {/* <Link to="/my/message" className="bnq-global-header-action">
                  <Badge
                    className="bnq-global-header-message-badge"
                    // count={3}
                    dot={hasMessage}
                    style={{ boxShadow: 'none' }}
                  >
                    <BellOutlined className="bnq-global-header-message-icon" />
                  </Badge>
                </Link> */}

                {currentUser.id ? (
                  <Fragment>
                    <Dropdown overlay={menu}>
                      <span className="bnq-global-header-action bnq-global-header-account">
                        <Avatar
                          size="small"
                          className="bnq-global-header-avatar"
                          icon={<UserOutlined />}
                          src={currentUser.profilePhoto}
                          alt="avatar"
                        />
                        <span className="bnq-global-header-name">
                          {currentUser.storeName || currentUser.name}
                          <CaretDownOutlined style={{ fontSize: '12px', paddingLeft: 4 }} />
                        </span>
                      </span>
                    </Dropdown>
                  </Fragment>
                ) : (
                  <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
                )}
              </div>
            </Header>
            <Content className="bnq-basiclayout-content">
              <React.Suspense fallback={<PageLoading delay={200} />}>
                <Authorized authority={routerAuthority} noMatch={<Exception403 />}>
                  {children}
                </Authorized>
              </React.Suspense>
            </Content>
          </Layout>
        </Layout>
      </Context.Provider>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    getCurrentUser: dispatch.common.getCurrentUser,
    logout: dispatch.common.logout,

    getMenuData: dispatch.menu.getMenuData,
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
