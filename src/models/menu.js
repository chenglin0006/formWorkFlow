import memoizeOne from 'memoize-one';
import isEqual from 'lodash.isequal';
import Authorized from '@/util/Authorized';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority) {
  return data
    .map((item) => {
      if (!item.name || !item.path) {
        return null;
      }

      const result = {
        ...item,
        // name: formatMessage({ id: locale, defaultMessage: item.name }),
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter((item) => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = (item) => {
  if (item.children && !item.hideChildrenInMenu && item.children.some((child) => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = (menuData) => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter((item) => item.name && !item.hideInMenu)
    .map((item) => check(item.authority, getSubMenu(item)))
    .filter((item) => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = (menuData) => {
  const routerMap = {};

  const flattenMenuData = (data) => {
    data.forEach((menuItem) => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  state: {
    menuData: [],
    breadcrumbNameMap: {},
  },
  reducers: {
    save(state, data) {
      return {
        ...state,
        ...data,
      };
    },
  },
  effects: {
    async getMenuData({ routes, authority }) {
      const menuData = filterMenuData(memoizeOneFormatter(routes, authority));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);

      this.save({
        menuData,
        breadcrumbNameMap,
      });
    },
  },
};
