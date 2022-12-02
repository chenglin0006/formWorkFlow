import React, { Component } from 'react';
import { Router, Route, Redirect } from 'react-router-dom';
import history from '@/router/history';
import loadable from '@loadable/component';
import routesConfig from 'config/routes';
import renderRoutes from '@/router/renderRouter';
import PageLoading from '@/components/PageLoading';
import Exception404 from '@/components/Exception/404';
import { isMobile } from '@/util/const';
import { getAuthority } from '@/util/authority';
import './index.less';

class App extends Component {
  static propTypes = {};

  static defaultProps = {};

  _handleRoutes = (routes) => {
    if (!routes) {
      return [];
    }

    return routes.map((route) => {
      if (route.redirect || !route.routes) {
        route.exact = true;
      }

      if (route.component) {
        route.component = loadable(route.component, {
          fallback: <PageLoading />,
        });
      }

      if (route.routes) {
        route.routes = this._handleRoutes(route.routes);
      }

      return route;
    });
  };

  render() {
    const routes = this._handleRoutes(routesConfig);

    return (
      <Router history={history}>
        <Route
          render={({ location }) => {
            const { pathname } = location;
            // eslint-disable-next-line no-unused-vars
            const auth = getAuthority();

            // 如果已登录，即auth存在时，/user下的页面重定向到首页
            // if (/^\/user/.test(pathname) && auth) {
            //   return <Redirect to="/" />;
            // }

            // 重定向到对应设备支持的页面
            if (/^\/h5/.test(pathname) && !isMobile) {
              const nextUrl = pathname.replace('/h5', '');
              return <Redirect to={nextUrl} />;
            }
            // user下面的页面和绑定第三方账号的页面属于h5和pc端公用的页面，不需处理
            if (
              !/^\/user/.test(pathname) &&
              !/^\/thirdLogin/.test(pathname) &&
              !/^\/exceptionError/.test(pathname) &&
              !/^\/testDrag/.test(pathname) &&
              !/^\/debug/.test(pathname) &&
              !/^\/oauth/.test(pathname) &&
              !/^\/h5/.test(pathname) &&
              isMobile
            ) {
              let nextUrl = `/h5${pathname}`;
              if (location.search) {
                nextUrl += location.search;
              }
              return <Redirect to={nextUrl} />;
            }

            return location.state && location.state.is404 ? (
              <Exception404 />
            ) : (
              <React.Suspense fallback={<PageLoading />}>{renderRoutes(routes)}</React.Suspense>
            );
          }}
        />
        {/* <React.Suspense fallback={<PageLoading />}>
                    {renderRoutes(routes)}
                </React.Suspense> */}
      </Router>
    );
  }
}

export default App;
