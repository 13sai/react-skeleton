import request from '@/utils/request';

export async function weeknewWorks (): Promise<any> {
  return await request({
    url: '/home/works/weeknew',
    method: 'get'
  });
}
