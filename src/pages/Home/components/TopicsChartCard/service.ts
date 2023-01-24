import request from '@/utils/request';

export async function monthnewTopics (): Promise<any> {
  return await request({
    url: '/home/topics/monthnew',
    method: 'get'
  });
}
