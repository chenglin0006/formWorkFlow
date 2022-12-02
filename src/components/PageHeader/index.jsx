/* eslint-disable arrow-body-style */
import React, { PureComponent } from 'react';
import { PageHeader } from 'antd';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import MenuContext from '@/layouts/MenuContext';
import BreadcrumbView from '../Breadcrumb/BreadcrumbView';

import './index.less';

function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? <span>{route.name}</span> : <Link to={paths.join('/')}>{route.name}</Link>;
}

@withRouter
export default class Index extends PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    children: PropTypes.node,
    routes: PropTypes.array,
    match: PropTypes.object.isRequired,
    hiddenBreadcrumb: PropTypes.bool,
  };

  static defaultProps = {
    title: undefined,
    children: null,
    routes: [],
    hiddenBreadcrumb: false,
  };

  render() {
    const { children, hiddenBreadcrumb, title, routes, ...rest } = this.props;

    const { match } = this.props;
    const pathSnippets = match.path.split('/').filter((i) => i);
    // eslint-disable-next-line no-unused-vars
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return url;
    });

    return (
      <div className="bnq-pageheader-wrapper">
        <MenuContext.Consumer>
          {(value) => {
            const { breadcrumbNameMap } = value;
            const name = breadcrumbNameMap[match.path] && breadcrumbNameMap[match.path].name;

            return (
              <PageHeader
                className="site-page-header"
                title={title || name}
                breadcrumb={{ itemRender, routes }}
                {...rest}
              >
                {hiddenBreadcrumb ? null : <BreadcrumbView {...this.props} {...value} />}
                {children}
              </PageHeader>
            );
          }}
        </MenuContext.Consumer>
      </div>
    );
  }
}
