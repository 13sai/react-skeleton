import { MockMethod } from 'vite-plugin-mock';
const ajaxHeadersTokenKey = 'token';
export default [

  {
    url: '/api/uploads',
    method: 'POST',
    response: () => {
      return {
        code: 0,
        data: {
          id: 1,
          url:
          'https://github.13sai.com/images/qiniu/zan.png',
          name: 'zan.jpg',
        },
      };
    },
  },

  {
    url: '/api/500',
    method: 'get',
    // statusCode: 401,
    response: ({ headers, body }) => {
      return {
        timestamp: 1513932555104,
        status: 500,
        error: 'error',
        message: 'error',
        path: '/500',
      }
    },
  },
] as MockMethod[];

