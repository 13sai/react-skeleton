import { Location, RouteObject } from 'react-router-dom';

export type TabNavType = 'path' | 'querypath';

export type RouteComponent = React.FC<BrowserRouterProps> | (() => any);

export interface IRouteObject {
  [path: sting]: RouteObject;
}

export interface Breadcrumb {
  title: string;
  path: string;
}

export interface IRouteMeta {
  title?: string;
  hidden?: boolean;
  icon?: string;
  roles?: string[];
  breadcrumb?: Breadcrumb[] | false;
  selectLeftMenu?: string;
  parentPath?: string[];
  tabNavType?: TabNavType;

  tabNavCloseBefore?: (close: () => void) => void;
}

export interface IRouter {
  path: string;
  meta?: IRouteMeta;
  redirect?: string;
  component?: RouteComponent;
  children?: IRouter[];
}

export interface IPathKeyRouter {
  [path: string]: IRouter; // 限制 path 为 string
}

export interface IRouterPathKeyRouter {
  router: IRouter[];
  pathKeyRouter: IPathKeyRouter;
}

export interface TabNavItem {
  location: Location;
  menu: IRouter;
}
