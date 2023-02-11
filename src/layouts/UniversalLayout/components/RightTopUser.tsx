import { memo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dropdown, MenuProps } from 'antd';

import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, initialState } from '@/store/user';
import { useI18n } from '@/store/i18n';
import locales from '../locales';

import { resetToken } from '@/utils/token';

import IconSvg from '@/components/IconSvg';


export default memo(() => {
  const t = useRecoilValue(useI18n(locales));
  const [user, setUser] = useRecoilState(userState);

  const items: MenuProps['items'] = [
    {
      key: 'userinfo',
      label: (
        <Link to='/info'>
          {t('universal-layout.topmenu.userinfo')}
        </Link>
      ),
    },
    {
      key: 'logout',
      label: <>{t('universal-layout.topmenu.logout')}</>,
    },
  ];

  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = useCallback(
    ({ key }: { key: string }) => {
      if (key === 'logout') {
        setUser({
          ...user,
          ...initialState,
        });
        resetToken();
        navigate('/user/login', {
          replace: true,
        });
      }
    },
    [user, setUser]
  );
  return (
    <Dropdown menu={{ items, onClick}}>
      <a
        className='universallayout-top-usermenu ant-dropdown-link'
        onClick={(e) => e.preventDefault()}>
        {user.name}
        <IconSvg name='arrow-down' />
      </a>
    </Dropdown>
  );
});
