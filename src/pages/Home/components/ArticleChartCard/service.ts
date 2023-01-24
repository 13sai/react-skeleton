import request from '@/utils/request';

export async function dailynewArticles (): Promise<any> {
  return await request({
    url: '/home/articles/dailynew',
    method: 'get'
  });
}
