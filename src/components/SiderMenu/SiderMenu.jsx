import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import Icon, { createFromIconfontCN } from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { isUrl, isImgStr } from '@/util/common';
import { projectName, iconScriptUrl } from 'config/config';
import { TreeIterator } from '@/util';
import logoImage from '@/assets/img/logo.png';

import './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

const IconFont = createFromIconfontCN({
  scriptUrl: iconScriptUrl,
});

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: '/favicon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon, iconPrefixes = 'icon-') => {
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImgStr(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className="ant-pro-sider-menu-icon" />} />;
    }
    if (icon.startsWith(iconPrefixes)) {
      return <IconFont type={icon} />;
    }
  }
  return icon;
};

/**
 *  根据路由地址获取获取当前展开菜单keys
 */
const getCurrentOpenKey = (menu, pathname) => {
  return menu
    ? menu.reduce((acc, cur) => {
        if (pathname.indexOf(cur.path) === 0) {
          if (cur.children) {
            const childrenKeys = getCurrentOpenKey(cur.children, pathname);
            acc.push(...childrenKeys);
          }

          acc.push(cur.path);
        }
        return acc;
      }, [])
    : [];
};

@withRouter
export default class SiderMenu extends Component {
  static propTypes = {
    location: PropTypes.object,
    menu: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    collapsed: PropTypes.bool,
    isMobile: PropTypes.bool,
    isIframe: PropTypes.bool,
    defaultOpenKeys: PropTypes.array,
    iconPrefixes: PropTypes.string,
  };

  static defaultProps = {
    location: {},
    menu: [],
    children: [],
    collapsed: false,
    isMobile: false,
    isIframe: false,
    defaultOpenKeys: [],
  };

  constructor(props) {
    super(props);
    const {
      menu,
      location: { pathname },
    } = props;

    this.state = {
      openKeys: menu && menu.length > 0 ? getCurrentOpenKey(menu, pathname) : [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    const { menu, location } = props;
    if (location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getCurrentOpenKey(menu, location.pathname),
      };
    }
    return null;
  }

  /**
   *  根据路由地址获取获取当前选中菜单key
   */
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
      menu,
    } = this.props;
    const tree = TreeIterator.filter(menu, (item) => {
      return pathToRegexp(item.path, [], { end: false }).test(pathname);
    });
    const res = tree.map((m) => {
      return m.key || m.path;
    });

    return res;
  };

  /**
   * 生成菜单
   */
  getNavMenuItems(menusData) {
    const { iconPrefixes } = this.props;
    const { pathname } = this.props.location;
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }

      let itemPath;
      if (item.path && item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (
        item.children &&
        !item.hideChildrenInMenu &&
        item.children.some((child) => {
          return child.name;
        })
      ) {
        return item.hideInMenu ? null : (
          <SubMenu
            title={
              item.icon ? (
                <span className="menu-item">
                  {/* <Icon type={item.icon} /> */}
                  {getIcon(item.icon, iconPrefixes)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children)}
          </SubMenu>
        );
      }
      const icon = item.icon && getIcon(item.icon, iconPrefixes);
      return item.hideInMenu ? null : (
        <Menu.Item key={item.key || item.path} className="menu-item">
          {/^https?:\/\//.test(itemPath) ? (
            <a href={itemPath} target={item.target}>
              {icon}
              <span>{item.name}</span>
            </a>
          ) : (
            <Link to={itemPath} target={item.target} replace={itemPath === pathname}>
              {icon}
              <span>{item.name}</span>
            </Link>
          )}
        </Menu.Item>
      );
    });
  }

  /**
   * 判断是否为一级菜单
   */
  isMainMenu = (key) => {
    const { menu } = this.props;
    return menu.some((item) => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  /**
   * 菜单展开控制
   */
  handleOpenChange = (openKeys) => {
    const moreThanOne = openKeys.filter((openKey) => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  /**
   *  菜单顶部logo和标题
   */
  genLogo = () => {
    return (
      <div className="logoContainer" style={{ overflow: 'hidden' }}>
        <Link to="/">
          <img src={logoImage} alt={projectName} className="logo" />
          <div className="title-wrapper">
            <div className="title">{projectName}</div>
            {/* <div className="sub-title">商家端</div> */}
          </div>
        </Link>
      </div>
    );
  };

  render() {
    const { collapsed, menu } = this.props;
    const menuProps = collapsed
      ? {}
      : {
          openKeys: this.state.openKeys,
        };

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bnq-fixed-sider"
        mode={collapsed ? 'vertical' : 'inline'}
        width="230px"
      >
        {this.genLogo()}
        <div className="bnq-sider-menu">
          <Menu
            // defaultOpenKeys={defaultOpenKeys}
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getSelectedMenuKeys()}
          >
            {this.getNavMenuItems(menu)}
          </Menu>
        </div>
      </Sider>
    );
  }
}
