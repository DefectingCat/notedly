import React from 'react';
import { PageHeader } from 'antd';
import style from './header.module.scss';

const Header = (): JSX.Element => {
  return (
    <>
      <PageHeader
        backIcon={false}
        className={style['main-header']}
        onBack={() => null}
        title='首页'
      />
    </>
  );
};

export default Header;
