/* eslint-disable react/prop-types */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import RedirectTo404 from '@/components/RedirectTo404';

const RouteInstanceMap = {
  get(key) {
    return key._routeInternalComponent;
  },
  has(key) {
    return key._routeInternalComponent !== undefined;
  },
  set(key, value) {
    key._routeInternalComponent = value;
  },
};

// Support pass props from layout to child routes
const RouteWithProps = ({ path, exact, strict, render, location, ...rest }) => {
  return (
    <Route
      path={path}
      exact={exact}
      strict={strict}
      location={location}
      render={(props) => {
        return render({ ...props, ...rest });
      }}
    />
  );
};

function getCompatProps(props) {
  const compatProps = {};

  if (props.match && props.match.params && !props.params) {
    compatProps.params = props.match.params;
  }

  return compatProps;
}

function withRoutes(route) {
  if (RouteInstanceMap.has(route)) {
    return RouteInstanceMap.get(route);
  }

  const { Routes } = route;
  let len = Routes.length - 1;
  let Component = (args) => {
    const { render, ...props } = args;
    return render(props);
  };
  while (len >= 0) {
    const AuthRoute = Routes[len];
    const OldComponent = Component;
    Component = (props) => {
      return (
        <AuthRoute {...props}>
          <OldComponent {...props} />
        </AuthRoute>
      );
    };
    len -= 1;
  }

  const ret = (args) => {
    const { render, ...rest } = args;
    return (
      <RouteWithProps
        {...rest}
        render={(props) => {
          const compatProps = getCompatProps(props);
          return <Component {...props} {...compatProps} route={route} render={render} />;
        }}
      />
    );
  };
  RouteInstanceMap.set(route, ret);
  return ret;
}

export default function renderRoutes(routes, extraProps = {}, switchProps = {}) {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => {
        if (route.redirect) {
          return (
            <Redirect
              key={route.key || i}
              from={route.path}
              to={route.redirect}
              exact={route.exact}
              strict={route.strict}
            />
          );
        }
        const RouteRoute = route.Routes ? withRoutes(route) : RouteWithProps;
        return (
          <RouteRoute
            key={route.key || i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={(props) => {
              const childRoutes = renderRoutes(
                route.routes,
                {},
                {
                  location: props.location,
                },
              );
              if (route.component) {
                const compatProps = getCompatProps({
                  ...props,
                  ...extraProps,
                });
                return (
                  <route.component {...props} {...extraProps} {...compatProps} route={route}>
                    {childRoutes}
                  </route.component>
                );
              }
              return childRoutes;
            }}
          />
        );
      })}
      <Route component={RedirectTo404} />
    </Switch>
  ) : null;
}
