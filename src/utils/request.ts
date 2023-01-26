import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { notification } from 'antd';
import settings from '@/config/settings';
import { getToken } from '@/utils/token';

export interface ResponseData<T = unknown> {
  code: number;
  data?: T;
  message?: string;
}

const customCodeMessage: { [key: number]: string } = {
  10002: '信息已失效，请重新登录',
};

const serverCodeMessage: { [key: number]: string } = {
  200: 'success',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  const { response, message } = error;
  if (message === 'CustomError') {
    const { config, data } = response;
    const { url, baseURL } = config;
    const { code, msg } = data;
    const reqUrl = url.split('?')[0].replace(baseURL, '');
    const noVerifyBool = settings.noAuthUrl.includes(reqUrl);
    if (!noVerifyBool) {
      notification.error({
        message: '提示',
        description: customCodeMessage[code] || msg || 'Error',
      });

      if (code === 10002) {
        setTimeout(() => {
          window.location.href = '/user/login';
        }, 500);
      }
    }
  } else if (message === 'CancelToken') {
    // 取消请求 Token
    // eslint-disable-next-line no-console
    console.log(message);
  } else if (response && response.status) {
    const errorText = serverCodeMessage[response.status] || response.statusText;
    const { status, request } = response;
    notification.error({
      message: `请求错误 ${status}: ${request.responseURL}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '网络异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return Promise.reject(error);
};

/**
 * 配置request请求时的默认参数
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_APIHOST || '', // url = api url + request url
  withCredentials: false,
  timeout: 10000, // 请求超时时间,10000(单位毫秒), 0 不做限制
});

/**
 * 请求前
 * 请求拦截器
 */
request.interceptors.request.use(
  (config: AxiosRequestConfig & { cType?: boolean }) => {
    // 如果设置了cType 说明是自定义 添加 Content-Type类型 为自定义post 做铺垫
    if (config.cType) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.setContentType = 'application/json;charset=UTF-8';
    }

    // 自定义添加token header
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.set(settings.tokenKey, token);
    }

    return config;
  }
  /* ,error=> {} */ // 已在 export default catch
);

/**
 * 请求后
 * 响应拦截器
 */
request.interceptors.response.use((response: AxiosResponse<ResponseData>) => {
  const res = response.data;
  const { code } = res;

  if (code !== 0) {
    return Promise.reject({
      response,
      message: 'CustomError',
    });
  }

  return response;
});

export default function ajax<T = any, R = AxiosResponse<T>>(
  config: AxiosRequestConfig & { cType?: boolean }
): AxiosPromise<R> {
  return request(config)
    .then((response: AxiosResponse) => response.data)
    .catch((error) => errorHandler(error));
}
