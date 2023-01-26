/**
 * 根据 自定义传入验证的权限名 判断当前用户是否有权限
 */
export const permission = (
  userRoles: string[],
  roles?: string | string[]
): boolean => {
  if (userRoles.length < 1) return false;

  if (userRoles.includes('admin')) return true;

  if (typeof roles === 'undefined') return true;

  if (typeof roles === 'string') {
    return userRoles.includes(roles);
  }

  if (roles instanceof Array && roles.length === 0) return true;

  if (roles instanceof Array && roles.length > 0) {
    return roles.some((role) => userRoles.includes(role));
  }

  return false;
};
