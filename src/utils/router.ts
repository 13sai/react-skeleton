import { createElement } from 'react';
import { Navigate, RouteObject, Location } from 'react-router-dom';
import {
  IRouter,
  IPathKeyRouter,
  IRouterPathKeyRouter,
  Breadcrumb,
  TabNavType,
} from '../types/router';
import { isExternal, equalObject } from './common';
import { merge } from 'lodash/fp';
import qs from 'query-string';

export const createUseRoutes = (
  configRoutes: IRouter[],
  parentPath = '/'
): RouteObject[] => {
  const routes: RouteObject[] = [];
  for (let i = 0; i < configRoutes.length; i++) {
    const item = configRoutes[i];
    if (isExternal(item.path)) {
      continue;
    }

    const routesItem: RouteObject = {};

    routesItem.path = item.path.startsWith('/')
      ? item.path
      : parentPath.endsWith('/')
        ? parentPath
        : parentPath + '/' + item.path;

    if (item.component) {
      routesItem.element = createElement(item.component);
    }

    const children: RouteObject[] = [];
    if (item.redirect) {
      children.push({
        path: routesItem.path,
        element: createElement(Navigate, { to: item.redirect }),
      });
    }

    if (item.children) {
      children.push(...createUseRoutes(item.children, routesItem.path));
    }

    if (children.length > 0) {
      routesItem.children = children;
    }

    routes.push(routesItem);
  }

  return routes;
};

export const pathKeyCreateUseRoutes = (
  routes: RouteObject[]
): IPathKeyRouter => {
  let items: IPathKeyRouter = {};
  for (let i = 0; i < routes.length; i++) {
    const item = routes[i];
    items[item.path || ''] = {
      ...item,
    };

    if (item.children) {
      items = merge(items, pathKeyCreateUseRoutes(item.children));
    }
  }

  return items;
};

export const formatRoutes = (
  routes: IRouter[],
  parentPath = '/',
  parentPaths: string[] = []
): IRouterPathKeyRouter => {
  const items: IRouter[] = [];
  let newRoutes: IPathKeyRouter = {};

  for (let i = 0; i < routes.length; i++) {
    const item = routes[i];
    const newItem: IRouter = {
      ...item,
    };

    let path = item.path || '';
    if (!isExternal(item.path)) {
      path = item.path.startsWith('/')
        ? item.path
        : parentPath.endsWith('/')
          ? parentPath
          : parentPath + '/' + item.path;
    }
    newItem.path = path;

    const meta = item.meta || {};
    const parent =
      meta.parentPath && meta.parentPath.length > 0
        ? meta.parentPath
        : parentPaths;
    meta.parentPath = parent;
    newItem.meta = meta;

    let children: IRouter[] | undefined;
    let pkChildren: IPathKeyRouter | undefined;
    if (item.children) {
      const formatRoute = formatRoutes(item.children, path, [...parent, path]);

      children = formatRoute.router;
      newItem.children = children;

      pkChildren = formatRoute.pathKeyRouter;
    }

    items.push(newItem);
    newRoutes[path] = newItem;
    if (pkChildren) {
      newRoutes = merge(newRoutes, pkChildren);
    }
  }

  return {
    router: items,
    pathKeyRouter: newRoutes,
  };
};

/**
 * 根据路由 pathname 数组 - 返回对应的 route 数组
 * @param pathname string[] 路由path数组
 * @param jsonRoutesData IPathKeyRouter 经过formatRoutes处理，框架的所有pathKeyRouter路由
 */
export const getPathsRoutes = (
  pathname: string[],
  routes: IPathKeyRouter
): IRouter[] => {
  const routeItem: IRouter[] = [];

  for (let i = 0; i < pathname.length; i++) {
    const item = routes[pathname[i]] || {};
    if (item.path !== '') {
      routeItem.push(item);
    }
  }

  return routeItem;
};

export const getBreadcrumbRoutes = (
  pathname: string,
  routes: IPathKeyRouter
): Breadcrumb[] => {
  const route: IRouter = routes[pathname] || {};
  if (!route.path) return [];

  if (!route.meta?.breadcrumb) {
    const parantPath = route.meta?.parentPath || [];
    const pathRoutes = getPathsRoutes(parantPath, routes);
    const breadcrumb: Breadcrumb[] = [];

    for (let i = 0; i < pathRoutes.length; i++) {
      const ele = pathRoutes[i];
      breadcrumb.push({
        title: ele.meta?.title || '',
        path: ele.path,
      });
    }

    if (route.meta?.breadcrumb === false) {
      return breadcrumb;
    }

    breadcrumb.push({
      title: route.meta?.title || '',
      path: route.path,
    });

    return breadcrumb;
  }

  return route.meta.breadcrumb;
};

/**
 * 判断tabNav，对应的Location是否相等
 * @param route1 vue-route
 * @param route2 vue-route
 * @param type 判断规则
 * @returns
 */
export const equalTabNavRoute = (
  location1: Location,
  location2: Location,
  type: TabNavType = 'path'
): boolean => {
  let is = false;
  switch (type) {
  case 'querypath': // path + query
    is =
        equalObject(qs.parse(location1.search), qs.parse(location2.search)) &&
        location1.pathname === location2.pathname;
    break;
  default: // path
    is = location1.pathname === location2.pathname;
    break;
  }

  return is;
};
