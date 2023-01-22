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
  10002: '登入信息已失效，请重新登入再操作',
};

const serverCodeMessage: { [key: number]: string } = {
  200: '服务器成功返回请求的数据',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: '服务器发生错误，请检查服务器(Internal Server Error)',
  502: '网关错误(Bad Gateway)',
  503: '服务不可用，服务器暂时过载或维护(Service Unavailable)',
  504: '网关超时(Gateway Timeout)',
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
  withCredentials: false, // 当跨域请求时发送cookie
  timeout: 5000, // 请求超时时间,5000(单位毫秒), 0 不做限制
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
