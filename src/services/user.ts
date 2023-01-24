import request from '@/utils/request';

export async function queryCurrent (): Promise<any> {
  return await request({
    url: '/user/info',
    method: 'get'
  });
}

export async function queryMessage (): Promise<any> {
  return await request({
    url: '/user/message'
  });
}
