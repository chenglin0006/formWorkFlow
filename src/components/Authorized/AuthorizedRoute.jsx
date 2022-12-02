/* eslint-disable react/require-default-props */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Authorized from './Authorized';

// TODO: umi只会返回render和rest
const AuthorizedRoute = ({ component: Component, render, authority, redirectPath, ...rest }) => (
  <Authorized
    authority={authority}
    noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
  >
    <Route {...rest} render={(props) => (Component ? <Component {...props} /> : render(props))} />
  </Authorized>
);

AuthorizedRoute.propTypes = {
  component: PropTypes.node,
  render: PropTypes.func,
  authority: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
  redirectPath: PropTypes.string,
};

export default AuthorizedRoute;
