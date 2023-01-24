import request from '@/utils/request';
import { RegisterParamsType } from './data.d';

export async function accountReg (params: RegisterParamsType): Promise<any> {
  return await request({
    url: '/user/register',
    method: 'POST',
    data: params
  });
}
