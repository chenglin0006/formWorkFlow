/* eslint-disable react/prop-types */
import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/util/authority';
import { getPageQuery } from '@/util/common';
import store from '@/store/index';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({ children }) => {
  const NoMatchRedirect = () => {
    let { redirect } = getPageQuery();
    const { stayInLogin } = getPageQuery();
    if (!redirect) {
      redirect = window.location.href;
    }
    // logout会跳转到login页面，因此return不再返回Redirect组件
    store.dispatch.common.logout({ redirect, stayInLogin });

    return null;
  };

  return (
    <Authorized authority={children.props.route.authority} noMatch={<NoMatchRedirect />}>
      {children}
    </Authorized>
  );
};
