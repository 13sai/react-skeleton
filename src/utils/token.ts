import settings from '@/config/settings';

export const setToken = (token: string) => {
  localStorage.setItem(settings.tokenKey, token);
};

export const getToken = () => localStorage.getItem(settings.tokenKey);

export const resetToken = () => {
  localStorage.removeItem(settings.tokenKey);
};
