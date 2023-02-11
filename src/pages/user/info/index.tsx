import { useRecoilState } from 'recoil';
import { userState } from '@/store/user';

const UserInfo: React.FC = () => {
  const [user] = useRecoilState(userState);
  return (
    <div className='layout-main-conent'>
      {user.name}
    </div>
  );
};

export default UserInfo;
