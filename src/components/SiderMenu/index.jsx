import React, { Component } from 'react';
import DrawerMenu from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import PropTypes from 'prop-types';
import SiderMenu from './SiderMenu';

export default class Index extends Component {
  static propTypes = {
    collapsed: PropTypes.bool,
    isMobile: PropTypes.bool,
    isIframe: PropTypes.bool,
    setMenuCollapsed: PropTypes.func,
  };

  static defaultProps = {
    collapsed: true,
    isMobile: false,
    isIframe: false,
    setMenuCollapsed: () => {},
  };

  render() {
    const { collapsed, isMobile, setMenuCollapsed, isIframe } = this.props;
    if (isMobile && !isIframe) {
      return (
        <DrawerMenu
          level={null}
          handler={false}
          open={!collapsed}
          onMaskClick={() => {
            setMenuCollapsed(true);
          }}
        >
          <SiderMenu {...this.props} onCollapse={setMenuCollapsed} collapsed={collapsed} />
        </DrawerMenu>
      );
    }
    return <SiderMenu {...this.props} collapsed={collapsed} onCollapse={setMenuCollapsed} />;
  }
}
