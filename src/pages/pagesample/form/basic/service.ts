import request from '@/utils/request';
import { FormDataType } from './data.d';

export async function createData (params: FormDataType): Promise<any> {
  return await request({
    url: '/pages/form',
    method: 'POST',
    data: params
  });
}
