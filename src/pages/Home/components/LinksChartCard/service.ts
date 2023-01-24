import request from '@/utils/request';

export async function annualnewLinks (): Promise<any> {
  return await request({
    url: '/home/links/annualnew',
    method: 'get'
  });
}
