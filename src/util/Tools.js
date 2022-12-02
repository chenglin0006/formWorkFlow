import dayjs from 'dayjs';
import React from 'react';
import { message, Popover } from 'antd';
import history from '@/router/history';
import { getPageQuery } from '@/util/common';

export default class Tools {
  /**
   * 对下拉菜单的数据进行处理，以满足Select公共控件对于字段的要求
   * MakeSearch中select的字段类型为[name, id]
   * @param data 原始数据
   * @param maps 字段匹配配置 {key: [] || '' }
   *  key为数组时，按照数组中拿到的第一个有数据的字段来处理
   *  例如后端数据格式为{ name: xxx, id: 1, code: 'x111'}
   *  传入maps {id: ['code', id]} 则在后端数据code有值时使用code code无数据时使用id
   * @returns {{name: *, id: *}[]}
   */
  static mapSelect = (data = [], maps = {}) => {
    return data.map((item) => {
      let name = 'name';
      let id = 'id';
      if (Array.isArray(maps.name)) {
        name = maps.name.find((findItem) => {
          return Boolean(item[findItem]);
        });
      } else if (typeof maps.name === 'string') {
        name = maps.name;
      }
      if (Array.isArray(maps.id)) {
        id = maps.id.find((findItem) => {
          return Boolean(item[findItem]);
        });
      } else if (typeof maps.id === 'string') {
        id = maps.id;
      }
      return {
        name: item[name],
        id: item[id],
      };
    });
  };
  /**
   * 生成tabal的columns方法
   * @param options  [{
   *     name: string.isRequired
   * }]，需传递name dataindex
   * @returns {*}
   */
  static genTableOptions = (options) => {
    return options.map((item) => {
      return {
        ...item,
        title: item.name,
        dataIndex: item.dataindex,
        key: item.dataindex,
        width: item.width || 120,
        className: 'tableStyle',
        render: typeof item.render === 'function' && item.render,
      };
    });
  };

  static createUrl = (request) => {
    let { url } = request;
    const { param } = request;

    if (param) {
      url = !url.includes('?') && `${url}?`;
      for (const key of Object.keys(param)) {
        url = `${url + key}=${encodeURI(param[key])}&`;
      }
      if (url.endsWith('&')) {
        url = url.substring(0, url.length - 1);
      }
    }
    return url;
  };

  static getUrlArg = (name, isSearchFromCookies) => {
    let { search } = window.location;
    // IE9(通过window.history.replaceState来判断IE9和其他浏览器，不考虑IE8及以下浏览器)时，search的值从cookie中获取
    if (isSearchFromCookies && !window.history.replaceState) {
      search = unescape(getCookie('CURRENT_SEARCH'));
    }
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const arg = search.substr(1).match(reg);
    return arg ? arg[2] : '';
  };

  static getCookie = (cookieName) => {
    const cookieStr = decodeURI(document.cookie);
    const arr = cookieStr.split('; ');
    let cookieValue = '';
    for (let i = 0; i < arr.length; i++) {
      const temp = arr[i].split('=');
      if (temp[0] == cookieName) {
        cookieValue = temp[1];
        break;
      }
    }
    return decodeURI(cookieValue);
  };

  static setCookie = (name, value, path) => {
    const days = 30;
    const exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=${path}`;
  };
  static formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return date && dayjs(date).format(format);
  }
  static getPageQuery = () => {
    const url = location.search; //获取url中"?"符后的字串
    const res = {};
    if (url.indexOf('?') != -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        res[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
    }
    return res;
  };
  //处理超过多少字省略,text-文案，maxLength-允许最长的字符数，placement气泡框位置，styleObject气泡框样式
  static spanTitleDeal = (text, maxLength, placement, styleObject) => {
    let value = text;
    if (text && text.length > maxLength) {
      value = text.substring(0, maxLength) + '...';
    }
    let isShowTitle = text ? (text.length > maxLength ? true : false) : false;
    let baseStyle = { width: '200px', wordBreak: 'break-all' };
    let style = Object.assign({}, baseStyle, styleObject || {});
    return isShowTitle ? (
      <Popover content={text} placement={placement} overlayStyle={style}>
        <span>{value}</span>
      </Popover>
    ) : (
      <span>{text}</span>
    );
  };

  //深拷贝
  static deepClone = (obj) => {
    var str,
      newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
      return;
    } else if (window.JSON) {
      (str = JSON.stringify(obj)), //序列化对象
        (newobj = JSON.parse(str)); //还原
    } else {
      for (var i in obj) {
        newobj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
      }
    }
    return newobj;
  };

  static loginRedirect = () => {
    let { redirect } = getPageQuery();
    if (localStorage.getItem('redirectUrl')) {
      redirect = localStorage.getItem('redirectUrl');
    }
    if (redirect) {
      try {
        const currentUrl = new URL(window.location.href);
        const redirectUrl = new URL(redirect);
        var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        // 处理回跳url不合法场景，直接进portal页
        if (!reg.test(redirectUrl)) {
          message.info('回跳url不正确');
          history.push('/');
          return;
        }
        if (redirectUrl.origin === currentUrl.origin) {
          redirect = redirect.substr(currentUrl.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect; // 非同源利用window.location跳转
          return null;
        }
      } catch (e) {
        console.error(e.message);
        message.info(e.message);
        history.push('/');
        return;
      }
    }
    history.push(redirect || '/');
  };

  static uuid = () => {
    var s = [];
    var hexDigits = '0123456789abcdef';
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    var uuid = s.join('');
    return uuid;
  };
}
