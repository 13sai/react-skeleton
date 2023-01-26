import React, { memo, Suspense } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { createUseRoutes, pathKeyCreateUseRoutes } from '@/utils/router';

import PageLoading from '@/components/PageLoading';

import BlankLayout from '@/layouts/BlankLayout';



import SecurityLayout from '@/layouts/SecurityLayout';

import UniversalLayout from '@/layouts/UniversalLayout';

import UniversalLayoutRoutes from '@/layouts/UniversalLayout/routes';

// UserLayout
import UserLayoutRoutes from '@/layouts/UserLayout/routes';
import UserLayout from '@/layouts/UserLayout';
import NotFound from '@/pages/404';

/**
 * 配置所有路由
 */
const routes = createUseRoutes([
  {
    path: '/',
    redirect: '/home',
    children: UniversalLayoutRoutes,
  },
  {
    path: '/user',
    redirect: '/user/login',
    children: UserLayoutRoutes,
  }
]);

/**
 * 配置框架对应的路由
 */
const layoutToRoutes = {
  UniversalLayout: pathKeyCreateUseRoutes([routes[0]]),
  UserLayout: pathKeyCreateUseRoutes([routes[1]]),
};

export const SuspenseLazy = memo(
  ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<PageLoading />}>{children}</Suspense>
  )
);

export default memo(() => {
  const routesElement = useRoutes(routes);
  if (routesElement == null) {
    return (
      <NotFound />
    );
  }
  const location = useLocation();

  if (layoutToRoutes.UniversalLayout[location.pathname]) {
    return (
      <SecurityLayout>
        <UniversalLayout>
          <SuspenseLazy>{routesElement}</SuspenseLazy>
        </UniversalLayout>
      </SecurityLayout>
    );
  }

  if (layoutToRoutes.UserLayout[location.pathname]) {
    return (
      <UserLayout>
        <SuspenseLazy>{routesElement}</SuspenseLazy>
      </UserLayout>
    );
  }

  // 默认 BlankLayout
  return (
    <BlankLayout>
      <SuspenseLazy>{routesElement}</SuspenseLazy>
    </BlankLayout>
  );
});
