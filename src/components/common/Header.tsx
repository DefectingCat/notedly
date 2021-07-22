import React from 'react';
import { PageHeader } from 'antd';
import style from './header.module.scss';

interface Props {
  title: string;
}

const Header = ({ title }: Props): JSX.Element => {
  return (
    <>
      <PageHeader
        backIcon={false}
        className={style['main-header']}
        onBack={() => null}
        title={title}
      />
    </>
  );
};

export default Header;
